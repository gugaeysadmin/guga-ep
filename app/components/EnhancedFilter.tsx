import { Search } from "../Styles/styledComponents/StyledComponents";
import React, {useState, useEffect, ChangeEvent} from "react";
import { SearchIconWrapper, StyledInputBase } from "../Styles/styledComponents/StyledComponents";

import SearchIcon from '@mui/icons-material/Search';

type FiltersProps = {
    data: any[];
    setDataFilter: (filteredData: any[]) => void;
}




const EnhancedFilter: React.FC<FiltersProps> = ({data, setDataFilter })=> {
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
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Buscar.."
                value={filter}
                onChange={handleFilterChange}
                inputProps={{ 'aria-label': 'search' }}
            />
        </Search>
    )
}

export default EnhancedFilter;