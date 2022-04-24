
import { ImobiliariaService } from '@mobihub/core/src/services/ImobiliariaService';
import { OfertaDeImovelService } from '@mobihub/core/src/services/OfertaDeImovelService';
import { Imobiliaria } from '@mobihub/core/src/types/Imobiliaria';
import { OfertaDeImovel, Modalidade } from '@mobihub/core/src/types/OfertaDeImovel';
import { Button, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { OpenInNew } from 'mdi-material-ui';
import type { GetServerSideProps, NextPage } from 'next';
import { AppDrawer } from '../components/AppDrawer';
import { AppToolbar } from '../components/AppToolbar';

const Home: NextPage<Props> = ({ ofertas, imobiliarias }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppToolbar />
      <AppDrawer imobiliarias={imobiliarias}/>
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
                      {oferta.descricao && <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        style={{
                          lineClamp: 2,
                          maxHeight: '40px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {oferta.descricao}
                      </Typography>}
                      <Typography variant="h5">
                        R$ {oferta.valor}
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
                        endIcon={<OpenInNew/>}
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
  const { modalidade, min, max } = query
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
  })

  const imobiliarias = await ImobiliariaService.listar()

  return {
    props: {
      ofertas: JSON.parse(JSON.stringify(ofertas)),
      imobiliarias: JSON.parse(JSON.stringify(imobiliarias)),
    },
  }
}

export default Home;
