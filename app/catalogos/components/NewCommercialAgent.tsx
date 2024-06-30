'use client' 
import React, {useState, useEffect, ChangeEvent} from "react"
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import {    Box,
            Typography,
            Grid,
            Divider,
            Alert,
            Collapse,
            IconButton,
            FormControlLabel,
            Checkbox,
            InputAdornment,
            ThemeProvider, createTheme,
            MenuItem,
            FormControl,
            FormHelperText,
            InputLabel,
            Select,
            LinearProgress
} from "@mui/material";

import AutoModeIcon from '@mui/icons-material/AutoMode';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CloseIcon from '@mui/icons-material/Close';

import { MuiFileInput } from 'mui-file-input'
import AttachFileIcon from '@mui/icons-material/AttachFile'

import {    StyledTextField,
            StyledDrawer,
            StyledCancelButton,
            StyledSuccessButton,
} from "@/app/Styles/styledComponents/StyledComponents";

import { colorText, colorTextWhite, darkTheme } from "@/app/Styles/general";
import { commercialAgents, commercialAgentsForm } from "@/app/entities/domains";
import { ValidationError, ValidationPatterns } from "@/app/entities/rules";
import { saveCommercialAgents, updateCommercialAgent } from "@/app/services/catalogServices";
import { error } from "console";
import { FileUpload, Visibility, VisibilityOff } from "@mui/icons-material";
import { sign } from "crypto";

type NewCommercialAgentProps = {
    open: boolean;
    handleOpen: ()=>void;
    refresh: (section: string) => void;
    commercialAgentData?: commercialAgents;    
    isNew: boolean;
};


