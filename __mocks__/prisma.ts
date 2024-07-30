import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

// Crie uma instância simulada do PrismaClient
const prismaMock = {
  contrato: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
} as unknown as PrismaClient;

export { prismaMock };
