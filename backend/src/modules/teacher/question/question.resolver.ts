import { questionService } from './question.service';

export const questionResolvers = {
  Query: {
    questions: async (_: any, args: any, context: any) => {
      // Ensure the user is a teacher and has an org
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return questionService.getQuestions(context.user.organizationId, args);
    },
    question: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return questionService.getQuestionById(id, context.user.organizationId);
    },
  },
  Mutation: {
    createQuestion: async (_: any, { input }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      // Parse content from string to JSON
      input.content = JSON.parse(input.content);
      return questionService.createQuestion(input, context.user.id, context.user.organizationId);
    },
    updateQuestion: async (_: any, { id, input }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      if (input.content) {
        input.content = JSON.parse(input.content);
      }
      return questionService.updateQuestion(id, input, context.user.id, context.user.organizationId);
    },
    submitQuestionForReview: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      return questionService.submitForReview(id, context.user.id, context.user.organizationId);
    },
    approveQuestion: async (_: any, { id, feedback }: any, context: any) => {
      // In a real app, you might want to ensure the reviewer is a senior teacher or admin
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') throw new Error('Unauthorized');
      return questionService.approveQuestion(id, context.user.id, context.user.organizationId, feedback);
    },
    publishQuestion: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') throw new Error('Unauthorized');
      return questionService.publishQuestion(id, context.user.organizationId);
    },
    retireQuestion: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') throw new Error('Unauthorized');
      return questionService.retireQuestion(id, context.user.organizationId);
    },
    rejectQuestion: async (_: any, { id, feedback }: any, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') throw new Error('Unauthorized');
      return questionService.rejectQuestion(id, context.user.id, context.user.organizationId, feedback);
    },
    deleteQuestion: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') throw new Error('Unauthorized');
      return questionService.deleteQuestion(id, context.user.organizationId);
    },
    createQuestionsBulk: async (_: any, { input }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      const processedInput = input.map((i: any) => {
        return {
          ...i,
          content: JSON.parse(i.content)
        };
      });
      return questionService.createQuestionsBulk(processedInput, context.user.id, context.user.organizationId);
    }
  },
  Question: {
    content: (parent: any) => JSON.stringify(parent.content),
    testCases: (parent: any, _: any, context: any) => {
      // Only Teachers/Admins can see hidden test cases. 
      // This is a safety net in the GraphQL layer.
      if (context.user.role === 'STUDENT') {
        return parent.testCases.filter((tc: any) => !tc.isHidden);
      }
      return parent.testCases;
    }
  }
};
