
import { ImobiliariaService } from '@mobihub/core/src/services/ImobiliariaService';
import { OfertaDeImovelService } from '@mobihub/core/src/services/OfertaDeImovelService';
import { Imobiliaria } from '@mobihub/core/src/types/Imobiliaria';
import { OfertaDeImovel, Modalidade } from '@mobihub/core/src/types/OfertaDeImovel';
import { Button, CardActions, CardContent, CardMedia, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { OpenInNew, ChevronDownCircleOutline, HomeHeart } from 'mdi-material-ui';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { AppDrawer } from '../components/AppDrawer';
import { AppToolbar } from '../components/AppToolbar';
import { normalizarParaArray } from '../utils/array';
import { formatarMoeda } from '../utils/formatadores';

const Home: NextPage<Props> = ({ ofertas, imobiliarias }) => {
  const [drawer, setDrawer] = useState(false)
  return (
    <Box sx={{ display: 'flex' }}>
      <AppToolbar onFiltroClick={() => setDrawer(!drawer)} />
      <AppDrawer
        imobiliarias={imobiliarias}
        aberto={drawer}
        onFechar={() => setDrawer(false)}
      />
      <Box component="main">
        <Toolbar />
        <Container maxWidth="lg">
          <Box
            sx={{
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} textAlign='center'>
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  color='secondary'
                >
                  Ache seu imóvel perfeito
                </Typography>
                <HomeHeart color='secondary' fontSize='large' />
              </Grid>
              {ofertas.map(oferta =>
                <Grid item xs={12} md={4} key={oferta._id}>
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
                      <Typography gutterBottom variant="body1" component="div">
                        {oferta.imovel.endereco.cidade}
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
                </Grid>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

interface Props {
  ofertas: OfertaDeImovel[]
  imobiliarias: Imobiliaria[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { modalidade, min, max, imobiliarias } = query

  const normalizarModalidades = (modalidade?: string | string[] | undefined): `${Modalidade}`[] | undefined => {
    if (!modalidade || Array.isArray(modalidade)) return undefined;
    const lowerCase = modalidade.toLowerCase() as Modalidade
    if (Object.values(Modalidade).includes(lowerCase)) return [lowerCase];
    return undefined;
  }
  const ofertas = await OfertaDeImovelService.listar({
    limit: 12,
    skip: 0,
    modalidades: normalizarModalidades(modalidade),
    minimo: (min && typeof min === 'string') ? Number(min) : undefined,
    maximo: (max && typeof max === 'string') ? Number(max) : undefined,
    imobiliarias: imobiliarias ? normalizarParaArray(imobiliarias) : undefined,
  })

  const opcoesDeImobiliarias = await ImobiliariaService.listar()

  return {
    props: {
      ofertas: JSON.parse(JSON.stringify(ofertas)),
      imobiliarias: JSON.parse(JSON.stringify(opcoesDeImobiliarias)),
    },
  }
}

export default Home;
