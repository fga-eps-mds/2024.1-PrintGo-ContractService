import { Request, Response } from 'express';
import { prisma } from '../database';
import { contractCreatInput } from '../types/contrac.types';

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
    }
}