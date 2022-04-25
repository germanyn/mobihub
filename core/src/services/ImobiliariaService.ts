import dbConnect from "../libs/dbConnect"
import { ImobiliariaModel } from "../libs/schemas/Imobiliaria"

export class ImobiliariaService {
    static async listar() {
        await dbConnect()
        return ImobiliariaModel
            .find()
            .lean()
            .exec()
    }
}