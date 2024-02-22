import { ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";
import theme from "./utils/theme";

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
}
