
import { ImobiliariaService } from '@mobihub/core/src/services/ImobiliariaService';
import { FiltrosDeOfertas } from '@mobihub/core/src/services/OfertaDeImovelService';
import { Imobiliaria } from '@mobihub/core/src/types/Imobiliaria';
import { Fab, Hidden, Pagination, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { AxiosRequestConfig } from 'axios';
import { Magnify } from 'mdi-material-ui';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import useSWR from 'swr';
import { AppDrawer } from '../components/AppDrawer';
import { AppToolbar } from '../components/AppToolbar';
import GridDeOfertas from '../components/ofertas/GridDeOfertas';
import { axiosInstace } from '../utils/axios';
import { parsearQueryParaFiltroDeOfertas } from '../utils/filtros';

const ITEMS_POR_PAGINA = 12

const fetcher = (url: string, config?: AxiosRequestConfig) => axiosInstace.get(url, config).then(({ data }) => data)

const Home: NextPage<Props> = ({ imobiliarias }) => {
  const totalDeOfertas = 0;
  const [drawer, setDrawer] = useState(false)
  const paginas = Math.ceil(totalDeOfertas / ITEMS_POR_PAGINA)
  const router = useRouter();
  const query = useMemo(() => router.query, [router.query])
  const [pagina, setPagina] = useState(() => Number(query.pagina) || 1)

  const filtroDeOfertas: FiltrosDeOfertas = parsearQueryParaFiltroDeOfertas(query)
  const { data, mutate } = useSWR('/api/ofertas', (url) => fetcher(url, { params: filtroDeOfertas }))

  const ofertas = data || [];
  const loading = !data

  const handleChangePagina = (_event: React.ChangeEvent<unknown>, valor: number) => {
    setPagina(valor)
    router.push({
      query: {
        ...query,
        pagina: valor,
      },
    })
  }

  useUpdateEffect(() => {
    mutate()
  }, [query])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppToolbar onFiltroClick={() => setDrawer(!drawer)} />
      <Hidden smUp>
        <Fab
          aria-label="abrir o filtro"
          onClick={() => setDrawer(!drawer)}
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <Magnify />
        </Fab>
      </Hidden>
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
                  color='secondary'
                >
                  Imóveis encontrados {totalDeOfertas}
                </Typography>
              </Grid>
              <GridDeOfertas
                loading={loading}
                ofertas={ofertas}
              />
              <Grid item xs={12}>
                <Pagination
                  count={paginas}
                  color="primary"
                  sx={{ justifyContent: 'center' }}
                  page={pagina}
                  onChange={handleChangePagina}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

interface Props {
  // ofertas: OfertaDeImovel[]
  imobiliarias: Imobiliaria[]
  // totalDeOfertas: number
}

// export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req }) => {
//   const { modalidade, min, max, imobiliarias, bairros, pagina = 1 } = query

//   const normalizarModalidades = (modalidade?: string | string[] | undefined): `${Modalidade}`[] | undefined => {
//     if (!modalidade || Array.isArray(modalidade)) return undefined;
//     const lowerCase = modalidade.toLowerCase() as Modalidade
//     if (Object.values(Modalidade).includes(lowerCase)) return [lowerCase];
//     return undefined;
//   }
//   const filtroDeOfertas: FiltrosDeOfertas = {
//     modalidades: normalizarModalidades(modalidade),
//     minimo: (min && typeof min === 'string') ? Number(min) : undefined,
//     maximo: (max && typeof max === 'string') ? Number(max) : undefined,
//     imobiliarias: imobiliarias ? normalizarParaArray(imobiliarias) : undefined,
//     bairros: bairros ? normalizarParaArray(bairros) : undefined,
//   }
//   const [
//     ofertas,
//     totalDeOfertas,
//     opcoesDeImobiliarias,
//   ] = await Promise.all([
//     OfertaDeImovelService.listar({
//       limit: ITEMS_POR_PAGINA,
//       skip: (Number(pagina) - 1) * ITEMS_POR_PAGINA,
//       ...filtroDeOfertas
//     }),
//     OfertaDeImovelService.totalizar(filtroDeOfertas),
//     ImobiliariaService.listar(),
//   ])

//   return {
//     props: {
//       ofertas: JSON.parse(JSON.stringify(ofertas)),
//       totalDeOfertas,
//       imobiliarias: JSON.parse(JSON.stringify(opcoesDeImobiliarias)),
//     },
//   }
// }

export const getStaticProps: GetStaticProps<Props> = async () => {
  const opcoesDeImobiliarias = await ImobiliariaService.listar()

  return {
    props: {
      imobiliarias: JSON.parse(JSON.stringify(opcoesDeImobiliarias)),
    },
  }
}

export default Home;
