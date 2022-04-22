import { AppBar, Toolbar, IconButton, Typography } from "@mui/material"; import MenuIcon from '@mui/icons-material/Menu';

export const AppToolbar = () =>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
            >
                MobiHub
            </Typography>
        </Toolbar>
    </AppBar>