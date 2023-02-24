import React, { useState, useEffect } from 'react';

import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableFooter } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

import { createApiSale, getApiProducts, getClientByNit, getSale, setSale } from "../services";
import { Product, SaleCart } from "../interfaces";
import { DialogSaleForm } from "../components/DialogSaleForm";

interface SaleState {
  nit: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const SaleForm = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Product>();
  const [saleCartState, setSaleCartState] = useState<SaleCart[]>(getSale());
  const [saleState, setSaleState] = useState<SaleState>({ nit: '', firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setSale(saleCartState);
  }, [saleCartState]);

  const selectProduct = (product: Product) => {
    setSelected(product);
    setOpenDialog(true);
  };

  const getProducts = async (signal?: AbortSignal) => {
    try {
      const data = await getApiProducts(search, signal);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const getShoppingData = (shopping: SaleCart) => {

    setSaleCartState((prev) => {
      const index = prev.findIndex(p => p.productCode === shopping.productCode);
      if (prev[index]) {
        prev[index] = shopping;
        return prev;
      } else {
        return [...prev, shopping];
      }
    });

    setOpenDialog(false);
  };

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const removeItem = (productCode: string) => {
    const newProducts = saleCartState.filter(p => p.productCode !== productCode);
    setSaleCartState(newProducts);
  };

  const setTotal = () => {
    const total = saleCartState.reduce((acc, el) => acc + (el.quantity * el.salePrice), 0);
    return total;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaleState(prev => ({ ...prev, [name]: value }));
  };

  const onClean = () => {
    setSaleState({ nit: '', firstName: '', lastName: '', phone: '' });
    setSaleCartState([]);
  };

  const saveSale = async () => {
    if (saleCartState.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    setLoading(true);
    const data = { ...saleState, products: saleCartState };
    await createApiSale(data);
    await getProducts();
    onClean();
    setLoading(false);
  };

  const findClient = async () => {
    const data = await getClientByNit(saleState.nit);
    if (data) {
      setSaleState({ nit: data.nit, firstName: data.person.firstName, lastName: data.person.lastName, phone: data.person.phone });
    }
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={3}>
        <Paper sx={{ padding: '20px', flex: 1 }} component={Stack} spacing={2}>

          <Stack direction="row" justifyContent="space-between" alignItems="self-start">
            <Typography variant="subtitle1">Lista de productos</Typography>

            <Stack direction="row" spacing={1}>
              <TextField id="search" label="Buscar" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
              <Button type="button" variant="outlined" color="success" size="small" onClick={() => getProducts()}>
                <SearchOutlinedIcon />
              </Button>
            </Stack>
          </Stack>

          <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
            {!loading &&
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Rodamiento</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="center">Precio</TableCell>
                      <TableCell align="center">Acion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.primary">{row.brand.name}</Typography>
                            <Typography variant="body2" color="text.primary">{row.code}</Typography>
                            <Typography variant="body2" color="text.secondary" fontSize={14} fontWeight="Semi Bold">{row.measures}</Typography>
                            <Typography variant="caption" color="text.success">{row.place.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip sx={{ padding: '1px 2px 1px 2px' }} label={<Typography variant="body2">{row.stock}</Typography>} variant="outlined" color={row.stock > 0 ? 'success' : 'error'} />
                        </TableCell>
                        <TableCell align="center">{row.price} Bs</TableCell>
                        <TableCell align="center">
                          {row.stock > 0 &&
                            <Button size="small" variant="text" color="success" onClick={() => selectProduct(row)}>
                              <ArrowForwardIcon />
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            }

            {loading && <div>loading</div>}

          </Paper>

        </Paper>

        <Paper sx={{ padding: '20px', flex: 1, overflow: 'hidden' }}>
          <Stack spacing={2}>

            <Typography variant="subtitle1">Carrito de ventas</Typography>

            <Stack direction="row" spacing={2}>

              <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                <TextField
                  autoFocus
                  name="nit"
                  label="Nit"
                  type="text"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={saleState.nit}
                  onChange={handleChange}
                />

                <Button type="button" variant="outlined" color="success" size="small" onClick={findClient}>
                  <SearchOutlinedIcon />
                </Button>
              </Stack>

              <TextField
                name="firstName"
                label="Nombres"
                type="text"
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
                value={saleState.firstName}
                onChange={handleChange}
              />
            </Stack>


            <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
              <TextField
                autoFocus
                name="phone"
                label="Telefono"
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                value={saleState.phone}
                onChange={handleChange}
              />

              <TextField
                autoFocus
                name="lastName"
                label="Apellidos"
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                value={saleState.lastName}
                onChange={handleChange}
              />
            </Stack>

            <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
              <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Codigo</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="center">P. Venta</TableCell>
                      <TableCell align="center">Subtotal</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleCartState.map((row, index) => (
                      <TableRow
                        key={`${index}-${row.productCode}`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">{row.productCode}</TableCell>
                        <TableCell align="center">{row.quantity}</TableCell>
                        <TableCell align="center">{row.salePrice} Bs</TableCell>
                        <TableCell align="center">{Math.round((row.quantity * row.salePrice) * 10) / 10} Bs</TableCell>
                        <TableCell align="center">
                          <Button type="button" size="small" variant="text" color="error" onClick={() => removeItem(row.productCode)}>
                            <CloseIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell variant="head" align="left">Total:</TableCell>
                      <TableCell colSpan={3} />
                      <TableCell variant="head" align="center">{setTotal()} Bs</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Paper>

            <Stack direction="row" spacing={2}>
              <Button type="button" variant="outlined" size="small" color="error" fullWidth onClick={onClean}>limpiar</Button>
              <Button type="button" variant="outlined" size="small" color="success" fullWidth onClick={saveSale}>guardar</Button>
            </Stack>


          </Stack>

        </Paper>
      </Stack>
      <DialogSaleForm title="Compras" product={selected} open={openDialog} handleOpenDialog={toggleDialog} onConfirmDialog={getShoppingData} />
    </Box>
  );
};
