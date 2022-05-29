import { AppBar, Box, Fab, Hidden, Toolbar, Typography } from "@mui/material";
import Menu  from 'mdi-material-ui/Menu';
import HomeMapMarker from 'mdi-material-ui/HomeMapMarker';

type AppToolbarProps = {
    onMenuClick?: () => void
    onFiltroClick?: () => void
}

export const AppToolbar: React.FC<AppToolbarProps> = ({ onFiltroClick }) =>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            {/* <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={onMenuClick}
            >
                <Menu />
            </IconButton> */}
            <HomeMapMarker sx={{ mr: 2 }} />
            <Typography
                variant="h6"
                noWrap
                component="div"
            >
                MobiHub
            </Typography>
            <Box flex={1} />
        </Toolbar>
    </AppBar>