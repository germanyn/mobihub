import dbConnect from "../libs/dbConnect"
import { DbOfertaDeImovel, OfertaDeImovelModel } from "../libs/schemas/OfertaDeImovel"
import { Modalidade, OfertaDeImovel } from "../types/OfertaDeImovel"
import { FilterQuery } from 'mongoose'

export type FiltrosDeOfertas = {
    modalidades?: `${Modalidade}`[]
    minimo?: number
    maximo?: number
    imobiliarias?: string[]
    bairros?: string[]
}

export type ListarOfertasParams = FiltrosDeOfertas & {
    skip?: number
    limit?: number
}

export class OfertaDeImovelService {

    static construirFiltro({
        modalidades,
        minimo,
        maximo,
        imobiliarias,
        bairros,
    }: FiltrosDeOfertas = {}): FilterQuery<typeof DbOfertaDeImovel> {
        return {
            ...modalidades && {
                modalidade: {
                    $in: modalidades,
                },
            },
            ...imobiliarias && {
                ["imobiliaria.nome"]: {
                    $in: imobiliarias,
                },
            },
            ...bairros && {
                ["imovel.endereco.bairro"]: {
                    $in: bairros,
                },
            },
            ...(minimo || maximo) && {
                valor: {
                    ...minimo && {
                        $gte: minimo,
                    },
                    ...maximo && {
                        $lte: maximo,
                    },
                },
            },
        }
    }

    static async listar({
        skip,
        limit,
        ...filtro
    }: ListarOfertasParams = {}): Promise<OfertaDeImovel[]> {
        await dbConnect()
        const filtroDeOfertas = OfertaDeImovelService.construirFiltro(filtro)
        return OfertaDeImovelModel
            .find(filtroDeOfertas)
            .sort({ valor: 0 })
            .skip(skip || 0)
            .limit(limit || 20)
            .lean()
            .exec()
    }

    static async totalizar(filtro: FiltrosDeOfertas = {}): Promise<number> {
        await dbConnect()
        const filtroDeOfertas = OfertaDeImovelService.construirFiltro(filtro)
        return OfertaDeImovelModel
            .find(filtroDeOfertas)
            .count()
            .exec()
    }
}