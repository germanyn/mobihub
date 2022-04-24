// import dbConnect from "../libs/dbConnect"
// import { OfertaDeImovelModel } from "../libs/schemas/OfertaDeImovel"
import { Modalidade } from "../types/OfertaDeImovel"

export type ListarOfertasParams = {
    skip?: number
    limit?: number
    modalidades?: `${Modalidade}`[]
    minimo?: number
    maximo?: number
}

export class OfertaDeImovelService {
    static async listar({
        skip,
        limit,
        modalidades,
        minimo,
        maximo,
    }: ListarOfertasParams = {}) {
        return []
        // await dbConnect()
        // return OfertaDeImovelModel
        //     .find({
        //         ...modalidades && {
        //             modalidade: {
        //                 $in: modalidades,
        //             },
        //         },
        //         ...(minimo || maximo) && {
        //             valor: {
        //                 ...minimo && {
        //                     $gte: minimo,
        //                 },
        //                 ...maximo && {
        //                     $lte: maximo,
        //                 },
        //             },
        //         },
        //     })
        //     .skip(skip || 0)
        //     .limit(limit || 20)
        //     .lean()
        //     .exec()
    }
    // static get(id: string) {
    //     return articles.find(article => article.id === id)
    // }
}