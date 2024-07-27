import { Request, Response } from "express";
import { prisma } from "../database";
import {
  contractCreatInput,
  contractUpdateInput,
} from "../types/contrac.types";

export default {
  async list(request: Request, response: Response) {
    try {
      const numero = request.query.numero as string;

      const page = parseInt(request.query.page as string) || 1;
      const pageSize = parseInt(request.query.pageSize as string) || 5
      
      if(numero){
        const contract = await prisma.contrato.findUnique({
          where: { numero },
        });

        if (contract) {
          const status = 200;
          return response.status(status).json(contract);
        } else {
          const status = 404;
          return response.status(status).json({
            error: true,
            message: "Erro: Não foi possível encontrar o contrato.",
          });
        }

      }
      else{
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const contracts = await prisma.contrato.findMany({skip, take});
        const totalContracts = await prisma.contrato.count();

        return response.status(200).json({
          data: contracts,
          page: page,
          pageSize: pageSize,
          total: totalContracts,
          totalPages: Math.ceil(totalContracts / pageSize),
        });
      }

    } catch (error) {
      return response.status(500).json({
        error: true,
        message:
          "Erro: Ocorreu um erro ao buscar o contrato por Número de Contrato.",
      });
    }
  },

  async create(request: Request, response: Response) {
    try {
      const { numero, nomeGestor, descricao, dataInicio, dataTermino, ativo } =
        request.body as contractCreatInput;

      const contractExist = await prisma.contrato.findUnique({
        where: { numero },
      });

      if (contractExist) {
        return response.status(400).json({
          error: true,
          message: "Erro: Contrato já existe!",
        });
      }

      const contract = await prisma.contrato.create({
        data: {
          numero,
          nomeGestor,
          descricao,
          dataInicio,
          dataTermino,
          ativo,
        },
      });

      return response.status(201).json({
        message: "Contrato criado com sucesso!",
        data: contract,
      });
    } catch (error) {
      return response.status(500).json({ error: true, message: error.message });
    }
  },

  async edit(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const contractToChange = request.body as contractUpdateInput;

      const contractExist = await prisma.contrato.findUnique({
        where: { id: parseInt(id) },
      });

      if (!contractExist) {
        return response.status(404).json({
          error: true,
          message: "Erro: Contrato não encontrado!",
        });
      }

      const dataInicio = new Date(contractToChange.dataInicio).getTime();
      const dataTermino = new Date(contractToChange.dataTermino).getTime();
      const now = new Date(Date.now()).getTime();

      if (dataInicio > now || dataTermino <= now) {
        contractToChange.ativo = false;
      }

      const updateContract = await prisma.contrato.update({
        where: {
          id: parseInt(id),
        },
        data: contractToChange,
      });

      return response.status(201).json({
        message: "Sucesso: Contrato atualizado!",
        data: updateContract,
      });
    } catch (error) {
      return response.status(500).json({ error: true, message: error.message });
    }
  },

  async toggleContract(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const contractExists = await prisma.contrato.findUnique({
        where: { id: Number(id) },
      });

      if (!contractExists) {
        return response.status(404).json({
          error: true,
          message: "Erro: Contrato não encontrado!",
        });
      }

      const newStatus = !contractExists.ativo;

      const updatedStatusContract = await prisma.contrato.update({
        where: { id: parseInt(id) },
        data: { ativo: newStatus },
      });

      return response.status(200).json({
        message: "Sucesso: Contrato atualizado!",
        data: updatedStatusContract,
      });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro: Ocorreu um erro ao atualizar o status do Contrato.",
      });
    }
  },
};
