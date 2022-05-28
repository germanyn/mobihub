import { FiltrosDeOfertas } from "@mobihub/core/src/services/OfertaDeImovelService";
import { Modalidade } from "@mobihub/core/src/types/OfertaDeImovel";
import { ParsedUrlQuery } from "querystring";
import { normalizarParaArray } from "./array";

export const normalizarModalidades = (modalidade?: string | string[] | undefined): `${Modalidade}`[] | undefined => {
    if (!modalidade || Array.isArray(modalidade)) return undefined;
    const lowerCase = modalidade.toLowerCase() as Modalidade
    if (Object.values(Modalidade).includes(lowerCase)) return [lowerCase];
    return undefined;
}

export const parsearQueryParaFiltroDeOfertas = (query: ParsedUrlQuery): FiltrosDeOfertas => {
    const { modalidade, min, max, imobiliarias, bairros } = query
    return {
        modalidades: normalizarModalidades(modalidade),
        minimo: (min && typeof min === 'string') ? Number(min) : undefined,
        maximo: (max && typeof max === 'string') ? Number(max) : undefined,
        imobiliarias: imobiliarias ? normalizarParaArray(imobiliarias) : undefined,
        bairros: bairros ? normalizarParaArray(bairros) : undefined,
    }
}