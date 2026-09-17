import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Student {
    id: ID!
    organizationId: String!
    name: String!
    email: String!
    rollNo: String!
    batchId: String
    cgpa: Float!
    placementReadiness: Float!
    eligibilityStatus: String!
    createdAt: String!
    updatedAt: String!
  }

  type IntegrityLog {
    id: ID!
    attemptId: ID!
    flagCount: Int!
  }

  type AssessmentAttempt {
    id: ID!
    assessmentId: ID!
    studentId: ID!
    status: String!
    mcqScore: Int!
    codingScore: Int!
    totalScore: Int!
    startedAt: String!
    completedAt: String
    student: Student!
    integrityLogs: [IntegrityLog!]!
  }

  extend type Query {
    students(organizationId: ID!): [Student!]!
    assessmentAttempts(assessmentId: ID!): [AssessmentAttempt!]!
  }
`;
