import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { questionTypeDefs } from './modules/teacher/question/question.types';
import { questionResolvers } from './modules/teacher/question/question.resolver';
import { reviewTypeDefs } from './modules/teacher/review/review.types';
import { reviewResolvers } from './modules/teacher/review/review.resolver';
import { assessmentTypeDefs } from './modules/teacher/assessment/assessment.types';
import { assessmentResolvers } from './modules/teacher/assessment/assessment.resolver';
import { aiTypeDefs } from './modules/teacher/ai/ai.types';
import { aiResolvers } from './modules/teacher/ai/ai.resolver';

const typeDefs = `#graphql
  ${questionTypeDefs}
  ${reviewTypeDefs}
  ${assessmentTypeDefs}
  ${aiTypeDefs}
`;

const resolvers = [
  questionResolvers,
  reviewResolvers,
  assessmentResolvers,
  aiResolvers,
];

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // MOCK CONTEXT: Since the Shared Auth module isn't ready yet,
      // we mock a logged-in TEACHER for development/testing of this module.
      return {
        user: {
          id: 'mock-teacher-uuid',
          role: 'TEACHER',
          organizationId: 'mock-org-uuid',
        }
      };
    },
  });

  console.log(`🚀 Teacher Module Backend running at: ${url}`);
}

startServer();
