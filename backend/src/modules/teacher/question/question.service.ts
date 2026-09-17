import prisma from '../../../prisma/prisma.service';
import { QuestionStatus, ReviewAction } from '@prisma/client';
import { createQuestionSchema, updateQuestionSchema } from './question.schema';

export class QuestionService {
  /**
   * Get questions for a specific organization, optionally filtered by status, category, etc.
   */
  async getQuestions(organizationId: string, filter?: any) {
    return prisma.question.findMany({
      where: {
        organizationId,
        ...filter,
      },
      include: {
        testCases: true,
      }
    });
  }

  /**
   * Get a single question by ID, ensuring it belongs to the organization.
   */
  async getQuestionById(id: string, organizationId: string) {
    return prisma.question.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        testCases: true,
      }
    });
  }

  /**
   * Create a new question. Status is always DRAFT initially.
   */
  async createQuestion(data: any, createdById: string, organizationId: string) {
    const validData = createQuestionSchema.parse(data);
    
    // Separate test cases from the main question data
    const { testCases, ...questionData } = validData;

    return prisma.question.create({
      data: {
        ...questionData,
        createdById,
        updatedById: createdById,
        organizationId,
        status: QuestionStatus.DRAFT,
        testCases: {
          create: testCases,
        },
      },
      include: { testCases: true },
    });
  }

  /**
   * Update an existing draft question.
   */
  async updateQuestion(id: string, data: any, updatedById: string, organizationId: string) {
    // Verify question exists, belongs to org, and is a draft
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) {
      throw new Error("Question not found or unauthorized.");
    }
    if (question.status !== QuestionStatus.DRAFT && question.status !== QuestionStatus.REJECTED) {
      throw new Error("Can only update questions in DRAFT or REJECTED status.");
    }

    const validData = updateQuestionSchema.parse(data);
    const { testCases, ...questionData } = validData;

    // Optional: test case updates (would require deleting old and recreating in a real scenario)
    // For simplicity, we just update the main question details here.

    return prisma.question.update({
      where: { id },
      data: {
        ...questionData,
        updatedById,
        version: question.version + 1,
      },
      include: { testCases: true },
    });
  }

  /**
   * Submit a question for review (DRAFT -> PENDING_REVIEW).
   */
  async submitForReview(id: string, userId: string, organizationId: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) throw new Error("Question not found.");
    if (question.status !== QuestionStatus.DRAFT) throw new Error("Only DRAFT questions can be submitted for review.");

    return prisma.$transaction([
      prisma.question.update({
        where: { id },
        data: { status: QuestionStatus.PENDING_REVIEW },
      }),
      prisma.questionReviewLog.create({
        data: {
          questionId: id,
          reviewedBy: userId,
          action: ReviewAction.SUBMITTED,
        }
      })
    ]);
  }

  /**
   * Approve a question (PENDING_REVIEW -> APPROVED).
   */
  async approveQuestion(id: string, reviewerId: string, organizationId: string, feedback?: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) throw new Error("Question not found.");
    if (question.status !== QuestionStatus.PENDING_REVIEW) throw new Error("Question is not pending review.");

    return prisma.$transaction([
      prisma.question.update({
        where: { id },
        data: { status: QuestionStatus.APPROVED },
      }),
      prisma.questionReviewLog.create({
        data: {
          questionId: id,
          reviewedBy: reviewerId,
          action: ReviewAction.APPROVED,
          feedback,
        }
      })
    ]);
  }

  /**
   * Publish a question (APPROVED -> PUBLISHED).
   */
  async publishQuestion(id: string, organizationId: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) throw new Error("Question not found.");
    if (question.status !== QuestionStatus.APPROVED) throw new Error("Only APPROVED questions can be published.");

    return prisma.question.update({
      where: { id },
      data: { 
        status: QuestionStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }
  
  /**
   * Retire a published question.
   */
  async retireQuestion(id: string, organizationId: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) throw new Error("Question not found.");
    if (question.status !== QuestionStatus.PUBLISHED) throw new Error("Only PUBLISHED questions can be retired.");

    return prisma.question.update({
      where: { id },
      data: { status: QuestionStatus.RETIRED },
    });
  }

  /**
   * Reject a question (PENDING_REVIEW -> REJECTED).
   */
  async rejectQuestion(id: string, reviewerId: string, organizationId: string, feedback?: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) throw new Error("Question not found.");
    if (question.status !== QuestionStatus.PENDING_REVIEW && question.status !== QuestionStatus.DRAFT) {
      throw new Error("Question cannot be rejected from its current state.");
    }

    return prisma.$transaction([
      prisma.question.update({
        where: { id },
        data: { status: QuestionStatus.REJECTED },
      }),
      prisma.questionReviewLog.create({
        data: {
          questionId: id,
          reviewedBy: reviewerId,
          action: ReviewAction.REJECTED,
          feedback,
        }
      })
    ]);
  }

  /**
   * Delete a question permanently.
   */
  async deleteQuestion(id: string, organizationId: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.organizationId !== organizationId) throw new Error("Question not found.");

    // Delete associated test cases first
    await prisma.testCase.deleteMany({ where: { questionId: id } });
    
    // Delete review logs
    await prisma.questionReviewLog.deleteMany({ where: { questionId: id } });

    // Delete question
    return prisma.question.delete({
      where: { id }
    });
  }

  /**
   * Bulk create questions from CSV import.
   */
  async createQuestionsBulk(dataArray: any[], createdById: string, organizationId: string) {
    const results = [];
    for (const data of dataArray) {
      try {
        const result = await this.createQuestion(data, createdById, organizationId);
        results.push({ success: true, data: result });
      } catch (err: any) {
        results.push({ success: false, error: err.message });
      }
    }
    return results;
  }
}

export const questionService = new QuestionService();
