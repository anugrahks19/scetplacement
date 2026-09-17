import { studentService } from './student.service';

export const resolvers = {
  Query: {
    students: async (_: any, { organizationId }: { organizationId: string }) => {
      return studentService.getStudents(organizationId);
    },
    assessmentAttempts: async (_: any, { assessmentId }: { assessmentId: string }) => {
      return studentService.getAssessmentAttempts(assessmentId);
    }
  },
};
