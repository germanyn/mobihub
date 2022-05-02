import { OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel'
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { OpenInNew } from 'mdi-material-ui'
import React from 'react'
import { formatarMoeda } from '../../utils/formatadores'
import CardDeOferta from './CardDeOferta'
import CardSkeleton from './CardSkeleton'

type Props = {
    loading?: boolean
    ofertas?: OfertaDeImovel[]
}

const GridDeOfertas: React.FC<Props> = ({ loading, ofertas = [] }) => {
    if (loading) {
        return <>
            {Array.from(Array(9), (_, indice) =>
                <Grid item xs={12} md={4} key={indice}>
                    <CardSkeleton/>
                </Grid>
            )}
        </>
    }
    if (!ofertas.length) {
        return (
            <Grid item xs={12}>
                <Typography
                    variant="h6"
                    align="center"
                    color='grey'
                >
                    Nenhum Imóvel encontrado, tente outra busca
                </Typography>
            </Grid>
        )
    }
    return <>
        {ofertas.map(oferta =>
            <Grid item xs={12} md={4} key={oferta._id}>
                <CardDeOferta oferta={oferta} />
            </Grid>
        )}
    </>
}

export default GridDeOfertas