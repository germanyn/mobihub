import { OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel'
import useSWR from 'swr'

export function useOfertas() {
    return useSWR<OfertaDeImovel[]>('/api/ofertas')
}