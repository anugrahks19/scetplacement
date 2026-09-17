import prisma from '../../../prisma/prisma.service';

export const reviewResolvers = {
  Query: {
    questionReviewLogs: async (_: any, { questionId }: { questionId: string }, context: any) => {
      // Allow only teachers or admins to view review logs
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      // Ensure the question belongs to the user's organization
      const question = await prisma.question.findUnique({ where: { id: questionId } });
      if (!question || question.organizationId !== context.user.organizationId) {
        throw new Error('Question not found or unauthorized');
      }

      return prisma.questionReviewLog.findMany({
        where: { questionId },
        orderBy: { createdAt: 'desc' }
      });
    },
  },
};
