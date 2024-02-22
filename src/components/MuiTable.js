import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTable: {
        styleOverrides: {
          root: {
            width: "100%",
            boxShadow: "none !important",
            borderRadius: 0,
          },
        },
      },
    },
  });

const MuiTable = ({ options, ...props }) => {
  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        options={{
          filter: true,
          filterType: "dropdown",
          // responsive: "",
          // resizableColumns: true,
          responsive: "standard",
          fixedHeader: true,
          fixedSelectColumn: false,
          tableBodyHeight: "100vh",
          rowsPerPageOptions: [5, 10, 20, 50, 100],
          draggableColumns: {
            enabled: false,
          },
          selectableRows: "none",
          ...options,
        }}
        {...props}
      />
    </ThemeProvider>
  );
};

export default MuiTable;
