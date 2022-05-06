import { OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel'
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import { OpenInNew } from 'mdi-material-ui'
import { formatarMoeda } from '../../utils/formatadores'

type Props = {
    oferta: OfertaDeImovel
}

const CardDeOferta: React.FC<Props> = ({ oferta }) => {
    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={oferta.fotos?.[0]}
            />
            <CardContent>
                <Typography variant="h6" component="div">
                    {oferta.imovel.endereco.bairro}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    style={{
                        lineClamp: 2,
                        height: '40px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {oferta.descricao || <div>&nbsp;</div>}
                </Typography>
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }} >
                    {oferta.modalidade}
                </Typography>
                <Typography variant="h5">
                    {formatarMoeda(oferta.valor)}
                </Typography>
                <Typography variant="caption" component="div">
                    Imobiliária {oferta.imobiliaria.nome}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color='primary'
                    variant='text'
                    href={oferta.link}
                    target='_blank'
                    endIcon={<OpenInNew />}
                >Detalhes</Button>
            </CardActions>
        </Card>
    )
}

export default CardDeOferta