import { prisma } from '../src/database';

describe('Prisma Client', () => {
  const prismaClient = prisma;

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it('should connect to the database', async () => {
    const result = await prismaClient.$queryRaw`SELECT 1`;

    expect(result).toBeDefined();
  });
});