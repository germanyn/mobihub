import { prop, getModelForClass, modelOptions, DocumentType, index, Severity } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';
import type { Imobiliaria } from '../../types/Imobiliaria';
import type { Imovel } from '../../types/Imovel';
import { Modalidade, OfertaDeImovel } from '../../types/OfertaDeImovel';

@modelOptions({
    schemaOptions: {
        collection: 'oferta-de-imoveis',
        toJSON: {
            transform: (doc: DocumentType<DbOfertaDeImovel>, ret) => {
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
class DbOfertaDeImovel implements OfertaDeImovel {
    _id?: string | undefined;

    @prop({ type: String, required: true, enum: Object.values(Modalidade) })
    modalidade: OfertaDeImovel['modalidade'];

    @prop({ type: String })
    descricao?: string;

    @prop()
    valor: number;

    @prop({ type: mongoose.Schema.Types.String, default: [] })
    fotos?: string[];

    @prop({ type: mongoose.Schema.Types.Mixed })
    imobiliaria: Imobiliaria;

    @prop({ type: mongoose.Schema.Types.Mixed })
    imovel: Imovel;

    @prop()
    link: string;
}

export const OfertaDeImovelModel = getModelForClass(DbOfertaDeImovel)
