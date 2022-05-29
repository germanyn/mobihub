import { FiltrosDeOfertas, OfertaDeImovelService } from '@mobihub/core/src/services/OfertaDeImovelService';
import { Modalidade, OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel';
import type { NextApiRequest, NextApiResponse } from 'next'
import { normalizarParaArray } from '../../utils/array';

export type GetOfertasQueryParams = {
  limit: number
  offset: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfertaDeImovel[]>
) {
  const { limit, offset, ...params } = req.query;
  const { modalidade, minimo, maximo, imobiliarias, bairros } = params

  const normalizarModalidades = (modalidade?: string | string[] | undefined): `${Modalidade}`[] | undefined => {
    if (!modalidade || Array.isArray(modalidade)) return undefined;
    const lowerCase = modalidade.toLowerCase() as Modalidade
    if (Object.values(Modalidade).includes(lowerCase)) return [lowerCase];
    return undefined;
  }
  const filtroDeOfertas: FiltrosDeOfertas = {
    modalidades: normalizarModalidades(modalidade),
    minimo: (minimo && typeof minimo === 'string') ? Number(minimo) : undefined,
    maximo: (maximo && typeof maximo === 'string') ? Number(maximo) : undefined,
    imobiliarias: imobiliarias ? normalizarParaArray(imobiliarias) : undefined,
    bairros: bairros ? normalizarParaArray(bairros) : undefined,
  }
  const ofertas = await OfertaDeImovelService.listar({
    limit: typeof limit === 'string' ? Number(limit) : undefined,
    skip: typeof offset === 'string' ? Number(offset) : undefined,
    ...filtroDeOfertas,
  })
  res.status(200).json(ofertas)
}
