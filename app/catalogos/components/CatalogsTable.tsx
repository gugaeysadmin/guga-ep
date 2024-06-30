'use client'
import React, {useState, useEffect} from "react";

import { 
    Box,
            Paper,
 } from "@mui/material";


import { clientTableColumns, commercialAgentsColums, referenceEquipmentColums } from "./TableColumnConfiguration";
import { getClientRows, getCommercialAgentsRows, getEquipmentRows } from "./TableRowConfiguration";
import { StyledTable } from "@/app/components/Table";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Block, Delete } from "@mui/icons-material";
import { redWarn } from "@/app/Styles/general";
import { useAppSelector } from "@/app/hooks/redux";

type CatalogsTableProps = {
    data: any[],
    source: string;
    handleEdit: (id, section) => void;
    handleRemove: (id, section) => void;
}

const CatalogsTable: React.FC<CatalogsTableProps> = ({ data, source, handleEdit, handleRemove}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openNewItem, setOpenNewItem] = useState(false);

    const user = useAppSelector((state)=> state.sliceUserReducer.logIn);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleTableCollumns = (columnDefinitions: any, section: string) => {

        if (user.isAdmin)
            return [
                {
                    field: "options",
                    type: "actions",
                    headerName: "Opciones",
                    width: 100,
                    cellClassName: "actions",
                    getActions: ({ id }) => {
                        return [
                            <GridActionsCellItem
                                key={1}
                                icon={<DeleteIcon sx={{color: redWarn}}/>}
                                label= {"Eliminar"}
                                color="primary"
                                onClick = {() => handleRemove(id,section)}
                            />,
                            <GridActionsCellItem
                                key={2}
                                icon={<EditNoteIcon/>}
                                label= {"Editar"}
                                color="primary"
                                onClick = {() => handleEdit(id,section)}
                            />,
                        ]
                    },

                },
                ...columnDefinitions
            ]
        else return [...columnDefinitions]
    }


    return(
        <>
            {source==="clients" && (
                <StyledTable
                    columns={handleTableCollumns(clientTableColumns, "clients")}
                    rows={getClientRows(data)}
                />
            )}
            {source === "commercialAgents" && (
                <StyledTable
                    columns={handleTableCollumns(commercialAgentsColums,"commercialAgents")}
                    rows={getCommercialAgentsRows(data)}
                />
            )}
            {source === "referenceEquipment" && (
                <StyledTable
                    columns={handleTableCollumns(referenceEquipmentColums,"referenceEquipment")}
                    rows={getEquipmentRows(data)}
                />
            )}
        </>
    )
}

export default CatalogsTable;