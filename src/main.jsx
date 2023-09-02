import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {CookiesProvider} from "react-cookie";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            light: '#ff9f9f',
            main: '#c50000',
            dark: '#800000',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <CookiesProvider>
          <ThemeProvider theme={theme}>
              <App />
          </ThemeProvider>
      </CookiesProvider>
  </React.StrictMode>,
)
