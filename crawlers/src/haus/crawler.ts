const chromium = require('chrome-aws-lambda');
import dbConnect from '@mobihub/core/src/libs/dbConnect';
import { OfertaDeImovelModel } from '@mobihub/core/src/libs/schemas/OfertaDeImovel';
import { Modalidade, OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import type { Page } from 'puppeteer-core';
import { BaseCrawlerParams } from '../shared/BaseCrawler';

// const ITEMS_POR_PAGINA = 9

async function lerOfertasDaPagina(modalidade: Modalidade, page: Page): Promise<OfertaDeImovel[]> {
    // Mark the piece of HTML that we want to prase from. This should be the parent of the HTML snippet 
    // that we want to process
    const mainHtml = await page.$eval('.entry-content.loop-content>.row', (element) => element.innerHTML);
    if (!mainHtml) throw Error('Main HTML not found')
    // Now load the above extracted HTML to Cheerio
    const $ = cheerio.load(mainHtml);
    // Create a new list in which we will save the extracted feature text
    const ofertas: OfertaDeImovel[] = [];
    // Loop through the list of features at the end of the GitHub Enterpise's page and process each 'li' element
    $(".epl-property-blog").each(function (_, block) {
        const link = $(block).find('a').attr('href')!;
        if (link.includes('2680')) debugger;
        const fotoUrl = $(block).find('.wp-post-image').attr('data-src')!
        const categoria = $(block).find('.entry-title>a').text().replace(/\n/g, '').trim().split(' | ')[0]
        const textoDeEndereco = $(block).find('h6>a').text();
        // a HAUS tem um endereço de Guaramirim na busca de Jaraguá do Sul, não sei porque
        // esse endereço inclusive não tem bairro, então talvez mais endereços não tenham bairro também
        const [bairro, cidade] = textoDeEndereco.split('-').map(texto => texto.trim() || undefined);
        /**
         * exemplo de valores da HAUS:
         * ALUGUEL: R$ 950,00 + Taxas
         * VENDA: R$ 200.000,00
         */
        const regexDeValor = new RegExp(`${modalidade === Modalidade.ALUGUEL ? 'ALUGUEL' : 'VENDA'}: R\\$ ([\\d\\.,]*)`, 'g')
        const stringDeValores = $(block).find('.page-price').text()
        const stringDaModalidade = (regexDeValor.exec(stringDeValores) || [])[1];
        // por algum motivo tem um imóvel com preço de alguel na busca de vendas
        if (!stringDaModalidade) return;
        const valor = +stringDaModalidade.replace(/\./g, '').replace(/,/, '.');
        const oferta: OfertaDeImovel = {
            imobiliaria: {
                nome: 'HAUS'
            },
            imovel: {
                endereco: {
                    cidade: cidade!,
                    bairro,
                },
                categoria,
            },
            modalidade,
            link,
            valor,
            fotos: [fotoUrl],
        }
        ofertas.push(oferta);
    });
    return ofertas;
}

export const handler = async (evento: BaseCrawlerParams) => {
    let pagina = evento.pagina || 1
    const modalidade = evento.modalidade || Modalidade.VENDA
    const finalidade = modalidade === Modalidade.ALUGUEL ? 'Alugar' : 'Comprar'
    const baseUrl = `https://haus.imb.br/imoveis`;

    let browser = null;
    let db = null;

    try {
        db = await dbConnect()

        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            devtools: false
        });

        const page: Page = await browser.newPage();

        await page.setViewport({ width: 1200, height: 800 });
        // @ts-ignore it works
        await page.goto(baseUrl, ['load', 'domcontentloaded', 'networkidle0']);
        let importados = 0

        await Promise.all([
            page.select('#tipo_negociacao', finalidade),
            page.select('#tipo_negociacao', 'Jaraguá do Sul'),
        ])

        await Promise.all([
            page.click('.btn.search-more'),
            page.waitForNavigation()
        ])
        
        let ultimaPagina = false

        while(!ultimaPagina) {
            const ofertas = await lerOfertasDaPagina(modalidade, page);
            importados += ofertas.length
            await Promise.all(
                ofertas
                    .map(oferta => OfertaDeImovelModel.findOneAndUpdate(
                        { link: oferta.link, modalidade },
                        oferta,
                        { upsert: true, overwrite: true },
                    )
                ),
            )
            console.log(`${modalidade}: ${pagina}/indefinido`)
            ;++pagina

            const element = await page.$('.next>a')
            ultimaPagina = !element;
            if (ultimaPagina) return;
            await Promise.all([
                page.click('.next>a'),
                page.waitForNavigation()
            ])
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
        if (browser !== null) {
            await browser.close();
        }
        if (db !== null) {
            await mongoose.connection.close()
        }
    }
};