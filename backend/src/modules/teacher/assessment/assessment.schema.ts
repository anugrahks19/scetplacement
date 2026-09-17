import { z } from 'zod';

export const createAssessmentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().optional(),
  durationMinutes: z.number().int().positive('Duration must be positive'),
  totalMarks: z.number().int().nonnegative('Total marks must be non-negative'),
  negativeMarkingEnabled: z.boolean().default(false),
  attemptLimit: z.number().int().positive().default(1),
  randomizeQuestions: z.boolean().default(false),
  randomizeOptions: z.boolean().default(false),
});

export const updateAssessmentSchema = createAssessmentSchema.partial();
