import { aiService } from './ai.service';
import prisma from '../../../prisma/prisma.service';

export const aiResolvers = {
  Query: {
    reviewQuestionWithAi: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'TEACHER' && context.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const question = await prisma.question.findUnique({ where: { id } });
      if (!question || question.organizationId !== context.user.organizationId) {
        throw new Error('Question not found');
      }

      return aiService.reviewQuestion(question.content, question.title);
    }
  },
  Mutation: {
    generateQuestionsWithAi: async (_: any, { topic, count, difficulty, sourceContext, type }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      
      const generated = await aiService.generateQuestions(topic, count, difficulty, sourceContext, type);
      
      return generated;
    },
    generateQuestionBankWithAi: async (_: any, { topic, count, difficulty, sourceContext, type, categoryId, topicId }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      
      const generated = await aiService.generateQuestions(topic, count, difficulty, sourceContext, type);
      const questionType = type || 'MCQ';
      
      let createdCount = 0;
      for (const q of generated) {
        await prisma.question.create({
          data: {
            title: q.title,
            type: questionType,
            difficulty: q.difficulty.toUpperCase(),
            content: q.content,
            explanation: q.explanation || '',
            tags: q.tags || [],
            organizationId: context.user.organizationId,
            createdById: context.user.id,
            updatedById: context.user.id,
            status: 'DRAFT',
            categoryId: categoryId || 'uncategorized',
            topicId: topicId || 'general',
          }
        });
        createdCount++;
      }
      
      return createdCount;
    },
    generateFullQuestionPoolWithAi: async (_: any, { topic, sourceContext, config, categoryId, topicId }: any, context: any) => {
      if (context.user.role !== 'TEACHER') throw new Error('Unauthorized');
      
      const generated = await aiService.bulkGeneratePool(topic, sourceContext, config);
      
      let createdCount = 0;
      for (const q of generated) {
        await prisma.question.create({
          data: {
            title: q.title,
            type: q.type,
            difficulty: q.difficulty.toUpperCase(),
            content: q.content,
            explanation: q.explanation || '',
            tags: q.tags || [],
            organizationId: context.user.organizationId,
            createdById: context.user.id,
            updatedById: context.user.id,
            status: 'DRAFT',
            categoryId: categoryId || 'uncategorized',
            topicId: topicId || 'general',
          }
        });
        createdCount++;
      }
      
      return createdCount;
    }
  }
};
