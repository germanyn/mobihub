import { Imobiliaria } from "./Imobiliaria"
import { Imovel } from "./Imovel";

export interface OfertaDeImovel {
    _id?: string
    modalidade: Modalidade.ALUGUEL | Modalidade.VENDA
    descricao?: string;
    valor: number
    fotos?: string[]
    imobiliaria: Imobiliaria
    imovel: Imovel
    link: string
}

export enum Modalidade {
    VENDA = 'venda',
    ALUGUEL = 'aluguel',
}
