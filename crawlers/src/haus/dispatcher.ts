import { Lambda } from 'aws-sdk'
import { Modalidade } from '@mobihub/core/src/types/OfertaDeImovel'
import { BaseCrawlerParams } from '../shared/BaseCrawler'

const lambda = new Lambda({
    apiVersion: '2015-03-31',
    endpoint: process.env.IS_OFFLINE ? 'http://localhost:3675' : undefined,
})

const invokeCrawler = (payload: BaseCrawlerParams) =>
    lambda.invoke({
        FunctionName: 'mobihub-dev-haus-crawler',
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