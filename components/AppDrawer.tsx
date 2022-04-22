import { Box, Drawer, Grid, ToggleButton, ToggleButtonGroup, Toolbar, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import { drawerWidth } from "../constants";
import { Modalidade } from "../types/OfertaDeImovel";

export const AppDrawer = () => {
    const [modalidades, setModalidades] = useState<Modalidade[]>([Modalidade.VENDA])

    const handleModalidades = (
        event: React.MouseEvent<HTMLElement>,
        newDevices: Modalidade[],
    ) => {
        if (!newDevices.length) return
        setModalidades(newDevices);
    };
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
                            value={modalidades}
                            onChange={handleModalidades}
                            aria-label="device"
                            color="primary"
                            fullWidth
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
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            label="Máx."
                            variant="outlined"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    )
}