import prisma from '../../../prisma/prisma.service';
import { AssessmentStatus, QuestionStatus } from '@prisma/client';
import { createAssessmentSchema, updateAssessmentSchema } from './assessment.schema';

export class AssessmentService {
  /**
   * Get all assessments for an org.
   */
  async getAssessments(organizationId: string, filter?: any) {
    return prisma.assessment.findMany({
      where: {
        organizationId,
        ...filter,
      },
      include: {
        sections: {
          include: {
            items: true,
          }
        },
        batches: true,
      }
    });
  }

  /**
   * Get assessment by ID.
   */
  async getAssessmentById(id: string, organizationId: string) {
    return prisma.assessment.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        sections: {
          include: {
            items: {
              include: {
                question: true,
              }
            },
          }
        },
        batches: true,
      }
    });
  }

  /**
   * Create new Assessment.
   */
  async createAssessment(data: any, createdById: string, organizationId: string) {
    const validData = createAssessmentSchema.parse(data);
    
    return prisma.assessment.create({
      data: {
        ...validData,
        createdById,
        organizationId,
        status: AssessmentStatus.DRAFT,
      },
    });
  }

  /**
   * Update existing draft assessment.
   */
  async updateAssessment(id: string, data: any, organizationId: string) {
    const validData = updateAssessmentSchema.parse(data);
    
    const assessment = await prisma.assessment.findUnique({ where: { id } });
    if (!assessment || assessment.organizationId !== organizationId) {
      throw new Error("Assessment not found or unauthorized");
    }

    if (assessment.status !== AssessmentStatus.DRAFT && assessment.status !== AssessmentStatus.SCHEDULED) {
      throw new Error("Cannot update an assessment that is already published or closed");
    }

    return prisma.assessment.update({
      where: { id },
      data: validData,
    });
  }

  /**
   * Add a section to an assessment.
   */
  async addSectionToAssessment(assessmentId: string, name: string, order: number, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.findUnique({ where: { id: assessmentId } });
      if (!assessment || assessment.organizationId !== organizationId) throw new Error("Assessment not found");
      if (assessment.status !== AssessmentStatus.DRAFT) throw new Error("Structural changes are only allowed in DRAFT state");

      return tx.assessmentSection.create({
        data: {
          assessmentId,
          name,
          order,
        }
      });
    });
  }

  /**
   * Add a question to an assessment section.
   */
  async addQuestionToSection(sectionId: string, questionId: string, marks: number, order: number, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const section = await tx.assessmentSection.findUnique({
        where: { id: sectionId },
        include: { assessment: true }
      });
      if (!section || section.assessment.organizationId !== organizationId) {
        throw new Error("Section not found");
      }
      if (section.assessment.status !== AssessmentStatus.DRAFT) {
        throw new Error("Structural changes are only allowed in DRAFT state");
      }

      const question = await tx.question.findUnique({ where: { id: questionId } });
      if (!question || question.organizationId !== organizationId) {
        throw new Error("Question not found");
      }

      return tx.assessmentItem.create({
        data: { sectionId, questionId, marks, order }
      });
    });
  }

  /**
   * Remove a question from a section.
   */
  async removeQuestionFromSection(itemId: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.assessmentItem.findUnique({
        where: { id: itemId },
        include: { section: { include: { assessment: true } } }
      });
      
      if (!item || item.section.assessment.organizationId !== organizationId) {
        throw new Error("Item not found");
      }
      if (item.section.assessment.status !== AssessmentStatus.DRAFT) {
        throw new Error("Structural changes are only allowed in DRAFT state");
      }
      
      await tx.assessmentItem.delete({
        where: { id: itemId },
      });
      return true;
    });
  }

  /**
   * Assign a batch to an assessment.
   */
  async assignBatchToAssessment(assessmentId: string, batchId: string, organizationId: string) {
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
    if (!assessment || assessment.organizationId !== organizationId) throw new Error("Assessment not found");

    await prisma.assessmentBatch.create({
      data: {
        assessmentId,
        batchId,
      }
    });
    return true;
  }

  /**
   * Schedule an assessment (DRAFT -> SCHEDULED).
   */
  async scheduleAssessment(id: string, startsAt: Date, endsAt: Date, organizationId: string) {
    if (startsAt >= endsAt) {
      throw new Error("startsAt must be before endsAt");
    }

    const assessment = await prisma.assessment.findUnique({ where: { id } });
    if (!assessment || assessment.organizationId !== organizationId) throw new Error("Assessment not found");
    if (assessment.status !== AssessmentStatus.DRAFT) throw new Error("Can only schedule draft assessments");

    return prisma.assessment.update({
      where: { id },
      data: {
        status: AssessmentStatus.SCHEDULED,
        startsAt,
        endsAt,
      }
    });
  }

  /**
   * Publish an assessment (DRAFT/SCHEDULED -> PUBLISHED).
   * Guard: must have >= 1 section with >= 1 PUBLISHED question.
   */
  async publishAssessment(id: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      // Need to find unique inside transaction to ensure state hasn't changed
      const assessment = await tx.assessment.findUnique({
        where: { id },
        include: {
          sections: {
            include: { items: { include: { question: true }, orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' }
          }
        }
      });
      
      if (!assessment || assessment.organizationId !== organizationId) throw new Error("Assessment not found");
      
      if (assessment.status !== AssessmentStatus.DRAFT && assessment.status !== AssessmentStatus.SCHEDULED) {
        throw new Error("Can only publish DRAFT or SCHEDULED assessments");
      }

      if (assessment.sections.length === 0) {
        throw new Error("Assessment must have at least one section to be published");
      }

      let hasValidQuestions = true;
      for (const section of assessment.sections) {
        if (section.items.length === 0) {
          hasValidQuestions = false;
          break;
        }
        for (const item of section.items) {
          if (item.question.status !== QuestionStatus.PUBLISHED) {
            throw new Error(`Question ${item.question.id} is not PUBLISHED. Cannot publish assessment.`);
          }
        }
      }

      if (!hasValidQuestions) {
        throw new Error("Each section must have at least one question");
      }

      return tx.assessment.update({
        where: { id },
        data: {
          status: AssessmentStatus.PUBLISHED,
          publishedAt: new Date(),
        }
      });
    });
  }

  /**
   * Close an assessment manually.
   */
  async closeAssessment(id: string, organizationId: string) {
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.findUnique({ where: { id } });
      if (!assessment || assessment.organizationId !== organizationId) {
        throw new Error("Assessment not found");
      }
      if (assessment.status !== AssessmentStatus.PUBLISHED) {
        throw new Error("Can only close PUBLISHED assessments");
      }

      return tx.assessment.update({
        where: { id },
        data: { status: AssessmentStatus.CLOSED },
      });
    });
  }
}

export const assessmentService = new AssessmentService();
