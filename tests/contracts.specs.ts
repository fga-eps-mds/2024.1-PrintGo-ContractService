import request from 'supertest';
import { server } from '../src/server';
import { prisma } from '../src/database';

describe('Contract Controller', () => {

  const createdContract = {
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

  beforeEach(() => {
    jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(createdContract);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  })

  describe('list', () => {
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

      const findManySpy = jest.spyOn(prisma.contrato, 'findMany').mockResolvedValue(contracts);
      const countSpy = jest.spyOn(prisma.contrato, 'count').mockResolvedValue(1);

      const response = await request(server).get('/').query({ page: 1, pageSize: 5 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.total).toBe(1);
      expect(findManySpy).toHaveBeenCalled();
      expect(countSpy).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.contrato, 'findMany').mockRejectedValue(new Error('Database error'));

      const response = await request(server).get('/').query({ page: 1, pageSize: 5 });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro: Ocorreu um erro ao buscar contratos.');
    });
  });

  describe('getById', () => {
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

      const findUniqueSpy = jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(contract);

      const response = await request(server).get('/1');

      const expected = {
        ...contract,
        createdAt: new Date(contract.createdAt).toISOString(),
        dataInicio: new Date(contract.dataInicio).toISOString(),
        dataTermino: new Date(contract.dataTermino).toISOString(),
        updatedAt: new Date(contract.updatedAt).toISOString()
      }
      const received = {
        ...response.body,
        createdAt: new Date(response.body.createdAt).toISOString(),
        dataInicio: new Date(response.body.dataInicio).toISOString(),
        dataTermino: new Date(response.body.dataTermino).toISOString(),
        updatedAt: new Date(response.body.updatedAt).toISOString()
      };

      expect(response.status).toBe(200);
      expect(received).toMatchObject(expected);
      expect(findUniqueSpy).toHaveBeenCalled();
    });

    it('should return 404 for a non-existent contract', async () => {
      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(null);

      const response = await request(server).get('/9999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Erro: Não foi possível encontrar o contrato.');
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.contrato, 'findUnique').mockRejectedValue(new Error('Database error'));

      const response = await request(server).get('/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const newContract = {
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

      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(null);
      const createSpy = jest.spyOn(prisma.contrato, 'create').mockResolvedValue(createdContract);

      const response = await request(server).post('/create').send(newContract);

      const expected = {
        ...response.body.data,
        createdAt: new Date(response.body.data.createdAt).toISOString(),
        dataInicio: new Date(response.body.data.dataInicio).toISOString(),
        dataTermino: new Date(response.body.data.dataTermino).toISOString(),
        updatedAt: new Date(response.body.data.updatedAt).toISOString()
      }
      const received = {
        ...createdContract,
        createdAt: new Date(createdContract.createdAt).toISOString(),
        dataInicio: new Date(createdContract.dataInicio).toISOString(),
        dataTermino: new Date(createdContract.dataTermino).toISOString(),
        updatedAt: new Date(createdContract.updatedAt).toISOString()
      };

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Contrato criado com sucesso!');
      expect(expected).toMatchObject(received);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should return 400 if contract already exists', async () => {
      const newContract = {
        numero: '1234',
        nomeGestor: 'John Doe',
        descricao: 'Descrição do contrato',
        dataInicio: new Date('2024-01-01'),
        dataTermino: new Date('2025-01-01'),
        ativo: true,
      };

      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue({id: 1, createdAt: new Date(Date.now()), updatedAt: new Date(Date.now()), ...newContract});

      const response = await request(server).post('/create').send(newContract);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Erro: Contrato já existe!');
    });
  });

  describe('edit', () => {
    it('should edit a contract', async () => {
      const updatedContract = {
        id: 1,
        numero: '1234',
        nomeGestor: 'Jane Doe',
        descricao: 'Descrição do contrato atualizado',
        dataInicio: new Date('2024-01-01'),
        dataTermino: new Date('2025-01-01'),
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(updatedContract);
      const updateSpy = jest.spyOn(prisma.contrato, 'update').mockResolvedValue(updatedContract);

      const response = await request(server).patch('/1').send(updatedContract);
      
      const expected = {
        ...response.body.data,
        createdAt: new Date(response.body.data.createdAt).toISOString(),
        dataInicio: new Date(response.body.data.dataInicio).toISOString(),
        dataTermino: new Date(response.body.data.dataTermino).toISOString(),
        updatedAt: new Date(response.body.data.updatedAt).toISOString()
      }
      const received = {
        ...updatedContract,
        createdAt: new Date(updatedContract.createdAt).toISOString(),
        dataInicio: new Date(updatedContract.dataInicio).toISOString(),
        dataTermino: new Date(updatedContract.dataTermino).toISOString(),
        updatedAt: new Date(updatedContract.updatedAt).toISOString()
      };

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Sucesso: Contrato atualizado!');
      expect(expected).toMatchObject(received);
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should return 404 if contract does not exist', async () => {
      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(null);

      const response = await request(server).patch('/9999').send({});

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Erro: Contrato não encontrado!');
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.contrato, 'update').mockRejectedValue(new Error('Database error'));

      const response = await request(server).patch('/1').send({});

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('toggleContract', () => {
    it('should toggle contract status', async () => {
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

      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(contract);
      const updateSpy = jest.spyOn(prisma.contrato, 'update').mockResolvedValue({
        ...contract,
        ativo: !contract.ativo,
      });

      const response = await request(server).patch('/changeStatus/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sucesso: Contrato atualizado!');
      expect(response.body.data.ativo).toBe(false);
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should return 404 if contract does not exist', async () => {
      jest.spyOn(prisma.contrato, 'findUnique').mockResolvedValue(null);

      const response = await request(server).patch('/changeStatus/9999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Erro: Contrato não encontrado!');
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.contrato, 'update').mockRejectedValue(new Error('Database error'));

      const response = await request(server).patch('/changeStatus/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro: Ocorreu um erro ao atualizar o status do Contrato.');
    });
  });
});