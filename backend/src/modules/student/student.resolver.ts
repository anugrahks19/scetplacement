import { studentService } from './student.service';
import { authService } from './auth.service';
import { attemptService } from './attempt.service';

export const studentResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized: Students only');
      return studentService.getStudentMe(context.user.id, context.user.organizationId);
    },
    student: async (_: any, { id }: { id: string }, context: any) => {
      // In a real application, you might want to prevent a student from looking up another student
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      if (id !== context.user.id) throw new Error('Unauthorized: Cannot view other students');
      
      return studentService.getStudentById(id, context.user.organizationId);
    },
    studentQuestions: async (_: any, args: any, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      return studentService.getStudentQuestions(context.user.organizationId, args.categoryId, args.topicId);
    },
    studentAssessments: async (_: any, __: any, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      return studentService.getStudentAssessments(context.user.organizationId, context.user.id);
    },
    attempt: async (_: any, { id }: { id: string }, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      return studentService.getAttemptById(id, context.user.id);
    },
    studentAnalytics: async (_: any, { studentId }: { studentId?: string }, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      
      // Default to their own analytics if not provided
      const targetStudentId = studentId || context.user.id;
      if (targetStudentId !== context.user.id) throw new Error('Unauthorized: Cannot view other student analytics');

      return studentService.getStudentAnalytics(targetStudentId, context.user.organizationId);
    }
  },
  
  // Field level resolvers for Security Rules
  Question: {
    content: (parent: any) => {
      // Ensure it is stringified safely if it isn't already
      return typeof parent.content === 'string' ? parent.content : JSON.stringify(parent.content);
    },
    explanation: (parent: any, _: any, context: any) => {
      if (context.user.role === 'STUDENT') {
        // Hide explanation for students. (In the future, we can check if the assessment result is released)
        return null; 
      }
      return parent.explanation;
    },
    testCases: (parent: any, _: any, context: any) => {
      if (context.user.role === 'STUDENT') {
        // Strip out hidden test cases
        return (parent.testCases || []).filter((tc: any) => !tc.isHidden);
      }
      return parent.testCases;
    }
  },

  Mutation: {
    loginStudent: async (_: any, { email, rollNo }: any) => {
      // loginStudent does NOT require a JWT — it IS the auth endpoint
      return authService.loginStudent(email, rollNo);
    },
    startAttempt: async (_: any, { assessmentId }: any, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      return attemptService.startAttempt(assessmentId, context.user.id, context.user.organizationId);
    },
    submitAnswer: async (_: any, { attemptId, itemId, marksAwarded }: any, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      return attemptService.submitAnswer(attemptId, itemId, context.user.id, marksAwarded);
    },
    finishAttempt: async (_: any, { attemptId }: any, context: any) => {
      if (context.user.role !== 'STUDENT') throw new Error('Unauthorized');
      return attemptService.finishAttempt(attemptId, context.user.id);
    },
  },
};
