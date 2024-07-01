import { Theme, SxProps, createTheme } from "@mui/material"

export const colorText = '#073266';
export const colorImage = '#073266';
export const pageBgColor = '#ffffff';
export const sidebarColor = '#073266';
export const blueDark = '#073266';
export const blueUltraDark = '#071133'
export const modalBgColor = '#e9eff2';
export const drawerWidth = 330;
export const blueLight = '#0e51a1';
export const blueGrey = '#445e80';
export const darkBlueGrey = '#6081ab';
export const blueLightHover = '#0b3a73';
export const colorTextBlack = '#091a25';
export const colorTextWhite = '#ffffff';
export const colorDrawer = '#073266';
export const redWarn = '#942b2b';
export const pagesBorderRadious = 4;
//export const backgroundColorLightBlue = '#84d3f5';
//export const backgroundColorBlue = '#073266';
export const backgroundColorBlue = '#032752';
export const backgroundColorLightBlue = '#1976D2';
export const backgroundColorWhite = '#F2F2F2';
export const backgroundLoggedColorBlue = '#032752';
export const backgroundLoggedColorLightBlue = '#b4c8db';
export const backgroundLoggedColorWhite = '#F2F2F2';
export const successGreenButton = "#1982d1";
export const successGreen = "#0a4673";

export const gray = "#494947";
export const sideBarStyle = (drawerWidth: number) => { return {
    display: { xs: 'none', sm: 'none', md: 'block' },
    '& .MuiDrawer-paper': { 
        boxSizing: 
        'border-box',
        width: drawerWidth,
        bgcolor: '#172332',
        mt: 1,
        ml: 1,
        mb: 2,
        borderRadius: pagesBorderRadious,
    },
}}

export const homeStyle: SxProps = {
    bgcolor: '#172332', 
    m: 1,
    pt: 2,
    pb: 4,
    minHeight: '86.2vh',
    borderRadius: pagesBorderRadious,
}

export const headerStyle: SxProps = {
    borderRadius: pagesBorderRadious,
}

export const reportStyle: SxProps = {
    minHeight: '98vh',
    mt: 1,
    ml: 1,
    mr: 1,
    borderRadius: pagesBorderRadious,
    p: 2,
    bgcolor: '#172332', 
}

export const generalStyleBoxModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px 8px 8px 8px",
    maxHeight: '80vh',
    maxWidth: '80vw',
    overflow: 'auto',
  }

  export const tableStyleBoxModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px 8px 8px 8px",
    maxHeight: '80vh',
    width: '80vw',
    overflow: 'auto',
  }

export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});