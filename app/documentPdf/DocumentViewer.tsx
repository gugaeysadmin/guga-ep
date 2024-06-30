import { AppBar, Box, CircularProgress, Drawer, IconButton, Toolbar, Tooltip, Typography, circularProgressClasses } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useRef, useState } from "react"
import GugaDocument from "./GugaDocument";
import { useCotization } from "../hooks/useCotization";
import { blueDark, blueLight, colorTextWhite, gray, pageBgColor, sidebarColor } from "../Styles/general";

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import dynamic from "next/dynamic";
import { lightBlue } from "@mui/material/colors";
import { commercialAgents } from "../entities/domains";
import { downloadSignature, getCommercialAgent } from "../services/catalogServices";
import { FreeBreakfastTwoTone } from "@mui/icons-material";

type DocumentViewerProps = {
    open: boolean,
    onClose: (boolean) => void,
    cotization: any
}
const DocumentViewer: React.FC<DocumentViewerProps> = ({open, onClose, cotization}) =>{

  const [loading, setLoading] = useState(true);
  const [commertialAgent,setCommertialAgent] = useState<commercialAgents>(null);
  const [signature, setSignature] = useState<string>("");

  useEffect(() => {
    if(open){
        if(!!cotization){
            try {
                console.log("trayendo data")
                getCommercialAgent(cotization.generalData.comercialAgentId).then((data) => {
                    setCommertialAgent(() => data);
                });
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        setLoading(true)
    }

  }, [open]);

  useEffect(() => {
      if(!!commertialAgent){
          downloadSignature(commertialAgent.signature).then((data) => {
              setSignature(data);
              console.log(data)
              setLoading(false);
          })
      }
  },[commertialAgent])
    return(<>
        <Drawer
           open ={open}
           anchor="right"
           sx={{
            '& .MuiDrawer-paper': {
                //backgroundColor: 'grey', // Cambia 'blue' al color que desees
                backgroundColor: gray, // Cambia 'blue' al color que desees
                width: "100%",
                height: "100%",
            },
            zIndex: 210000
        }}
        >
            <AppBar position="sticky" sx={{marginBottom: 1}}>
                <Toolbar sx={{backgroundColor: sidebarColor, maxHeight: 10}}>
                    <IconButton 
                        onClick={()=> onClose(false)}
                        sx={{
                            color: colorTextWhite,
                            fontSize: 30,
                            cursor: "pointer",
                            position:"fixed",
                        }}
                    >
                        <Tooltip title="Regresar">
                        <ArrowCircleLeftIcon sx={{fontSize: 50,}}/>
                        </Tooltip>
                    </IconButton>
                    <Box sx={{marginLeft:"auto", marginRight: "auto"}}>
                        <Typography variant="h5" textAlign="center" sx={{ color: colorTextWhite, }}>
                            Vista previa
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box 
                display={"flex"} 
                justifyContent={"center"}
            >

                {loading && <>
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                            marginTop: "40vh",
                            color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                            animationDuration: '550ms',
                            [`& .${circularProgressClasses.circle}`]: {
                                strokeLinecap: 'round',
                            },
                        }}
                        size={50}
                        thickness={6}
                    />
                </>}
                <Box display={loading? "none": "block"}>
                    <PDFViewer width={880} height={700} showToolbar>
                        <GugaDocument
                            generalData={cotization.generalData} 
                            equipments={cotization.equipments} 
                            prices={cotization.prices} 
                            commertialAgent={commertialAgent}
                            signature={signature}
                        />
                    </PDFViewer>
                </Box>
            </Box>
        </Drawer>
    
    </>)
}

export default DocumentViewer;