import { z } from 'zod';
import { QuestionType, Difficulty } from '@prisma/client';

export const createQuestionSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  topicId: z.string().min(1, 'Topic ID is required'),
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(Difficulty),
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.any(), // Typically a JSON object
  explanation: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      isHidden: z.boolean().default(true),
    })
  ).optional().default([]),
});

export const updateQuestionSchema = createQuestionSchema.partial();
