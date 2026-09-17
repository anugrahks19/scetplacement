export const typeDefs = `#graphql
  # Teacher-facing student queries (types are defined in the student module)
  extend type Query {
    students(organizationId: ID!): [Student!]!
    assessmentAttempts(assessmentId: ID!): [AssessmentAttempt!]!
  }
`;
