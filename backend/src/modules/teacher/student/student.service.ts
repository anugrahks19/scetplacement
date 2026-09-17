import prisma from '../../../utils/prisma';

export const studentService = {
  /**
   * Get all students for a specific organization.
   */
  async getStudents(organizationId: string) {
    return prisma.student.findMany({
      where: { organizationId },
      orderBy: { rollNo: 'asc' },
    });
  },

  /**
   * Get all attempts for a specific assessment.
   */
  async getAssessmentAttempts(assessmentId: string) {
    return prisma.assessmentAttempt.findMany({
      where: { assessmentId },
      include: {
        student: true,
        integrityLogs: true,
      },
      orderBy: { totalScore: 'desc' },
    });
  }
};
