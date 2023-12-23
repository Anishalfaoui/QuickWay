import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import { useState, useEffect} from "react";
const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "Agence",
      headerName: "Client",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    
    {
      field: "Numtel",
      headerName: "Numtel",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
   
   
    {
      field: "gender",
      headerName: "sexe",
      flex: 1,
    },
  ];
  useEffect(() => {
    const getAgencies = async () => {
      try {
        const response = await axios.get("/allusers");
        const agencies = response.data;
        const agencyRows = agencies.map((agency, index) => ({
          id: index + 1,
          Agence: agency.nom + ' ' + agency.prenom,
          email: agency.email,
          
          gender: agency.gender,
          Numtel : agency.phone
        }));
        setRows(agencyRows);
      } catch (err) {
        console.log(err);
      }
    };
    getAgencies();
  }, []);
  const [rows, setRows] = useState([]);
  return (
    <Box m="20px">
      <Header title="Clients" subtitle="voicie tout les clients" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Invoices;
