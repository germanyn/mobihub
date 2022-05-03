import { Modalidade } from "@mobihub/core/src/types/OfertaDeImovel"

export type QueryStringDeOfertas = {
    modalidade?: `${Modalidade}`
    min?: `${number}`
    max?: `${number}`
    imobiliarias?: string[]
}