import prisma from '../../prisma/prisma.service';

export const attemptService = {
  async startAttempt(assessmentId: string, studentId: string, organizationId: string) {
    // Verify the assessment is PUBLISHED and belongs to the org
    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, organizationId, status: 'PUBLISHED' },
    });
    if (!assessment) throw new Error('Assessment not available');

    // Check attempt limit
    const existingAttempts = await prisma.assessmentAttempt.count({
      where: { assessmentId, studentId },
    });
    if (existingAttempts >= assessment.attemptLimit) {
      throw new Error('Attempt limit reached');
    }

    return prisma.assessmentAttempt.create({
      data: { assessmentId, studentId, status: 'STARTED' },
      include: { submissions: true },
    });
  },

  async submitAnswer(attemptId: string, itemId: string, studentId: string, marksAwarded: number) {
    // Ensure the attempt belongs to this student and is still STARTED
    const attempt = await prisma.assessmentAttempt.findFirst({
      where: { id: attemptId, studentId, status: 'STARTED' },
    });
    if (!attempt) throw new Error('Attempt not found or already submitted');

    // Upsert using the composite unique constraint @@unique([attemptId, itemId])
    return prisma.assessmentSubmission.upsert({
      where: { attemptId_itemId: { attemptId, itemId } },
      update: { marksAwarded },
      create: { attemptId, itemId, marksAwarded },
    });
  },

  async finishAttempt(attemptId: string, studentId: string) {
    const attempt = await prisma.assessmentAttempt.findFirst({
      where: { id: attemptId, studentId, status: 'STARTED' },
      include: { submissions: true },
    });
    if (!attempt) throw new Error('Attempt not found or already completed');

    const totalScore = attempt.submissions.reduce((sum: number, s: any) => sum + s.marksAwarded, 0);

    return prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        totalScore,
        completedAt: new Date(),
      },
    });
  },
};
