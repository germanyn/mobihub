import { Box, Drawer, Grid, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Toolbar } from "@mui/material";
import { useRouter } from 'next/router';
import { drawerWidth } from "../constants";
import { Imobiliaria } from "../types/Imobiliaria";
import Autocomplete from '@mui/material/Autocomplete'

type AppDrawerProps = {
    imobiliarias: Imobiliaria[]
}

export const AppDrawer: React.VFC<AppDrawerProps> = ({ imobiliarias }) => {
    const router = useRouter();

    const setQueryParameter = (chave: string, valor: string) => {
        const query = router.query
        !valor
            ? delete query[chave]
            : query[chave] = valor
        router.push({ query })
    }

    return (
        <Drawer
            variant="permanent"
            open
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', flexGrow: 1, m: 1 }}>
                <Grid
                    container
                    spacing={2}
                    component="form"
                    noValidate
                    autoComplete="off"
                >
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            value={router.query.modalidade}
                            onChange={(_, valor) => setQueryParameter('modalidade', valor)}
                            aria-label="device"
                            color="primary"
                            fullWidth
                            exclusive
                        >
                            <ToggleButton value="venda" aria-label="venda">
                                Venda
                            </ToggleButton>
                            <ToggleButton value="aluguel" aria-label="aluguel">
                                Aluguel
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Mín."
                            variant="outlined"
                            onChange={(event) => setQueryParameter('min', event.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            type='search'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Máx."
                            variant="outlined"
                            onChange={(event) => setQueryParameter('max', event.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            type='search'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={imobiliarias}
                            getOptionLabel={option => option.nome}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Imobiliarias"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    )
}