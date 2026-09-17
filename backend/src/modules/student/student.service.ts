import prisma from '../../prisma/prisma.service';

export const studentService = {
  getStudentMe: async (studentId: string, organizationId: string) => {
    return prisma.student.findFirst({
      where: { id: studentId, organizationId },
    });
  },

  getStudentById: async (id: string, organizationId: string) => {
    return prisma.student.findFirst({
      where: { id, organizationId },
    });
  },

  getStudentQuestions: async (organizationId: string, categoryId?: string, topicId?: string) => {
    const where: any = {
      organizationId,
      status: 'PUBLISHED', // Students only see published questions
    };
    if (categoryId) where.categoryId = categoryId;
    if (topicId) where.topicId = topicId;

    return prisma.question.findMany({
      where,
      include: { testCases: true },
    });
  },

  // FIX #2: Scope assessments by student's batchId
  getStudentAssessments: async (organizationId: string, studentId: string) => {
    const student = await prisma.student.findFirst({
      where: { id: studentId, organizationId },
      select: { batchId: true },
    });

    const where: any = {
      organizationId,
      status: 'PUBLISHED',
    };

    // If student has a batch, only show assessments assigned to that batch
    // If no batch is set, show all published assessments (fallback)
    if (student?.batchId) {
      where.batches = {
        some: { batchId: student.batchId },
      };
    }

    return prisma.assessment.findMany({
      where,
      include: {
        sections: { include: { items: true } },
        batches: true,
      },
      orderBy: { startsAt: 'asc' },
    });
  },

  getAttemptById: async (attemptId: string, studentId: string) => {
    return prisma.assessmentAttempt.findFirst({
      where: { id: attemptId, studentId },
      include: { submissions: true, student: true },
    });
  },

  // FIX #3: Calculate real analytics from DB
  getStudentAnalytics: async (studentId: string, organizationId: string) => {
    const student = await prisma.student.findFirst({
      where: { id: studentId, organizationId },
      include: {
        attempts: {
          where: { status: 'COMPLETED' },
          include: { submissions: true },
          orderBy: { completedAt: 'desc' },
          take: 10, // last 10 attempts
        },
      },
    });

    if (!student) throw new Error('Student not found');

    // Calculate component scores from real attempt data
    const completedAttempts = student.attempts;
    const mcqAvg = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + a.mcqScore, 0) / completedAttempts.length
      : 0;
    const codingAvg = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + a.codingScore, 0) / completedAttempts.length
      : 0;

    return {
      readinessScore: student.placementReadiness,
      componentScores: {
        mcq: parseFloat(mcqAvg.toFixed(2)),
        coding: parseFloat(codingAvg.toFixed(2)),
        overall: student.placementReadiness,
      },
      // Interventions will come from coordinator module when built
      assignedInterventions: [],
    };
  },
};
