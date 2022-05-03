
import { ImobiliariaService } from '@mobihub/core/src/services/ImobiliariaService';
import { OfertaDeImovelService } from '@mobihub/core/src/services/OfertaDeImovelService';
import { Imobiliaria } from '@mobihub/core/src/types/Imobiliaria';
import { Modalidade, OfertaDeImovel } from '@mobihub/core/src/types/OfertaDeImovel';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { HomeHeart } from 'mdi-material-ui';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { AppDrawer } from '../components/AppDrawer';
import { AppToolbar } from '../components/AppToolbar';
import { normalizarParaArray } from '../utils/array';
import { useNextLoading } from '../hooks/useNextLoading'
import GridDeOfertas from '../components/ofertas/GridDeOfertas';


const Home: NextPage<Props> = ({ ofertas, imobiliarias }) => {
  const [drawer, setDrawer] = useState(false)
  const [loading] = useNextLoading()
  return (
    <Box sx={{ display: 'flex' }}>
      <AppToolbar onFiltroClick={() => setDrawer(!drawer)} />
      <AppDrawer
        imobiliarias={imobiliarias}
        aberto={drawer}
        onFechar={() => setDrawer(false)}
      />
      <Box component="main" sx={{ flex: 1 }}>
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
            <Grid container spacing={2} >
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
              <GridDeOfertas
                loading={loading}
                ofertas={ofertas}
              />
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
