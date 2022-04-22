import { Lambda } from 'aws-sdk'
import { Modalidade } from '../../types/OfertaDeImovel'
import { VivendaCrawlerParams } from './types/VivendaCrawler'

const lambda = new Lambda({
    apiVersion: '2015-03-31',
    endpoint: process.env.IS_OFFLINE ? 'http://localhost:3675' : undefined,
})

const invokeCrawler = (payload: VivendaCrawlerParams) =>
    lambda.invoke({
        FunctionName: 'crawler-dev-vivenda-crawler',
        InvocationType: 'Event',
        Payload: JSON.stringify(payload),
    }).promise()

export const handler = async () => {
    const response = await Promise.allSettled([
        invokeCrawler({ modalidade: Modalidade.ALUGUEL }),
        invokeCrawler({ modalidade: Modalidade.VENDA }),
    ])
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "success",
            response,
        }),
    }
}