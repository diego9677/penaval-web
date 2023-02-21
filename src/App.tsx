import { ReactNode } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import RequireAuth from "./components/RequiredAuth";
import { AuthProvider } from "./context/AuthProvider";
import { MainLayout } from "./layout/MainLayout";
import { initAxiosInterceptors } from "./lib/axios";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { Providers } from "./pages/Providers";
import { Sales } from "./pages/Sales";
import { Shopping } from "./pages/Shopping";
import { ProviderForm } from "./pages/ProviderForm";
import { Brands } from "./pages/Brands";
import { Places } from "./pages/Places";
import { BrandForm } from "./pages/BrandForm";
import { PlaceForm } from "./pages/PlaceForm";
import { ProductForm } from "./pages/ProductForm";



initAxiosInterceptors();

interface Props {
  title: string;
  withLayout?: boolean;
  children?: ReactNode;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppState({ title, withLayout = false, children }: Props) {
  if (withLayout) {
    return (
      <AuthProvider>
        <RequireAuth>
          <MainLayout title={title}>
            {children}
          </MainLayout>
        </RequireAuth>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={
            <AppState title="Login">
              <Login />
            </AppState>
          }
        />

        {/* product section */}
        <Route
          path="/products"
          element={
            <AppState withLayout title="Productos">
              <Products />
            </AppState>
          }
        />

        <Route
          path="/products/form"
          element={
            <AppState withLayout title="Formulario de productos">
              <ProductForm />
            </AppState>
          }
        />

        <Route
          path="/sales"
          element={
            <AppState withLayout title="Ventas">
              <Sales />
            </AppState>
          }
        />

        <Route
          path="/shopping"
          element={
            <AppState withLayout title="Compras">
              <Shopping />
            </AppState>
          }
        />

        {/* places section */}
        <Route
          path="/places"
          element={
            <AppState withLayout title="Ubicaciones">
              <Places />
            </AppState>
          }
        />
        <Route
          path="/places/form"
          element={
            <AppState withLayout title="Formulario de ubicaciones">
              <PlaceForm />
            </AppState>
          }
        />

        {/* brands section */}
        <Route
          path="/brands"
          element={
            <AppState withLayout title="Marcas de rodamientos">
              <Brands />
            </AppState>
          }
        />
        <Route
          path="/brands/form"
          element={
            <AppState withLayout title="Formulario de marcas de rodamientos">
              <BrandForm />
            </AppState>
          }
        />

        {/* provider section */}
        <Route
          path="/providers"
          element={
            <AppState withLayout title="Proveedores">
              <Providers />
            </AppState>
          }
        />
        <Route
          path="/providers/form"
          element={
            <AppState withLayout title="Formulario de proveedores">
              <ProviderForm />
            </AppState>
          }
        />
        <Route path="/" element={<Navigate to="/products" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
