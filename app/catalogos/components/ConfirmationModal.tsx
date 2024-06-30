"use client"

import React, { useEffect} from "react"; 
import { Modal, Box, Stack,  CircularProgress, Typography, Button } from "@mui/material";

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { blueLight } from "@/app/Styles/general";

type ModalConfirmationProps  = {
    children?: any;
    visible: boolean;
    setVisible: (isVisible: boolean) => void;
    isLoading: boolean;
    success: boolean;
    hasButton?: boolean;
    errorMessage?: string;
    maxWidth?: number;
}


const ModalConfirmation: React.FC<ModalConfirmationProps> = ({children, visible, setVisible, isLoading, success,hasButton = false, errorMessage, maxWidth }) => {

    useEffect(() => {
        if((hasButton === false || success === false) && !isLoading){
            setTimeout(()=>{
                handleClose();
            },3000)
        }
    },[isLoading])

    const handleClose = () => setVisible(false)

    const validation  = () =>{
        return(
            <>

                  {success?(
                    <>
                        <DoneIcon  fontSize="inherit" sx = {{ fontSize: 120, color: blueLight }} />
                        {children ? (
                            <> {children} </>
                        ):(<></>) }
                        {hasButton ? (
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                onClick={handleClose}
                            >
                                Aceptar
                            </Button>
                        ):(<></>) }
                    </>
                  ):(
                    <>
                        <CloseIcon fontSize = "inherit" color = "error" sx = {{ fontSize: 120 }} />
                        {!!errorMessage?(<>
                            <Typography align="center" >{errorMessage}</Typography>
                        </>):(<>
                            <Typography align="center" >Hubo un problema</Typography>
                        </>)}
                        {hasButton ? (
                            <Button
                                color="primary"
                                variant="outlined"
                                size="small"
                                onClick={handleClose}
                            >
                                Cerrar
                            </Button>
                        ):(<></>) }
                    </>
                  )}

            </>
        )
    }


    return (
        <Modal open = { visible } >
            <Box sx = {{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 200,
                maxWidth: (!!maxWidth)? maxWidth: 200,
                minHeight:  100,
                maxHeight: "auto",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "8px 8px 8px 8px",
            }} >
                <Stack 
                    justifyContent={"center"}
                    alignItems={"center"}
                    spacing={2}
                >
                    {isLoading?(
                        <Box>
                            <CircularProgress 
                                color = "primary" 
                                size = {100}
                            />

                            <Typography variant="h6" sx={{mt: 2}}>
                                Cargando...
                            </Typography>
                        </Box>
                    ) : ( validation() )}
                </Stack>
            </Box>
        </Modal>

    )
}

export default ModalConfirmation;
