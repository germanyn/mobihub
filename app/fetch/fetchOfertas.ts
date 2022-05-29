import type { FiltrosDeOfertas } from "@mobihub/core/src/services/OfertaDeImovelService";
import type { OfertaDeImovel } from "@mobihub/core/src/types/OfertaDeImovel";
import axios, { AxiosRequestConfig } from "axios";

export async function fetchOfertas(params: FiltrosDeOfertas, config?: AxiosRequestConfig) {
    return axios.get<OfertaDeImovel[]>('/api/ofertas', {
        params,
        ...config,
    }).then(({ data }) => data)
}