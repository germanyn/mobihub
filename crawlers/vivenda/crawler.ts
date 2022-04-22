// https://www.vivendaimoveis.com/imoveis/a-venda/jaragua-do-sul

const chromium = require('chrome-aws-lambda');
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dbConnect from '../../libs/dbConnect';
import { OfertaDeImovelModel } from '../../libs/schemas/OfertaDeImovel';
import { Modalidade, OfertaDeImovel } from '../../types/OfertaDeImovel';
import { VivendaCrawlerParams } from './types/VivendaCrawler';
import { asyncFilter } from '../utils';
import axios from 'axios';
import { ImovelDaVivenda, VivendaResponse } from './types/VivendaResponse';

async function lerOfertasDaPagina(modalidade: Modalidade, imoveisDaVivenda: ImovelDaVivenda[]): Promise<OfertaDeImovel[]> {
    const ofertas: OfertaDeImovel[] = imoveisDaVivenda.map<OfertaDeImovel>(imovel => ({
        modalidade,
        imobiliaria: {
            nome: 'Vivenda',
        },
        imovel: {
            endereco: {
                cidade: imovel.city,
                bairro: imovel.neighborhood,
            },
        },
        link: `https://www.vivendaimoveis.com${imovel.url}`,
        valor: modalidade === Modalidade['ALUGUEL'] ? imovel.rent_price[0] : imovel.sales_price[0],
        descricao: imovel.listing_description,
        fotos: imovel.photos.map(({ picture_thumb }) => picture_thumb),
    }))
    return ofertas;
}

export const handler = async (evento: VivendaCrawlerParams) => {
    let pagina = evento.pagina || 1
    const finalidade = evento.modalidade === Modalidade.ALUGUEL ? 'para-alugar' : 'a-venda'
    let { data } = await axios.get<VivendaResponse<ImovelDaVivenda>>(`https://www.vivendaimoveis.com/api/listings/${finalidade}/jaragua-do-sul?pagina=${pagina}`);

    let db = null;
    const paginas = Math.ceil(data.count / 12)

    try {
        db = await dbConnect()
        let importados = 0

        while (data.data.length) {
            const ofertas = await lerOfertasDaPagina(evento.modalidade, data.data);
            const novasOfertas = await asyncFilter(ofertas, async ({ link }) => OfertaDeImovelModel.exists({ link }).exec().then(value => !value))
            importados += novasOfertas.length
            await Promise.all(
                ofertas
                    .map(oferta => OfertaDeImovelModel.findOneAndUpdate(
                        { link: oferta.link },
                        oferta,
                        { upsert: true, overwrite: true },
                    )
                ),
            )
            console.log(`${evento.modalidade}: ${pagina}/${paginas}`)
            ;++pagina
            if (pagina > paginas) break
            const response = await axios.get<VivendaResponse<ImovelDaVivenda>>(`https://www.vivendaimoveis.com/api/listings/${finalidade}/jaragua-do-sul?pagina=${pagina}`)
            data = response.data
        }

        return {
            statusCode: 200,
            body: {
                data: {
                    importados,
                },
                status: 'success',
            },
        }
    } catch (error) {
        console.log((error as Error).toString());
        return {
            statusCode: 200,
            body: "failure",
        }
    } finally {
        if (db !== null) {
            await mongoose.connection.close()
        }
    }
};