'use client' 
import React, {useState, useEffect} from "react"
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import {    Box,
            Typography,
            Grid,
            Divider,
            Alert,
            Collapse,
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
import { clients } from "@/app/entities/domains";
import { ValidationError, ValidationPatterns } from "@/app/entities/rules";
import { saveClients, updateClients } from "@/app/services/catalogServices";

type NewClientProps = {
    open: boolean;
    handleOpen: ()=>void;
    refresh: (section: string) => void;
    clientData?: clients;
};

const NewClient: React.FC<NewClientProps> = ({open = false, handleOpen, refresh, clientData}) => {

    const [alertOpen, setAlertOpen] = useState(false)
    const [isNew, setIsNew] = useState(true);

    const {
        control,
        setError,
        clearErrors,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isSubmitSuccessful,isValid },
    } = useForm<clients>({mode: "all"})


    useEffect(()=>{
        if(open ){
            clearErrors()
            if(!!clientData && typeof clientData !== null){
                reset(clientData)
                setIsNew(false);
            } else {
                setValue("clientId", null);
                setValue("companyDirection", null);
                setValue("companyName", null);
                setValue("contactName", null);
                setValue("contactEmail", null);
                setValue("contactPhone", null);
                setValue("contactSecondPhone", null);
                setIsNew(true);
            } 
            
        }
    },[open])

    const handleCancelButton = () => {
        handleOpen()
    }
    const handleSaveButton = async (data: clients) => {


        try {
            (!!clientData)? await updateClients(data) : await saveClients(data);
            handleOpen();
            reset();
            refresh("clients");
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
                    component="form" 
                    noValidate 
                    autoComplete="off"
                    onSubmit={handleSubmit(handleSaveButton)}
                >
                    {/* Header */}
                    <Box display="flex" alignItems="center" height={70}>
                        <Typography variant="h4" color={colorTextWhite}>
                            {isNew ? "NUEVO CLIENTE" : "EDITAR CLIENTE"}
                        </Typography>
                    </Box>
                    <Divider color="#7a8494"/>
                    {/* Form */}
                    <Grid container sx={{mt: 2}} spacing={3}>

                        {/* Empresa */}
                        <Grid item xs={12}>
                            <Controller
                                name="companyName"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: ValidationError.required,
                                    pattern: {
                                        value: ValidationPatterns.onlyText.pattern,
                                        message: ValidationPatterns.onlyText.errorMessage,
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        required
                                        label="Empresa"
                                        placeholder="Ingresar nombre de empresa" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors?.companyName}
                                        helperText={errors.companyName?.message}
                                        inputProps={{style: {color: colorTextWhite}}}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("companyName",data.target.value)
                                        }}
                                    />
                                )}
                            
                            />
                        </Grid>

                        {/* Dirección de empresa */}
                        <Grid item xs={12}>
                            <Controller
                                name="companyDirection"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.openText.pattern,
                                        message: ValidationPatterns.openText.errorMessage,
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        //required
                                        label="Dirección"
                                        placeholder="Ingresar dirección de la empresa" 
                                        variant="standard"
                                        multiline
                                        rows={4} 
                                        fullWidth
                                        error={!!errors.companyDirection}
                                        helperText={errors.companyDirection?.message}
                                        inputProps={{style: {color: colorTextWhite}}}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            },
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("companyDirection",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Nombre contacto */}
                        <Grid item xs={12}>
                            <Controller
                                name="contactName"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.onlyText.pattern,
                                        message: ValidationPatterns.onlyText.errorMessage,
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        //required
                                        label="Contacto"
                                        placeholder="Ingresar nombre de contacto" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.contactName}
                                        helperText={errors.contactName?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("contactName",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Email contacto */}
                        <Grid item xs={12}>
                            <Controller
                                name="contactEmail"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.email.pattern,
                                        message: ValidationPatterns.email.errorMessage
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        //required
                                        label="E-mail"
                                        placeholder="Ingresar e-mail de contacto" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        error={!!errors?.contactEmail}
                                        helperText={errors.contactEmail?.message}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("contactEmail",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Telefono contacto */}
                        <Grid item xs={12}>
                            <Controller
                                name="contactPhone"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.openText.pattern,
                                        message: ValidationPatterns.openText.errorMessage
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        //required
                                        label="Teléfono"
                                        placeholder="Ingresar Teléfono principal" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        error={!!errors?.contactPhone}
                                        helperText={errors.contactPhone?.message}
                                        onChange={(data)=>{
                                            setValue("contactPhone",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Teléfono opcional Contacto */}
                        <Grid item xs={12}>
                            <Controller
                                name="contactSecondPhone"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.openText.pattern,
                                        message: ValidationPatterns.openText.errorMessage
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Teléfono opcional"
                                        placeholder="Ingresar teléfono opcional" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        error={!!errors?.contactPhone}
                                        helperText={errors.contactPhone?.message}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("contactSecondPhone",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Alerts */}
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
                                type="submit"
                                startIcon={<SaveIcon/>}
                            >
                                {!!!clientData || typeof clientData === null ? <>Guardar</> : <>Actualizar</>}
                            </StyledSuccessButton>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </StyledDrawer>
    )
}

export default NewClient;

                    /*   
                        <Controller
                            name=""
                            control={control}
                            defaultValue=""
                            rules={{required: false}}
                            render={({field})=>(
                            )}
                        />

                                    value={field.value}
                                    onChange={(data)=>{
                                        setValue("",data.target.value)
                                    }}
 */
                        