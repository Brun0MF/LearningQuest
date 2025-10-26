import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import FlagIcon from '@mui/icons-material/Flag';
import LanguageIcon from '@mui/icons-material/Language';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Itens Principais',
    },
    {
        segment: 'home',
        title: 'Home',
        icon: <HomeIcon />,
    },
    {
        segment: 'cursos',
        title: 'Cursos',
        icon: <MenuBookIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Rankings',
    },
    {
        segment: 'Classificações',
        title: 'Classificações',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'mundial',
                title: 'Mundial',
                icon: <LanguageIcon />,
            },
            {
                segment: 'regional',
                title: 'Regional',
                icon: <FlagIcon />,
            },
        ],
    },
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent({ pathname }: { pathname: string }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Typography>Dashboard content for {pathname}</Typography>
        </Box>
    );
}



export default function SideBarAndHeader() {




    return (
        <>
            <AppProvider
                navigation={NAVIGATION}
                theme={demoTheme}
            >
                <DashboardLayout>
                    <DemoPageContent pathname={router.pathname} />
                </DashboardLayout>
            </AppProvider>

        </>
    );
}
