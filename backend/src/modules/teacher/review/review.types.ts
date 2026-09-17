export const reviewTypeDefs = `#graphql
  enum ReviewAction {
    SUBMITTED
    APPROVED
    REJECTED
    REVISION_REQUESTED
  }

  type QuestionReviewLog {
    id: ID!
    questionId: ID!
    reviewedBy: ID!
    action: ReviewAction!
    feedback: String
    createdAt: String!
  }

  extend type Query {
    questionReviewLogs(questionId: ID!): [QuestionReviewLog!]!
  }
`;
