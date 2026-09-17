import { assessmentService } from './assessment.service';

export const assessmentResolvers = {
  Query: {
    assessments: async (_: any, args: any, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return assessmentService.getAssessments(context.user.organizationId, args);
    },
    assessment: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return assessmentService.getAssessmentById(id, context.user.organizationId);
    },
  },
  Mutation: {
    createAssessment: async (_: any, { input }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.createAssessment(input, context.user.id, context.user.organizationId);
    },
    updateAssessment: async (_: any, { id, input }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.updateAssessment(id, input, context.user.organizationId);
    },
    addSectionToAssessment: async (_: any, { assessmentId, name, order }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.addSectionToAssessment(assessmentId, name, order, context.user.organizationId);
    },
    addQuestionToSection: async (_: any, { sectionId, questionId, marks, order }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.addQuestionToSection(sectionId, questionId, marks, order, context.user.organizationId);
    },
    removeQuestionFromSection: async (_: any, { itemId }: { itemId: string }, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.removeQuestionFromSection(itemId, context.user.organizationId);
    },
    assignBatchToAssessment: async (_: any, { assessmentId, batchId }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.assignBatchToAssessment(assessmentId, batchId, context.user.organizationId);
    },
    scheduleAssessment: async (_: any, { id, startsAt, endsAt }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.scheduleAssessment(id, new Date(startsAt), new Date(endsAt), context.user.organizationId);
    },
    publishAssessment: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.publishAssessment(id, context.user.organizationId);
    },
    closeAssessment: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return assessmentService.closeAssessment(id, context.user.organizationId);
    }
  },
};
