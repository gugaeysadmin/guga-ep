'use client' 
import React, {useState, useEffect} from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"


import {    Box,
            Button,
            Drawer,
            Typography,
            Grid,
            Divider,
            Autocomplete,
            TextField,
            ThemeProvider,
} from "@mui/material";

import makeStyles from "@mui/material";

import AutoModeIcon from '@mui/icons-material/AutoMode';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import {    StyledTextField,
            StyledDrawer,
            StyledButton,
            StyledCancelButton,
            StyledSuccessButton,
} from "@/app/Styles/styledComponents/StyledComponents";

import { colorText, colorTextWhite, darkTheme } from "@/app/Styles/general";
import { cotizationEquipment } from "@/app/entities/cotization";
import { useQuery } from "@tanstack/react-query";
import { getEquipments } from "@/app/services/catalogServices";
import { referenceEquipment } from "@/app/entities/domains";

type NewItemProps = {
    open: boolean;
    handleOpen: ()=>void;
    handleNewEquipment: (data: cotizationEquipment) => void;
    equipmentData?: cotizationEquipment;
};

const NewItem: React.FC<NewItemProps> = ({open = false, handleOpen, handleNewEquipment, equipmentData}) => {

    const {clearErrors,reset,formState: {errors}, setValue, getValues,watch, handleSubmit, control} =  useForm<cotizationEquipment>({mode: "all"});
    const [isNew, setIsNew] = useState(true);

    const [references, setReferemces] = useState<string[]>([""]);
    const [codes, setCodes] = useState<referenceEquipment[]>([]);

    const referenceEquipments = useQuery({queryKey:["getReferenceEquipments"], queryFn: getEquipments, refetchOnWindowFocus: false});
    useEffect(()=>{
        const amount = getValues("amount");
        const unitPrice = getValues("unitPrice");

        if(!!amount){
            if(!!unitPrice){
                setValue("totalPrice",amount*unitPrice)
            }else{
                setValue("totalPrice",0)
            }
        } else {
            setValue("totalPrice",0)
        }

    },[
        watch("amount"),
        watch("unitPrice"),
    ])

    useEffect(()=> {
        if(referenceEquipments.isSuccess){
            let refSet = new Set(references);

            referenceEquipments.data.map((item: referenceEquipment) => {
                refSet.add(item.name)
            })
            setReferemces(Array.from(refSet));

            if(!!equipmentData &&typeof equipmentData !== null)
                handleEquipment(equipmentData.reference);
        }
    },[referenceEquipments.isSuccess])

    useEffect(()=>{
        if(open){
            clearErrors()
            if(!!equipmentData && typeof equipmentData !== null){
                reset(equipmentData);
                handleEquipment(equipmentData.reference);
                setIsNew(false);
            }
            else {
                setValue("amount",0); 
                setValue("description","");
                setValue("id",0);
                setValue("item","");
                setValue("reference","");
                setValue("totalPrice",0);
                setValue("unit","");
                setValue("code","");
                setValue("unitPrice",0);
                setIsNew(true);
            } 
        }
    }, [open, equipmentData])


    const handleEquipment = (ref: string) => {
        let refData = referenceEquipments.data.filter((item: referenceEquipment) => item.name.toLowerCase() === ref.toLowerCase());
        setCodes(refData);
        if(refData.length <= 1 && refData.length > 0){
            if(!!refData[0].description){
                setValue("description", refData[0].description);
            }
            if(!!refData[0].price){
                setValue("unitPrice", refData[0].price);
            }
        }
    }
    const handleCancelButton = () => {
        handleOpen()
    }

    const onSubmit = (data: cotizationEquipment) => {
        handleNewEquipment(data);
        handleOpen();
        reset();
    }
    return(
        <StyledDrawer
            open={open}
            anchor="right"
        >
            <ThemeProvider theme={darkTheme}>
                <Box sx={{p:2}}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" height={70}>
                        <Typography variant="h4" color={colorTextWhite}>
                            {isNew ? "NUEVO ITEM" : "EDITAR ITEM"}
                        </Typography>
                    </Box>
                    <Divider color="#7a8494"/>
                    {/* Form */}
                    <Grid container sx={{mt: 2}} spacing={3}>
                        {/* Query */}
                        {/* <Grid item xs={12}>
                            <StyledTextField
                                label="Cadena de datos"
                                placeholder="Ingresar cadena de datos" 
                                variant="outlined" 
                                multiline
                                rows={4}
                                fullWidth
                                InputLabelProps={{
                                    style: {
                                        color: colorText
                                    }
                                }}
                            />
                        </Grid>  */}
                        {/* Button query*/}
                        {/* <Grid container display="flex" justifyContent="end">
                            <Grid item  xs={4} sx={{mt: 1.5}} >
                                <StyledButton 
                                    variant="contained" 
                                    onClick={handleSaveButton}
                                    startIcon = {<AutoModeIcon/>}
                                >
                                        Procesar
                                </StyledButton>
                            </Grid>
                        </Grid> */}
                        {/* Item */}
                        {/* <Grid item xs={12}>
                            <Controller
                                name="item"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: "Campo requerido"
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        error = {!!errors?.item}
                                        helperText = {errors?.item?.message || ""}
                                        label="Item"
                                        placeholder="Ingresar número de partida" 
                                        variant="standard" 
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("item",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid> */}
                        {/* Referencia */}
                        <Grid item xs={12}>

                            <Controller
                                control={control}
                                name="reference"
                                defaultValue=""
                                rules={{required: "Campo requerido"}}
                                render={({field: {value}})=>(
                                    <Autocomplete
                                        options={references}
                                        getOptionLabel={(option: string) => `${option}`}
                                        inputValue={value}
                                        sx={{
                                            '& .MuiAutocomplete-clearIndicator': {
                                                color: colorTextWhite,
                                            },
                                            '& .MuiAutocomplete-popupIndicator': {
                                                color: colorTextWhite,
                                            }
                                        }}      
                                        onInputChange={(event, item)=>{
                                            setValue("reference", item);
                                            handleEquipment(item);
                                        }}
                                        // onChange={(event, item) => {
                                        //     if(!!item){
                                        //         setValue("description", item.description);
                                        //         setValue("unitPrice", item.price);
                                        //     }
                                        // }}
                                        clearOnEscape = {false}
                                        clearOnBlur = {false}
                                        renderInput={(props)=>(
                                            <StyledTextField
                                                {...props}
                                                error = {!!errors?.reference}
                                                helperText = {errors?.reference?.message || ""}
                                                label="Referencia"
                                                placeholder="Ingresar referencia" 
                                                variant="standard" 
                                                fullWidth
                                                required
                                                InputLabelProps={{
                                                    style: {
                                                        color: colorTextWhite
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Código */}
                        <Grid item xs={12}>
                            <Controller
                                control={control}
                                name="code"
                                defaultValue=""
                                rules={{required: false}}
                                render={({field: {value}})=>(
                                <Autocomplete
                                    options={!!codes? codes : []}
                                    getOptionLabel={(option: referenceEquipment) => `${option?.codeNumber}`}
                                    inputValue={value}
                                    sx={{
                                        '& .MuiAutocomplete-clearIndicator': {
                                            color: colorTextWhite,
                                        },
                                        '& .MuiAutocomplete-popupIndicator': {
                                            color: colorTextWhite,
                                        }
                                    }}
                                    onInputChange={(event, item)=>{
                                        setValue("code", item);
                                    }}
                                    onChange={(event, item) => {
                                        if(!!item){
                                            if(!!item.description){
                                                setValue("description", item.description);
                                            }
                                            if(!!item.price){
                                                setValue("unitPrice", item.price);
                                            }
                                        }
                                    }}
                                    clearOnEscape = {false}
                                    disabled = {codes.length <= 1 && codes.length > 0}
                                    clearOnBlur = {false}
                                    renderInput={(props)=>(
                                        <StyledTextField
                                            {...props}
                                            error = {!!errors?.reference}
                                            helperText = {errors?.reference?.message || ""}
                                            label="Código"
                                            placeholder="Ingresar codigo" 
                                            variant="standard" 
                                            fullWidth
                                            disabled = {codes.length <= 1 && codes.length > 0}
                                            InputLabelProps={{
                                                style: {
                                                    color: colorTextWhite
                                                },
                                            }}
                                        />
                                    )}
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
                                rules={{
                                    required: false
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        defaultValue={""}
                                        error = {!!errors?.description}
                                        helperText = {errors?.description?.message || ""}
                                        label="Descripción"
                                        placeholder="Ingresar descripción" 
                                        variant="standard" 
                                        multiline
                                        rows={4}
                                        fullWidth
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

                        {/* Cantidad */}
                        <Grid item xs={6}>
                            <Controller
                                name="amount"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: "Campo requerido"
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        error = {!!errors?.amount}
                                        helperText = {errors?.amount?.message || ""}
                                        label="Cantidad"
                                        placeholder="Ingresar cantidad" 
                                        variant="standard"
                                        type="number"
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        inputProps={{step: 1, min: 0}}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("amount",parseInt(data.target.value))
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Unidad */}
                        <Grid item xs={6}>
                            <Controller
                                name="unit"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: false
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        error = {!!errors?.unit}
                                        helperText ={errors?.unit?.message || ""}
                                        label="Unidad"
                                        placeholder="Ingresar Unidad" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("unit",data.target.value)
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Precio unitario */}
                        <Grid item xs={12}>
                            <Controller
                                name="unitPrice"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        error = {!!errors?.unitPrice}
                                        helperText = {errors?.unitPrice?.message || ""}
                                        type="number"
                                        label="Precio unitario"
                                        defaultValue={0}
                                        placeholder="Ingresar el precio" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            },
                                            shrink: true,
                                        }}
                                        inputProps={{step: 1, min: 0}}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("unitPrice",parseFloat(data.target.value))
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* precio total */}
                        <Grid item xs={12}>
                            <Controller
                                name="totalPrice"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: "Campo requerido"
                                }}
                                render={({field})=>(
                                    <StyledTextField
                                        error = {!!errors?.totalPrice}
                                        helperText = {errors?.totalPrice?.message || ""}
                                        required
                                        type="number"
                                        defaultValue={0}
                                        label="Precio total"
                                        placeholder="Ingresar el precio" 
                                        variant="standard" 
                                        fullWidth
                                        InputLabelProps={{
                                            style: {
                                                color: colorTextWhite
                                            }
                                        }}
                                        inputProps={{step: 1, min: 0}}
                                        value={field.value}
                                        onChange={(data)=>{
                                            setValue("totalPrice",parseFloat(data.target.value))
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
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
                                onClick={handleSubmit(onSubmit)}
                            >
                                    {!!!equipmentData || typeof equipmentData === null ? <>Guardar</> : <>Actualizar</>}
                            </StyledSuccessButton>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </StyledDrawer>
    );
};

export default NewItem;