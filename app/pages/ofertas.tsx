
import { ImobiliariaService } from '@mobihub/core/src/services/ImobiliariaService';
import { FiltrosDeOfertas } from '@mobihub/core/src/services/OfertaDeImovelService';
import { Imobiliaria } from '@mobihub/core/src/types/Imobiliaria';
import { Fab, Hidden, Pagination, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Magnify from 'mdi-material-ui/Magnify';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { AppDrawer } from '../components/AppDrawer';
import { AppToolbar } from '../components/AppToolbar';
import GridDeOfertas from '../components/ofertas/GridDeOfertas';
import { fetchOfertas } from '../fetch/fetchOfertas';
import { parsearQueryParaFiltroDeOfertas } from '../utils/filtros';

const ITEMS_POR_PAGINA = 12
const QUERY_KEY = 'ofertas'

const Home: NextPage<Props> = ({ imobiliarias }) => {
  const totalDeOfertas = 0;
  const [drawer, setDrawer] = useState(false)
  const paginas = Math.ceil(totalDeOfertas / ITEMS_POR_PAGINA)
  const router = useRouter();
  const query = useMemo(() => router.query, [router.query])
  const [pagina, setPagina] = useState(() => Number(query.pagina) || 1)
  const queryClient = useQueryClient()

  const filtroDeOfertas: FiltrosDeOfertas = parsearQueryParaFiltroDeOfertas(query)
  const { data: ofertas, refetch, isLoading } = useQuery(QUERY_KEY, ({ signal }) => fetchOfertas(filtroDeOfertas, {
    signal,
  }))

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
    queryClient.cancelQueries(QUERY_KEY)
    refetch()
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
                loading={isLoading}
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const opcoesDeImobiliarias = await ImobiliariaService.listar()

  return {
    props: {
      imobiliarias: JSON.parse(JSON.stringify(opcoesDeImobiliarias)),
    },
  }
}

export default Home;
