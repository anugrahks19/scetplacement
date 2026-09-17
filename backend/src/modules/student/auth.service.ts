import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prisma.service';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authService = {
  async loginStudent(email: string, rollNo: string) {
    const student = await prisma.student.findFirst({
      where: { email, rollNo },
    });
    if (!student) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: student.id, role: 'STUDENT', organizationId: student.organizationId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return { token, student };
  },
};
