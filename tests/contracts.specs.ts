import request from 'supertest';
import { server } from '../src/server';
import { prismaMock } from '../__mocks__/prisma';
import { contractCreatInput, contractUpdateInput } from '../src/types/contrac.types';

describe('Contract Controller', () => {
  let contractId: number;

  beforeAll(async () => {
    process.env.PORT = '5000';
    await prismaMock.$connect();
  });

  afterAll(async () => {
    await prismaMock.$disconnect();
    server.close();
  });

  it('should create a new contract', async () => {
    const newContract: contractCreatInput = {
      numero: '1234',
      nomeGestor: 'John Doe',
      descricao: 'Descrição do contrato',
      dataInicio: new Date('2024-01-01'),
      dataTermino: new Date('2025-01-01'),
      ativo: true,
    };

    const createdContract = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newContract,
    };

    prismaMock.contrato.create.mockResolvedValue(createdContract);

    const response = await request(server)
      .post('/create')
      .send(newContract);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Contrato criado com sucesso!');
    contractId = response.body.data.id;
  });

  it('should list contracts', async () => {
    const contracts = [
      {
        id: 1,
        numero: '1234',
        nomeGestor: 'John Doe',
        descricao: 'Descrição do contrato',
        dataInicio: new Date('2024-01-01'),
        dataTermino: new Date('2025-01-01'),
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.contrato.findMany.mockResolvedValue(contracts);
    prismaMock.contrato.count.mockResolvedValue(1);

    const response = await request(server).get('/').query({ page: 1, pageSize: 5 });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should get a contract by id', async () => {
    const contract = {
      id: 1,
      numero: '1234',
      nomeGestor: 'John Doe',
      descricao: 'Descrição do contrato',
      dataInicio: new Date('2024-01-01'),
      dataTermino: new Date('2025-01-01'),
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.contrato.findUnique.mockResolvedValue(contract);

    const response = await request(server).get(`/${contractId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(contractId);
  });

  it('should edit a contract', async () => {
    const updatedContract: contractUpdateInput = {
      numero: '1234',
      nomeGestor: 'Jane Doe',
      descricao: 'Descrição do contrato atualizado',
      dataInicio: new Date('2024-01-01'),
      dataTermino: new Date('2025-01-01'),
      ativo: true,
    };

    const existingContract = {
      id: contractId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...updatedContract,
    };

    prismaMock.contrato.findUnique.mockResolvedValue(existingContract);

    prismaMock.contrato.update.mockResolvedValue(existingContract);

    const response = await request(server)
      .patch(`/${contractId}`)
      .send(updatedContract);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Sucesso: Contrato atualizado!');
    expect(response.body.data.nomeGestor).toBe('Jane Doe');
  });

  it('should toggle contract status', async () => {
    const contract = {
      id: contractId,
      numero: '1234',
      nomeGestor: 'John Doe',
      descricao: 'Descrição do contrato',
      dataInicio: new Date('2024-01-01'),
      dataTermino: new Date('2025-01-01'),
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.contrato.findUnique.mockResolvedValue(contract);

    prismaMock.contrato.update.mockResolvedValue({
      ...contract,
      ativo: !contract.ativo,
    });

    const response = await request(server).patch(`/changeStatus/${contractId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Sucesso: Contrato atualizado!');
    expect(response.body.data.ativo).toBe(false);
  });

  it('should return 404 for a non-existent contract', async () => {
    prismaMock.contrato.findUnique.mockResolvedValue(null);

    const response = await request(server).get('/9999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Erro: Não foi possível encontrar o contrato.');
  });
});