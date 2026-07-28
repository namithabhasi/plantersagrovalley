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
      main: "#06331F", // --primary-color (Dark Green)
      light: "#EBF3EC", // --secondary-color (Light Green)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#EBF3EC",
      contrastText: "#06331F",
    },
    success: {
      main: "#2E7D32", // --third-color (Green requested for highlights)
      contrastText: "#ffffff",
    },
    error: {
      main: "#dd3e21", // --accent-color (Red/Orange)
      contrastText: "#ffffff",
    },
    text: {
      primary: "#212326", // --text-main
      secondary: "#2D2D2D", // --text-muted
    },
  },
  typography: {
    fontFamily: "'Assistant', 'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
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