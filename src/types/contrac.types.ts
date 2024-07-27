export type contractCreatInput = {
    numero: string;
    nomeGestor: string;
    descricao: string;
    dataInicio: Date;
    dataTermino: Date;
    ativo: boolean;
}

export type contractUpdateInput = {
    numero: string;
    nomeGestor: string;
    descricao: string;
    dataInicio: Date;
    dataTermino: Date;
    ativo: boolean;
}