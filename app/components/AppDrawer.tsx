import { Box, Drawer, Grid, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from 'next/router';
import { drawerWidth } from "../constants";
import { Imobiliaria } from "@mobihub/core/src/types/Imobiliaria";
import Autocomplete from '@mui/material/Autocomplete'
import { useMemo } from "react";
import { normalizarParaArray } from "../utils/array";

type AppDrawerProps = {
    imobiliarias: Imobiliaria[]
    aberto?: boolean
    onFechar?: () => void
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ imobiliarias, aberto = true, onFechar }) => {
    const router = useRouter();    
    const theme = useTheme();    
    const éMobile = useMediaQuery(theme.breakpoints.down('md'));

    const setQueryParameter = (chave: string, valor: string | string[]) => {
        const query = router.query
        !valor || (Array.isArray(valor) && !valor.length)
            ? delete query[chave]
            : query[chave] = valor
        router.push({ query })
    }

    const opcoesDeImobiliarias = useMemo(() => {
        return imobiliarias.map(({ nome }) => nome)
    }, [imobiliarias])

    return (
        <Drawer
            variant={éMobile ? "temporary" : "permanent"}
            open={aberto}
            onClose={() => onFechar && onFechar()}
            anchor={éMobile ? "right" : "left"}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                // [theme.breakpoints.down('md')]: {
                //     width: 240,
                //     flexShrink: 0,
                //     [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                // },
                // [theme.breakpoints.up('md')]: {
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                // },
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
                        <Typography variant="h6" children="Filtros" align="center" />
                    </Grid>
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            value={router.query.modalidade}
                            onChange={(_, valor) => setQueryParameter('modalidade', valor)}
                            aria-label="device"
                            color="primary"
                            fullWidth
                            exclusive
                            size="small"
                        >
                            <ToggleButton value="venda" aria-label="venda">
                                Venda
                            </ToggleButton>
                            <ToggleButton value="aluguel" aria-label="aluguel">
                                Aluguel
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={router.query.min}
                            label="Mínimo"
                            variant="outlined"
                            onChange={(event) => setQueryParameter('min', event.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            type='search'
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={router.query.max}
                            label="Máximo"
                            variant="outlined"
                            onChange={(event) => setQueryParameter('max', event.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            type='search'
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={opcoesDeImobiliarias}
                            value={router.query.imobiliarias ? normalizarParaArray(router.query.imobiliarias) : []}
                            onChange={(_, valores) => setQueryParameter('imobiliarias', valores)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Imobiliarias"
                                />
                            )}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    )
}