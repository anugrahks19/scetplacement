export const assessmentTypeDefs = `#graphql
  enum AssessmentStatus {
    DRAFT
    SCHEDULED
    PUBLISHED
    CLOSED
    ARCHIVED
  }

  type AssessmentItem {
    id: ID!
    sectionId: ID!
    questionId: ID!
    marks: Int!
    order: Int!
    question: Question!
  }

  type AssessmentSection {
    id: ID!
    assessmentId: ID!
    name: String!
    order: Int!
    items: [AssessmentItem!]!
  }

  type AssessmentBatch {
    id: ID!
    assessmentId: ID!
    batchId: ID!
  }

  type Assessment {
    id: ID!
    organizationId: ID!
    title: String!
    description: String
    status: AssessmentStatus!
    createdById: ID!
    startsAt: String
    endsAt: String
    durationMinutes: Int!
    totalMarks: Int!
    negativeMarkingEnabled: Boolean!
    attemptLimit: Int!
    randomizeQuestions: Boolean!
    randomizeOptions: Boolean!
    publishedAt: String
    createdAt: String!
    updatedAt: String!
    sections: [AssessmentSection!]!
    batches: [AssessmentBatch!]!
  }

  input CreateAssessmentInput {
    title: String!
    description: String
    durationMinutes: Int!
    totalMarks: Int!
    negativeMarkingEnabled: Boolean
    attemptLimit: Int
    randomizeQuestions: Boolean
    randomizeOptions: Boolean
  }

  input UpdateAssessmentInput {
    title: String
    description: String
    durationMinutes: Int
    totalMarks: Int
    negativeMarkingEnabled: Boolean
    attemptLimit: Int
    randomizeQuestions: Boolean
    randomizeOptions: Boolean
  }

  extend type Query {
    assessments: [Assessment!]!
    assessment(id: ID!): Assessment
  }

  extend type Mutation {
    createAssessment(input: CreateAssessmentInput!): Assessment!
    updateAssessment(id: ID!, input: UpdateAssessmentInput!): Assessment!
    addSectionToAssessment(assessmentId: ID!, name: String!, order: Int!): AssessmentSection!
    addQuestionToSection(sectionId: ID!, questionId: ID!, marks: Int!, order: Int!): AssessmentItem!
    removeQuestionFromSection(itemId: ID!): Boolean!
    assignBatchToAssessment(assessmentId: ID!, batchId: ID!): Boolean!
    scheduleAssessment(id: ID!, startsAt: String!, endsAt: String!): Assessment!
    publishAssessment(id: ID!): Assessment!
    closeAssessment(id: ID!): Assessment!
  }
`;
