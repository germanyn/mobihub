
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
import dbConnect from '../libs/dbConnect';
import { OfertaDeImovelModel } from '../libs/schemas/OfertaDeImovel';
import { OfertaDeImovel } from '../types/OfertaDeImovel';

const drawerWidth = 240;

const Home: NextPage<Props> = ({ ofertas }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppToolbar />
      <AppDrawer/>
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
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  await dbConnect()
  const ofertas = await OfertaDeImovelModel.find().limit(20).lean().exec()
  return {
    props: {
      ofertas: JSON.parse(JSON.stringify(ofertas)),
    },
  }
}

export default Home;
