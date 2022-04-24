import { OfertaDeImovelService } from '@mobihub/core/src/services/OfertaDeImovelService';
import { OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel';
import type { NextApiRequest, NextApiResponse } from 'next'

export type GetOfertasQueryParams = {
  limit: number
  offset: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfertaDeImovel[]>
) {
  const { limit, offset} = req.query;
  const ofertas = await OfertaDeImovelService.listar({
    limit: typeof limit === 'string' ? Number(limit) : undefined,
    skip: typeof offset === 'string' ? Number(offset) : undefined,
  })
  res.status(200).json(ofertas)
}
