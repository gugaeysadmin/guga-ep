import { DataGrid, DataGridProps, gridClasses } from "@mui/x-data-grid";
import { blueLight, colorTextBlack, colorTextWhite } from "../Styles/general";
import { StyledDataGrid } from "../Styles/styledComponents/StyledComponents";
import { paginationClasses } from "@mui/material";

type tableProps = {
    columns: any;
    rows: any;
    moreProps?: DataGridProps
}

export const StyledTable = (props: tableProps) => {
    return (
        <DataGrid
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
                [`& .${gridClasses.cell}:focus-within`]: {
                    outline: "none !important",
                },
                [`& .${gridClasses.columnHeader}`]: {
                    backgroundColor: blueLight,
                    color: colorTextWhite
                },
                [`& .${gridClasses.sortIcon}`]: {
                    backgroundColor: blueLight,
                    color: colorTextWhite
                },
                [`& .${gridClasses.menuIconButton}`]: {
                    backgroundColor: blueLight,
                    color: colorTextWhite
                },
            }}
            columns={props.columns}
            rows={props.rows}
            autoHeight
            pagination
            getRowHeight={() => 'auto'}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            {...props.moreProps}
        />
    )
} 