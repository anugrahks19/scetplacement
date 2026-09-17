export const aiTypeDefs = `#graphql
  type AiGeneratedQuestion {
    title: String!
    type: String!
    difficulty: String!
    content: String! # JSON stringified content
    explanation: String
    tags: [String!]
  }

  type AiReviewResult {
    isApproved: Boolean!
    feedback: String!
    suggestedFixes: String
  }

  input PoolGenerationConfig {
    mcqEasy: Int
    mcqMedium: Int
    mcqHard: Int
    codingEasy: Int
    codingMedium: Int
    codingHard: Int
    debuggingEasy: Int
    debuggingMedium: Int
    debuggingHard: Int
  }

  extend type Query {
    reviewQuestionWithAi(id: ID!): AiReviewResult!
  }

  extend type Mutation {
    generateQuestionsWithAi(topic: String!, count: Int!, difficulty: String!, sourceContext: String, type: String): [AiGeneratedQuestion!]!
    generateQuestionBankWithAi(topic: String!, count: Int!, difficulty: String!, sourceContext: String, type: String, categoryId: String, topicId: String): Int!
    generateFullQuestionPoolWithAi(topic: String!, sourceContext: String!, config: PoolGenerationConfig!, categoryId: String, topicId: String): Int!
  }
`;
