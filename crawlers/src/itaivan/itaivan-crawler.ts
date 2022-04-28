const chromium = require('chrome-aws-lambda');
import dbConnect from '@mobihub/core/src/libs/dbConnect';
import { OfertaDeImovelModel } from '@mobihub/core/src/libs/schemas/OfertaDeImovel';
import { Modalidade, OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import type { Page } from 'puppeteer-core';
import { ItaivanCrawlerParams } from './types/ItaivanCrawler';

// const ITEMS_POR_PAGINA = 9

async function lerQuantidadeDePaginas(page: Page): Promise<number> {
    const mainHtml = await page.$eval('.pagination', (element) => element.innerHTML);
    if (!mainHtml) throw Error('Main HTML not found')
    
    const $ = cheerio.load(mainHtml);
    const quantidadeDeBlocks = $("li").length
    if (quantidadeDeBlocks <= 1) return 1;
    const penultimo = $("li").eq(-2)
    return Math.ceil(+penultimo.find('a').text())
}

async function lerOfertasDaPagina(modalidade: Modalidade, page: Page): Promise<OfertaDeImovel[]> {
    // Mark the piece of HTML that we want to prase from. This should be the parent of the HTML snippet 
    // that we want to process
    const mainHtml = await page.$eval('.col-md-12>.ls-wrap', (element) => element.innerHTML);
    if (!mainHtml) throw Error('Main HTML not found')
    // Now load the above extracted HTML to Cheerio
    const $ = cheerio.load(mainHtml);
    // Create a new list in which we will save the extracted feature text
    const ofertas: OfertaDeImovel[] = [];
    // Loop through the list of features at the end of the GitHub Enterpise's page and process each 'li' element
    $(".ls-block").each(function (_, block) {
        const link = $(block).parent().attr('href')!;
        const urlRegex = /url\((.*)\)/g
        const pictureStyle = $(block).find('.ls-picture').attr('style')!
        const fotoUrl = urlRegex.exec(pictureStyle)![1]
        const categoria = $(block).find('.ls-categoria>strong').text().replace(/\n/g, '').trim()
        const cidade = $(block).find('.ls-loc.block').contents().filter(function () {
            return this.type === 'text';
        }).text().replace(/\n/g, '').trim();
        const bairro = $(block).find('.ls-loc.block>strong').text()
        const valor = +$(block).find('.ls-price').text().replace(/[^\d,]*/g, '').replace(/,/, '.')
        const oferta: OfertaDeImovel = {
            imobiliaria: {
                nome: 'Itaivan'
            },
            imovel: {
                endereco: {
                    cidade,
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

export const handler = async (evento: ItaivanCrawlerParams) => {
    let pagina = evento.pagina || 1
    const modalidade = evento.modalidade || Modalidade.VENDA
    const finalidade = modalidade === Modalidade.ALUGUEL ? 'Aluguel' : 'Venda'
    const baseUrl = `https://itaivan.com/busca/?finalidade=${finalidade}&cidade%5B%5D=Jaragua+Do+Sul&valor%5B0%5D=&valor%5B1%5D=&area%5B0%5D=&area%5B1%5D=&codigo=&pagina=${pagina}`;

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

        const page = await browser.newPage();

        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(baseUrl, ['load', 'domcontentloaded', 'networkidle0']);
        let importados = 0

        const paginas = await lerQuantidadeDePaginas(page)

        while(true) {
            const ofertas = await lerOfertasDaPagina(modalidade, page);
            importados += ofertas.length
            await Promise.all(
                ofertas
                    .map(oferta => OfertaDeImovelModel.findOneAndUpdate(
                        { link: oferta.link },
                        oferta,
                        { upsert: true, overwrite: true },
                    )
                ),
            )
            console.log(`${modalidade}: ${pagina}/${paginas}`)
            ;++pagina
            if (pagina > paginas) break
            const nextUrl = `https://itaivan.com/busca/?finalidade=${finalidade}&cidade%5B%5D=Jaragua+Do+Sul&valor%5B0%5D=&valor%5B1%5D=&area%5B0%5D=&area%5B1%5D=&codigo=&pagina=${pagina}`;
            await page.goto(nextUrl, ['load', 'domcontentloaded', 'networkidle0']);
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