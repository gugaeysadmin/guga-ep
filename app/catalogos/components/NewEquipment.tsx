'use client' 
import React, {useState, useEffect} from "react"
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import {    Box,
            Button,
            Drawer,
            Typography,
            Grid,
            Divider,
            Collapse,
            Alert,
            IconButton,
            ThemeProvider
} from "@mui/material";

import AutoModeIcon from '@mui/icons-material/AutoMode';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CloseIcon from '@mui/icons-material/Close';


import {    StyledTextField,
            StyledDrawer,
            StyledButton,
            StyledCancelButton,
            StyledSuccessButton,
} from "@/app/Styles/styledComponents/StyledComponents";

import { colorText, colorTextWhite, darkTheme } from "@/app/Styles/general";
import { referenceEquipment } from "@/app/entities/domains";
import { ValidationError, ValidationPatterns } from "@/app/entities/rules";
import { saveEquipments, updateEquipments } from "@/app/services/catalogServices";
import { gridFilterActiveItemsLookupSelector } from "@mui/x-data-grid";


type NewEquipmentProps = {
    open: boolean;
    handleOpen: ()=>void;
    refresh: (section: string) => void;
    equipmentData?: referenceEquipment;
};


const NewEquipment: React.FC<NewEquipmentProps> = ({open = false, handleOpen, refresh, equipmentData}) => {
    const [alertOpen, setAlertOpen] = useState(false)
    const [isNew, setIsNew] = useState(true);

    const {
        control,
        setError,
        handleSubmit,
        clearErrors,
        setValue,
        reset,        
        formState: {errors, isSubmitSuccessful,isValid },
    } = useForm<referenceEquipment>({mode: "all"});

    useEffect(()=>{
        if(open ){
            clearErrors()
            if(!!equipmentData && typeof equipmentData !== null){
                reset(equipmentData)
                setIsNew(false);
            } else {
                setValue("referenceId", null);
                setValue("brand", null);
                setValue("codeNumber", null);
                setValue("description", null);
                setValue("name", null);
                setValue("price", null);
                setIsNew(true);
            } 
        }
    },[open,equipmentData])


    const handleCancelButton = () => {
        reset(null);
        handleOpen();
    }
    const handleSaveButton = async (data: referenceEquipment) => {
        try {
            (!!equipmentData)? await updateEquipments(data) : await saveEquipments(data);
            handleOpen();
            reset();
            refresh("referenceEquipment");
        }catch(error){
            setAlertOpen(true);
            throw error;
        }
    }
    return (
        <StyledDrawer
            open={open}
            anchor="right"
        >
            <ThemeProvider theme={darkTheme}>
                <Box sx={{p:2}}
                >
                    {/* Header */}
                    <Box display="flex" alignItems="center" height={70}>
                        <Typography variant="h4" color={colorTextWhite}>
                            {isNew ? "NUEVO EQUIPO" : "EDITAR EQUIPO"}
                        </Typography>
                    </Box>
                    <Divider color="#7a8494"/>
                    {/* Form */}
                    <Grid container sx={{mt: 2}} spacing={3}>
                        {/* Nombre */}
                        <Grid item xs={12}>
                            <Controller
                                name = "name"
                                control={control}
                                defaultValue=""
                                rules={{ required: ValidationError.required }}
                                render={({field})=>(
                                    <StyledTextField
                                        required
                                        label="Categoría"
                                        placeholder="Ingresar nombre de la categoría" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("name",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* Descripción */}
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                rules={{required: false}}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Descripción"
                                        placeholder="Ingresar descripción del equipo" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("description",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* Marca */}
                        <Grid item xs={12}>
                            <Controller
                                name="brand"
                                control={control}
                                defaultValue=""
                                rules={{required: false}}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Marca"
                                        placeholder="Ingresar la marca del equipo" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.brand}
                                        helperText={errors.brand?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("brand",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* Precio */}
                        {/* <Grid item xs={12}>
                            <Controller
                                name="price"
                                control={control}
                                defaultValue={0}
                                rules={{required: false}}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Precio"
                                        placeholder="Ingresar el precio del equipo" 
                                        variant="standard"
                                        type="number" 
                                        fullWidth
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("price",parseFloat(data.target.value))
                                        }}
                                    />
                                )}
                            />
                        </Grid> */}
                        {/* codigo */}
                        <Grid item xs={12}>
                            <Controller
                                name="codeNumber"
                                control={control}
                                defaultValue=""
                                rules={{required: false}}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Código"
                                        placeholder="Ingresar el código del equipo" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        error={!!errors.codeNumber}
                                        helperText={errors.codeNumber?.message}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("codeNumber",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    {/* Alert */}
                    <Collapse in={alertOpen}>
                        <Alert
                            variant="outlined"
                            severity="error"
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setAlertOpen(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                            >
                            Error de guardado
                        </Alert>
                    </Collapse>
                    {/* Buttons */}
                    <Grid container spacing={2} marginTop = {4}>
                        <Grid item  xs={12} sm={6} md={6}  display="flex" justifyContent="center">
                            <StyledCancelButton
                                variant="contained" 
                                onClick={handleCancelButton}
                                startIcon={<HighlightOffIcon/>}
                            >
                                    Cancelar
                            </StyledCancelButton>
                        </Grid>
                        <Grid item  xs={12} sm={6} md={6} display="flex" justifyContent="center">
                            <StyledSuccessButton 
                                variant="contained" 
                                onClick={handleSubmit(handleSaveButton)}
                                startIcon={<SaveIcon/>}
                            >
                                    {!!!equipmentData || typeof equipmentData === null ? <>Guardar</> : <>Actualizar</>}
                            </StyledSuccessButton>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </StyledDrawer>
    )
}

export default NewEquipment;