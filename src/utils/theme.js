import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: grey[50],
    },
  },
  shadows: Array(25).fill("none"),
});

export default theme;
