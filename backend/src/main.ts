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
import { typeDefs as studentTypeDefs } from './modules/teacher/student/student.types';
import { resolvers as studentResolvers } from './modules/teacher/student/student.resolver';

const typeDefs = `#graphql
  ${questionTypeDefs}
  ${reviewTypeDefs}
  ${assessmentTypeDefs}
  ${aiTypeDefs}
  ${studentTypeDefs}
`;

const resolvers = [
  questionResolvers,
  reviewResolvers,
  assessmentResolvers,
  aiResolvers,
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
      
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
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
