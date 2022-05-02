import dbConnect from "../libs/dbConnect"
import { ImobiliariaModel } from "../libs/schemas/Imobiliaria"
import { Imobiliaria } from "../types/Imobiliaria"

export class ImobiliariaService {
    static async listar(): Promise<Imobiliaria[]> {
        await dbConnect()
        return ImobiliariaModel
            .find()
            .lean()
            .exec()
    }
}