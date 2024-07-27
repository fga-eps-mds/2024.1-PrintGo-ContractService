import { Request, Response } from 'express';
import { prisma } from '../database';
import { contractCreatInput, contractUpdateInput } from '../types/contrac.types';

export default {
    async create(request: Request, response: Response) {
        try {
            const {
                numero,
                nomeGestor,
                descricao,
                dataInicio,
                dataTermino,
            } = request.body as contractCreatInput;

            const contractExist = await prisma.contrato.findUnique({ where: { numero } });
            
            if (contractExist) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Contrato já existe!'
                });
            }

            const contract = await prisma.contrato.create({
                data: {
                    numero,
                    nomeGestor,
                    descricao,
                    dataInicio,
                    dataTermino,
                }
            });

            return response.status(201).json({ 
                message: 'Contrato criado com sucesso!',
                data: contract
            });

        } catch (error) {
            return response.status(500).json({ error: true, message: error.message });
          }
    },

    async edit(request: Request, response: Response) {
        try {
           const {id} = request.params;
           const contractToChange = request.body as contractUpdateInput;
           
           const contractExist = await prisma.contrato.findUnique({ where: { id: parseInt(id) } });

           if(!contractExist) {
            return response.status(404).json({
                error: true,
                message: 'Erro: Contrato não encontrado!',
            });
           }

        const updateContract = await prisma.contrato.update({
            where: {
                id: parseInt(id)
            },
            data: contractToChange,
        });

        return response.status(200).json({
            message: 'Sucesso: Contrato atualizado!',
            data: updateContract,
        });

        } catch (error) {
            return response.json({ error: true, message: error.message });
          }
    },

    async  list(request: Request, response: Response) {
        try {
            const contracts = await prisma.contrato.findMany();
            return response.json(contracts);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar os contratos cadastrados.'
            });
          }
    },

    async findByNumber(request: Request, response: Response) {
        const { numero } = request.params;

        try {
            const contractExist = await prisma.contrato.findUnique({ where: { numero } });

            if(contractExist) {
                const status=200;
                return response.status(status).json(contractExist)
            } else {
                const status=404;
                return response.status(status).json({
                    error: true,
                    message: 'Erro: Não foi possível encontrar o contrato.',
                })
            }
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar o contrato por Número de Contrato.'
            });
          }
    },
}