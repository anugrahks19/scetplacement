export const questionTypeDefs = `#graphql
  enum QuestionType {
    MCQ
    CODING
    DEBUGGING
  }

  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }

  enum QuestionStatus {
    DRAFT
    PENDING_REVIEW
    APPROVED
    PUBLISHED
    RETIRED
    REJECTED
  }

  type TestCase {
    id: ID!
    input: String!
    output: String!
    isHidden: Boolean!
  }

  type Question {
    id: ID!
    organizationId: ID!
    categoryId: ID!
    topicId: ID!
    type: QuestionType!
    difficulty: Difficulty!
    status: QuestionStatus!
    title: String!
    content: String! # JSON stringified
    explanation: String
    tags: [String!]!
    createdById: ID!
    updatedById: ID!
    version: Int!
    createdAt: String!
    updatedAt: String!
    publishedAt: String
    testCases: [TestCase!]!
  }

  input TestCaseInput {
    input: String!
    output: String!
    isHidden: Boolean = true
  }

  input CreateQuestionInput {
    categoryId: ID!
    topicId: ID!
    type: QuestionType!
    difficulty: Difficulty!
    title: String!
    content: String! # JSON payload
    explanation: String
    tags: [String!]
    testCases: [TestCaseInput!]
  }

  input UpdateQuestionInput {
    categoryId: ID
    topicId: ID
    type: QuestionType
    difficulty: Difficulty
    title: String
    content: String
    explanation: String
    tags: [String!]
    testCases: [TestCaseInput!]
  }

  type BulkImportResult {
    success: Boolean!
    error: String
    data: Question
  }

  type Query {
    questions(categoryId: ID, topicId: ID, status: QuestionStatus): [Question!]!
    question(id: ID!): Question
  }

  type Mutation {
    createQuestion(input: CreateQuestionInput!): Question!
    updateQuestion(id: ID!, input: UpdateQuestionInput!): Question!
    submitQuestionForReview(id: ID!): Question!
    approveQuestion(id: ID!, feedback: String): Question!
    rejectQuestion(id: ID!, feedback: String): Question!
    publishQuestion(id: ID!): Question!
    retireQuestion(id: ID!): Question!
    deleteQuestion(id: ID!): Question!
    createQuestionsBulk(input: [CreateQuestionInput!]!): [BulkImportResult!]!
  }
`;
