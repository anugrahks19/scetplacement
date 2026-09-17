import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import jwt from 'jsonwebtoken';
import { questionTypeDefs } from './modules/teacher/question/question.types';
import { questionResolvers } from './modules/teacher/question/question.resolver';
import { reviewTypeDefs } from './modules/teacher/review/review.types';
import { reviewResolvers } from './modules/teacher/review/review.resolver';
import { assessmentTypeDefs } from './modules/teacher/assessment/assessment.types';
import { assessmentResolvers } from './modules/teacher/assessment/assessment.resolver';
import { aiTypeDefs } from './modules/teacher/ai/ai.types';
import { aiResolvers } from './modules/teacher/ai/ai.resolver';
import { typeDefs as teacherStudentTypeDefs } from './modules/teacher/student/student.types';
import { resolvers as teacherStudentResolvers } from './modules/teacher/student/student.resolver';

// Student Portal Module
import { studentTypeDefs } from './modules/student/student.types';
import { studentResolvers } from './modules/student/student.resolver';

const typeDefs = `#graphql
  ${questionTypeDefs}
  ${reviewTypeDefs}
  ${assessmentTypeDefs}
  ${aiTypeDefs}
  ${studentTypeDefs}
  ${teacherStudentTypeDefs}
`;

const resolvers = [
  questionResolvers,
  reviewResolvers,
  assessmentResolvers,
  aiResolvers,
  teacherStudentResolvers,
  studentResolvers,
];

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');

      // Allow loginStudent mutation to proceed without a token
      const body = (req as any).body;
      const operationName = body?.operationName;
      const queryStr: string = body?.query || '';
      const isLoginMutation = queryStr.includes('loginStudent');

      if (!token && !isLoginMutation) {
        throw new Error('Authentication required');
      }

      if (!token) {
        return { user: null }; // loginStudent will handle unauthenticated context
      }

      try {
        let decoded;
        if (token.endsWith('dummy_signature')) {
           // Decode without verifying signature for dev token
           decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        } else {
           decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
        }
        return {
          user: {
            id: decoded.id,
            role: decoded.role,
            organizationId: decoded.organizationId,
          }
        };
      } catch (err) {
        throw new Error('Invalid authentication token');
      }
    },
  });

  console.log(`🚀 Teacher Module Backend running at: ${url}`);
}

startServer();
