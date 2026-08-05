import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import App from "./App";
import store from "./store/store";

import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#06492D", // --color-primary-dark
      light: "#e8f5e9", // --color-primary-subtle
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e8f5e9", // --color-primary-subtle
      contrastText: "#06492D", // --color-primary-dark
    },
    success: {
      main: "#1b7a42", // --color-primary
      contrastText: "#ffffff",
    },
    error: {
      main: "#e74c3c", // --color-danger
      contrastText: "#ffffff",
    },
    text: {
      primary: "#2c3e50", // --color-text-main
      secondary: "#6c757d", // --color-text-muted
    },
  },
  typography: {
    fontFamily: "'Assistant', 'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: "var(--color-primary)",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);