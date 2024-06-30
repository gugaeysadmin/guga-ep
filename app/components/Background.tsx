import { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme} from "@mui/material"
import { backgroundLoggedColorLightBlue, backgroundLoggedColorWhite } from "../Styles/general"

const Background = ({open}:{open:boolean}) => {
    const [margin, setMargin] = useState("")
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    
    useEffect(() => {
        if(isXs){
            setMargin("calc(50vw - 60px)");
        } else if(isMd){
            open? setMargin("calc(40vw - 285px)"): setMargin("calc(40vw - 60px)");
        } 
    }, [isMd, isXs])
    return (
        <Box sx={{
            display: "flex",
           // justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(180deg, ${backgroundLoggedColorWhite}, 80%, ${backgroundLoggedColorLightBlue})`,
            zIndex: -100,
            //paddingLeft: { xs: 'calc(100vw - 60px)', md: open? 'calc(100vw - 285px)': 'calc(100vw - 60px)'}
          }}>
            <img  
                src={"/gugaOnlyLogo.png"}  
                style={{
                    height: "70vh", 
                    opacity: 0.07,
                    marginLeft: open? "calc(20vw + 280px)" :"auto",
                    marginRight: "auto",
                }}
            />
          </Box>
    )
}

export default Background;