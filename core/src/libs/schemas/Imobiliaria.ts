import { modelOptions, Severity, index, getModelForClass, DocumentType, prop } from "@typegoose/typegoose";
import { Imobiliaria } from "../../types/Imobiliaria";

@modelOptions({
    schemaOptions: {
        collection: 'imobiliarias',
        toJSON: {
            transform: (doc: DocumentType<DbImobiliaria>, ret) => {
                delete ret.__v;
                ret.id = ret._id;
                delete ret._id;
            }
        },
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ link: 1 })
class DbImobiliaria implements Imobiliaria {
    _id?: string | undefined;

    @prop()
    nome: string;
}

export const ImobiliariaModel = getModelForClass(DbImobiliaria)
