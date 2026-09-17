import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const orgId = 'org_scet_001';

  // Seed a sample student
  const student = await prisma.student.upsert({
    where: { id: 'student_001' },
    update: {},
    create: {
      id: 'student_001',
      organizationId: orgId,
      name: 'Anugrah K S',
      email: 'anugrah@scet.ac.in',
      rollNo: '21CS001',
      batchId: 'batch_2026_cs',
      cgpa: 8.5,
      placementReadiness: 76.5,
      eligibilityStatus: 'Eligible',
    },
  });

  console.log(`✅ Student created: ${student.name} (${student.email})`);
  console.log(`   Roll No: ${student.rollNo}`);

  // Seed a sample published assessment
  const assessment = await prisma.assessment.upsert({
    where: { id: 'assessment_001' },
    update: {},
    create: {
      id: 'assessment_001',
      organizationId: orgId,
      title: 'DSA Mock Test - Arrays & Strings',
      description: 'A timed assessment covering arrays, strings, and basic algorithms.',
      status: 'PUBLISHED',
      createdById: 'teacher_001',
      startsAt: new Date('2026-09-20T09:00:00Z'),
      endsAt: new Date('2026-09-20T11:00:00Z'),
      durationMinutes: 120,
      totalMarks: 100,
      negativeMarkingEnabled: false,
      attemptLimit: 1,
      randomizeQuestions: false,
      batches: {
        create: { batchId: 'batch_2026_cs' },
      },
    },
  });

  console.log(`✅ Assessment created: ${assessment.title}`);

  // Seed a sample published question
  const question = await prisma.question.upsert({
    where: { id: 'question_001' },
    update: {},
    create: {
      id: 'question_001',
      organizationId: orgId,
      categoryId: 'cat_dsa',
      topicId: 'topic_arrays',
      type: 'MCQ',
      difficulty: 'EASY',
      status: 'PUBLISHED',
      title: 'What is the time complexity of accessing an element in an array?',
      content: {
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0,
      },
      explanation: 'Array access by index is O(1) because arrays use contiguous memory.',
      tags: ['arrays', 'complexity', 'basics'],
      createdById: 'teacher_001',
      updatedById: 'teacher_001',
      publishedAt: new Date(),
      testCases: {
        create: [
          { input: '', output: 'O(1)', isHidden: false },
        ],
      },
    },
  });

  console.log(`✅ Question created: ${question.title}`);

  console.log('\n🎉 Seed complete!');
  console.log('\nTest login with:');
  console.log('  email:  anugrah@scet.ac.in');
  console.log('  rollNo: 21CS001');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
