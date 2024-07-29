import request from 'supertest';
import { server } from '../src/server'; // Importe sua aplicação Express
import { prisma } from '../__mocks__/prisma';

jest.mock('../src/database', () => ({
  prisma
}));

describe('Contract Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() =>{
    server.close()
  })

  describe('list', () => {
    it('should list contracts', async () => {
      const mockContracts = [
        { id: 1, numero: '123', nomeGestor: 'John Doe', descricao: 'Contract 1', dataInicio: new Date(), dataTermino: new Date(), ativo: true },
      ];

      prisma.contrato.findMany.mockResolvedValue(mockContracts);
      prisma.contrato.count.mockResolvedValue(1);

      const response = await request(server).get('/contract');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockContracts);
      expect(response.body.total).toBe(1);
    });

    it('should handle errors', async () => {
      prisma.contrato.findMany.mockRejectedValue(new Error('Erro ao buscar contratos'));

      const response = await request(server).get('/contract');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro: Ocorreu um erro ao buscar contratos.');
    });
  });

  describe('getById', () => {
    it('should return a contract by id', async () => {
      const mockContract = { id: 1, numero: '123', nomeGestor: 'John Doe', descricao: 'Contract 1', dataInicio: new Date(), dataTermino: new Date(), ativo: true };

      prisma.contrato.findUnique.mockResolvedValue(mockContract);

      const response = await request(server).get('/contract/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockContract);
    });

    it('should return 404 if contract not found', async () => {
      prisma.contrato.findUnique.mockResolvedValue(null);

      const response = await request(server).get('/contract/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Erro: Não foi possível encontrar o contrato.');
    });
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const newContract = { numero: '123', nomeGestor: 'John Doe', descricao: 'New Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true };
      const createdContract = { ...newContract, id: 1 };

      prisma.contrato.findUnique.mockResolvedValue(null);
      prisma.contrato.create.mockResolvedValue(createdContract);

      const response = await request(server).post('/contract').send(newContract);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(createdContract);
    });

    it('should return 400 if contract already exists', async () => {
      const existingContract = { numero: '123', nomeGestor: 'John Doe', descricao: 'Existing Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true };

      prisma.contrato.findUnique.mockResolvedValue(existingContract);

      const response = await request(server).post('/contract').send(existingContract);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Erro: Contrato já existe!');
    });

    it('should handle errors', async () => {
      prisma.contrato.create.mockRejectedValue(new Error('Erro ao criar contrato'));

      const response = await request(server).post('/contract').send({ numero: '123', nomeGestor: 'John Doe', descricao: 'New Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao criar contrato');
    });
  });

  describe('edit', () => {
    it('should update a contract', async () => {
      const updatedContract = { id: 1, numero: '123', nomeGestor: 'Jane Doe', descricao: 'Updated Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true };

      prisma.contrato.findUnique.mockResolvedValue(updatedContract);
      prisma.contrato.update.mockResolvedValue(updatedContract);

      const response = await request(server).put('/contract/1').send(updatedContract);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(updatedContract);
    });

    it('should return 404 if contract not found', async () => {
      prisma.contrato.findUnique.mockResolvedValue(null);

      const response = await request(server).put('/contract/1').send({ numero: '123', nomeGestor: 'Jane Doe', descricao: 'Updated Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Erro: Contrato não encontrado!');
    });

    it('should handle errors', async () => {
      prisma.contrato.update.mockRejectedValue(new Error('Erro ao atualizar contrato'));

      const response = await request(server).put('/contract/1').send({ numero: '123', nomeGestor: 'Jane Doe', descricao: 'Updated Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao atualizar contrato');
    });
  });

  describe('toggleContract', () => {
    it('should toggle the status of a contract', async () => {
      const existingContract = { id: 1, numero: '123', nomeGestor: 'John Doe', descricao: 'Contract', dataInicio: new Date(), dataTermino: new Date(), ativo: true };
      const updatedContract = { ...existingContract, ativo: false };

      prisma.contrato.findUnique.mockResolvedValue(existingContract);
      prisma.contrato.update.mockResolvedValue(updatedContract);

      const response = await request(server).patch('/contract/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(updatedContract);
    });

    it('should return 404 if contract not found', async () => {
      prisma.contrato.findUnique.mockResolvedValue(null);

      const response = await request(server).patch('/contract/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Erro: Contrato não encontrado!');
    });

    it('should handle errors', async () => {
      const mockError = new Error('Erro ao atualizar o status do Contrato');
    
      prisma.contrato.findUnique.mockResolvedValue({ id: 1, ativo: true }); // Garantindo que o contrato existe
      prisma.contrato.update.mockRejectedValue(mockError); // Simulando um erro na atualização
    
      const response = await request(server).patch('/contract/1');
    
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro: Ocorreu um erro ao atualizar o status do Contrato.');
    });
  });
});