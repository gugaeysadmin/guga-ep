'use client'
import { useState, useEffect } from "react"

import { Box, Button, Modal } from "@mui/material";
import { generalStyleBoxModal } from "../Styles/general";


type WarnMessageType = {
    children
    visible: boolean;
    setVisible: (status: boolean)=> void;
    onAgree: ()=> void;
} 
export const WarnMessage: React.FC<WarnMessageType> = (props) => {
    return (
        <Modal open={props.visible}>
            <Box sx={generalStyleBoxModal}>
                
                <Box display={'flex'} justifyContent={"center"} mt={2}>
                    {props.children}
                </Box>

                <Box display={'flex'} gap={'30px'} justifyContent={"center"} mt={4}>
                    <Button variant='contained' color='error' onClick={()=>props.setVisible(false)} disabled={false}>
                        Cancelar
                    </Button>

                    <Button variant='contained' color='success' onClick={() => {
                        props.onAgree()
                        props.setVisible(false) 
                    }} disabled={false}>
                        Aceptar
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
} 