const NewCommercialAgent : React.FC<NewCommercialAgentProps> = ({open = false, handleOpen, refresh, commercialAgentData, isNew}) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [isAdminchk, setIsAdminchk] = useState(false);
    const [isAdminOnEdit, setIsAdminOnEdit] = useState(false);
    const [pwdIsVisible, setPwdIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [file, setFile] = useState<File>(null)
    const [errorFile, setErrorFile] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        clearErrors,
        reset,
        trigger,
        formState: {errors},
    } = useForm<commercialAgentsForm>({mode: "onChange"})

    useEffect(()=>{
        if(open ){
            clearErrors()
            if(!isNew){
                reset(commercialAgentData)
                setFile(null)
                setErrorFile("")
                if(commercialAgentData.isAdmin){ 
                    setIsAdminchk(true);
                    setIsAdminOnEdit(true);
                    setValue("password", null);
                } else {
                    setIsAdminOnEdit(false);
                }
                setPwdIsVisible(false);
            } else {
                setIsAdminchk(false);
                setPwdIsVisible(false);
                setValue("agentId", null);
                setValue("email", null);
                setValue("firstLastName", null);
                setValue("isAdmin", null);
                setValue("names", null);
                setValue("numCotizations", null);
                setValue("password", null);
                setValue("repeatPassword", null);
                setValue("phone", null);
                setValue("secondLastName", null);
                setValue("secondPhone", null);
                setValue("signature", null);
                setValue("role", null);
            } 
        }else {
            setIsAdminchk(false);
            setIsAdminOnEdit(false);
        }
    },[open])

    const handleCancelButton = () => {
        reset(null)
        handleOpen()
    }

    const handleSaveButton = async (formdata: commercialAgentsForm) => {
        let data: commercialAgents = {
            agentId: formdata.agentId,
            email: formdata.email,
            firstLastName: formdata.firstLastName,
            isAdmin: formdata.isAdmin,
            names: formdata.names,
            numCotizations: formdata.numCotizations,
            password: formdata.password,
            phone: formdata.phone,
            secondLastName: formdata.secondLastName,
            secondPhone: formdata.secondPhone,
            signature: formdata.signature,
            role: formdata.role
        }
        try {
            if(!!commercialAgentData){
                setLoading(true);
                if(!!!file){
                    await updateCommercialAgent(data)
                } else {
                    await updateCommercialAgent(data, file)
                }
                handleClose();
                setLoading(false);
            } else {
                setLoading(true);
                if(!!file){
                    await saveCommercialAgents(data, file)
                    handleClose();
                }
                else
                    setErrorFile("Debe subir un archivo");
                setLoading(false);
            }   
        }catch(error){
            setAlertOpen(true);
            throw error;
        }
    }

    const handleClose = () => {
            handleOpen();
            reset();
            refresh("commercialAgents");
            setFile(null);
            setErrorFile("");   
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleClickShowRepeatPassword = () => setShowRepeatPassword((show) => !show);

    function handleChangeCheckBox(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
       setIsAdminchk(checked);
       setValue("isAdmin", checked);
       if(isNew){
            setPwdIsVisible(checked);
       }
       if(!isAdminOnEdit){
            setPwdIsVisible(checked);
       }
       if(!checked){
            setValue("password", "");
            setValue("repeatPassword", "");
       }
    }

    const handleFileChange = (newFile: File) => {
        setFile(newFile)
        setErrorFile("");
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
                        { isNew ? <> NUEVO AGENTE COMERCIAL </>: <> EDITAR AGENTE COMERCIAL</>}
                    </Typography>
                </Box>
                <Divider color="#7a8494" sx={{marginTop: 2}}/>
                {/* Form */}
                <Grid container sx={{mt: 2}} spacing={3}>
                        {/* NOMBRES */}
                        <Grid item xs={12}>
                            <Controller
                                name="names"
                                control={control}
                                rules={{
                                    required: ValidationError.required,
                                    pattern: {
                                        value: ValidationPatterns.onlyText.pattern,
                                        message: ValidationPatterns.onlyText.errorMessage
                                    }
                                }}
                                defaultValue=""
                                render={({field})=>(
                                    <StyledTextField
                                        required
                                        label="Nombres"
                                        placeholder="Ingresar nombre/s" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.names}
                                        helperText={errors.names?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("names",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* APELLIDO PATERNO */}
                        <Grid item xs={12}>
                            <Controller
                                name="firstLastName"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: ValidationError.required,
                                    pattern: ValidationPatterns.onlyText.pattern,
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Apellido paterno"
                                        placeholder="Ingresar apellido paterno" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.firstLastName}
                                        helperText={errors.firstLastName?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("firstLastName",data.target.value)
                                        }}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        {/* APELLIDO MATERNO */}
                        <Grid item xs={12}>
                            <Controller
                                name="secondLastName"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.onlyText.pattern,
                                        message: ValidationPatterns.onlyText.errorMessage
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Apellido materno"
                                        placeholder="Ingresar apellido materno" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.secondLastName}
                                        helperText={errors.secondLastName?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("secondLastName",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* EMAIL */}
                        <Grid item xs={12}>
                            <Controller
                                name="email"
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
                                        label="E-mail"
                                        placeholder="Ingresar correo electónico" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("email",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* TELEFONO */}
                        <Grid item xs={12}>
                            <Controller
                                name="phone"
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
                                        label="Teléfono principal"
                                        placeholder="Ingresar Teléfono" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("phone",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* TELEFONO 2*/}
                        <Grid item xs={12}>
                            <Controller
                                name="secondPhone"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: ValidationPatterns.onlyNumbers.pattern,
                                        message: ValidationPatterns.onlyNumbers.errorMessage
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Teléfono Opcional"
                                        placeholder="Ingresar Teléfono" 
                                        variant="standard" 
                                        fullWidth
                                        error={!!errors.secondPhone}
                                        helperText={errors.secondPhone?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("secondPhone",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>  
                        {/* ROLE */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel required error={!!errors?.role}>
                                    Ingresar Rol
                                </InputLabel>
                                <Controller
                                    name="role"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: ValidationError.required,
                                        pattern: {
                                            value: ValidationPatterns.openText.pattern,
                                            message: ValidationPatterns.openText.errorMessage
                                        }
                                    }}
                                    render={({field})=>(
                                        <Select
                                            label="Rol"
                                            placeholder="Ingresar rol" 
                                            variant="standard" 
                                            fullWidth
                                            required
                                            error={!!errors.phone}
                                            value={field.value}
                                            onChange={(data)=>{
                                                setValue("role",data.target.value)
                                            }}
                                        >
                                            <MenuItem value="Asistente comercial">Asistente comercial</MenuItem>    
                                            <MenuItem value="Gerente comercial">Gerente comercial</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors?.role && <FormHelperText error>{errors?.role?.message}</FormHelperText>}
                            </FormControl>
                            {/* <Controller
                                name="role"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: ValidationError.required,
                                    pattern: {
                                        value: ValidationPatterns.openText.pattern,
                                        message: ValidationPatterns.openText.errorMessage
                                    }
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        label="Rol"
                                        placeholder="Ingresar rol" 
                                        variant="standard" 
                                        fullWidth
                                        select
                                        required
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("role",data.target.value)
                                        }}
                                    >
                                        <MenuItem value="Agente de ventas">Agente de ventas</MenuItem>    
                                        <MenuItem value="Gerente comercial">Gerente comercial</MenuItem>
                                    </StyledTextField>
                                )}
                            /> */}
                        </Grid>
                        {/* SIGNATURE UPLOAD */}
                        <Grid item xs={12} mt={2}>
                            <ThemeProvider theme={darkTheme}>
                                <MuiFileInput 
                                    value={file} 
                                    onChange={handleFileChange} 
                                    InputProps={{ 
                                        inputProps:{
                                            accept: '.png',
                                        },
                                        startAdornment: <AttachFileIcon />
                                    }} 
                                    clearIconButtonProps={{
                                        title: "Remove",
                                        children: <CloseIcon fontSize="small"/>
                                    }}
                                    label={"Ingresar firma ( .png sin fondo )"}
                                    helperText={!!errorFile ? errorFile : "Tamaño recomendado"}
                                    error={!!errorFile}
                                />
                            </ThemeProvider>
                        </Grid>    

                        {/* IsAdmin*/}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={isAdminchk} 
                                        onChange={handleChangeCheckBox} 
                                        name="isAdmin" 
                                        sx={{
                                            color: colorTextWhite,
                                            '&.Mui-checked': {
                                                color: colorTextWhite,
                                            },
                                            '&.Mui-disabled': {
                                                color: colorTextWhite,
                                            },
                                        }}
                                    />}
                                label="Es Administrador"
                                sx={{color: colorTextWhite}}
                            />

                        </Grid>
                        <Collapse in= {!isNew && isAdminchk && isAdminOnEdit} sx={{width: '100%', paddingLeft: 3, marginTop: 2}}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            checked={pwdIsVisible} 
                                            onChange={()=> pwdIsVisible? setPwdIsVisible(false): setPwdIsVisible(true) } 
                                            sx={{
                                                color: colorTextWhite,
                                                '&.Mui-checked': {
                                                    color: colorTextWhite,
                                                },
                                                '&.Mui-disabled': {
                                                    color: colorTextWhite,
                                                },
                                            }}
                                        />}
                                    label="Recuperar Contraseña"
                                    sx={{color: colorTextWhite}}
                                />
                            </Grid>
                        </Collapse>

                        <Collapse in={pwdIsVisible} sx={{width: '100%', paddingLeft: 3, marginTop: 2}}>
                            {/* Password*/}
                            <Grid item xs={12}>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    disabled = {!pwdIsVisible}
                                    rules={{
                                        required: { value: pwdIsVisible, message: ValidationError.required},
                                    }}
                                    render={({field})=>(
                                        <StyledTextField
                                            label="Contraseña"
                                            placeholder="Ingresar Contraseñas" 
                                            variant="standard"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            disabled = {!pwdIsVisible}
                                            InputProps = {{
                                                style: {
                                                    color: colorTextWhite
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ marginRight: 2}}>
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                        {showPassword ? <VisibilityOff sx={{color: colorTextWhite}} /> : <Visibility sx={{color: colorTextWhite}}/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                                
                                            }}
                                            InputLabelProps={{
                                                style: {
                                                    color: colorTextWhite,
                                                }
                                            }}
                                            value={field.value}
                                            onChange={(data)=>{
                                                setValue("password",data.target.value)
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Repeat Password*/}
                            <Grid item xs={12} mt={4}>
                                <Controller
                                    name="repeatPassword"
                                    control={control}
                                    defaultValue=""
                                    disabled = {!pwdIsVisible}
                                    rules={{
                                        required: { value: pwdIsVisible, message: ValidationError.required},
                                        validate: (value) => value === getValues("password")  || 'Las contraseñas no coinciden'
                                    }}
                                    render={({field})=>(
                                        <StyledTextField
                                            label="Repetir contraseña"
                                            placeholder="Ingresar contraseña" 
                                            variant="standard" 
                                            type={showRepeatPassword ? 'text' : 'password'}
                                            fullWidth
                                            error={!!errors.repeatPassword}
                                            helperText={errors.repeatPassword?.message}
                                            disabled = {!pwdIsVisible}
                                            InputProps = {{
                                                style: {
                                                    color: colorTextWhite
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ marginRight: 2}}>
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowRepeatPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                        {showRepeatPassword ? <VisibilityOff sx={{color: colorTextWhite}} /> : <Visibility sx={{color: colorTextWhite}}/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                                
                                            }}
                                            InputLabelProps={{
                                                style: {
                                                    color: colorTextWhite
                                                },
                                            }}
                                            value={field.value}
                                            onChange={(data)=>{
                                                setValue("repeatPassword",data.target.value)
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Collapse>
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
                            onClick={handleSubmit(handleSaveButton)}
                        >
                            {!!!commercialAgentData || typeof commercialAgentData === null ? <>Guardar</> : <>Actualizar</>}
                        </StyledSuccessButton>
                    </Grid>
                    <Collapse in={loading}>
                        <Grid item xs={12}  >
                            <LinearProgress sx={{width: '100%'}}/>
                        </Grid>
                    </Collapse>
                </Grid>
            </Box>
            </ThemeProvider>
        </StyledDrawer>
    )
}

export default NewCommercialAgent;