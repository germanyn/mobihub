import dbConnect from "../libs/dbConnect"
import { OfertaDeImovelModel } from "../libs/schemas/OfertaDeImovel"
import { Modalidade } from "../types/OfertaDeImovel"

export type ListarOfertasParams = {
    skip?: number
    limit?: number
    modalidades?: `${Modalidade}`[]
    minimo?: number
    maximo?: number
    imobiliarias?: string[]
}

export class OfertaDeImovelService {
    static async listar({
        skip,
        limit,
        modalidades,
        minimo,
        maximo,
        imobiliarias,
    }: ListarOfertasParams = {}) {
        await dbConnect()
        return OfertaDeImovelModel
            .find({
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
            })
            .sort({ valor: 0 })
            .skip(skip || 0)
            .limit(limit || 20)
            .lean()
            .exec()
    }
}