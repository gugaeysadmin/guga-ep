import React, { useEffect, useState, ChangeEvent } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


interface FiltersProps {
  data: any[];
  setDataFilter: (filteredData: any[]) => void;
  styled?: boolean;
}

const Filters: React.FC<FiltersProps> = ({ data, setDataFilter, styled = false }) => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      const filteredData = data.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(filter.toLowerCase()))
      );
      setDataFilter(filteredData);
    }
  }, [data, filter, setDataFilter]);

  return (
    <>
      {styled?(<>
        <TextField
          placeholder="Buscar"
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </>): (<>
      <Box 
        sx={{
          display: "flex",
          alignContent: "center",
        }}
      
      >
        <TextField
          label="Buscar"
          variant="standard"
          value={filter}
          size="small"
          placeholder="Ingresar"
          onChange={handleFilterChange}
        />
      </Box>
      
      </>)}
    </>
  );
};

export default Filters;
