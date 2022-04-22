import { Lambda } from 'aws-sdk'
import { Modalidade } from '../../types/OfertaDeImovel'
import { ItaivanCrawlerParams } from './types/ItaivanCrawler'

const lambda = new Lambda({
    apiVersion: '2015-03-31',
    endpoint: process.env.IS_OFFLINE ? 'http://localhost:3675' : undefined,
})

const invokeCrawler = (payload: ItaivanCrawlerParams) =>
    lambda.invoke({
        FunctionName: 'crawler-dev-itaivan-crawler',
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
        body: {
            status: "success",
            response,
        },
    }
}