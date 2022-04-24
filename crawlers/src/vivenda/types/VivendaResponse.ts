export type FotoDeImovel = {
    picture_thumb: string
    picture_full: string
    photo_type: 'LISTING'
}

export type ImovelDaVivenda = {
    city: string
    neighborhood: string
    rent_price: number[]
    sales_price: number[]
    property_purposes: 'FOR_RENT' | 'FOR_SALE'
    show_price: 'RENT' | 'SALE'
    picture_thumb: string
    total_rent: number
    url: string
    listing_description: string
    photos: FotoDeImovel[]
}

export type VivendaResponse<T> = {
    data: T[]
    count: number
}