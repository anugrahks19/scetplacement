export const studentTypeDefs = `#graphql
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
    attempts: [AssessmentAttempt!]
  }

  type AssessmentAttempt {
    id: ID!
    assessmentId: ID!
    studentId: ID!
    status: AttemptStatus!
    mcqScore: Int!
    codingScore: Int!
    totalScore: Int!
    startedAt: String!
    completedAt: String
    student: Student
    submissions: [AssessmentSubmission!]
  }

  type AssessmentSubmission {
    id: ID!
    attemptId: ID!
    itemId: ID!
    marksAwarded: Int!
  }

  type IntegrityLog {
    id: ID!
    attemptId: ID!
    flagCount: Int!
  }
  enum AttemptStatus {
    STARTED
    COMPLETED
    ABANDONED
  }

  type StudentAnalytics {
    readinessScore: Float!
    componentScores: ComponentScores!
    assignedInterventions: [Intervention!]!
  }

  type ComponentScores {
    mcq: Float!
    coding: Float!
    overall: Float!
  }

  type Intervention {
    id: ID!
    title: String!
    description: String!
    type: String!
    status: String!
  }

  extend type Query {
    me: Student!
    student(id: ID!): Student
    studentQuestions(categoryId: ID, topicId: ID): [Question!]!
    studentAssessments: [Assessment!]!
    attempt(id: ID!): AssessmentAttempt
    studentAnalytics(studentId: ID): StudentAnalytics!
  }

  type AuthPayload {
    token: String!
    student: Student!
  }

  extend type Mutation {
    loginStudent(email: String!, rollNo: String!): AuthPayload!
    startAttempt(assessmentId: ID!): AssessmentAttempt!
    submitAnswer(attemptId: ID!, itemId: ID!, marksAwarded: Int!): AssessmentSubmission!
    finishAttempt(attemptId: ID!): AssessmentAttempt!
  }
`;
