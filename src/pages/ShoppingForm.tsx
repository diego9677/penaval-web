import { useState, useEffect } from 'react';

import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TableFooter, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

import { createApiShopping, getApiProducts, getApiProviders, getShopping, setShopping } from "../services";
import { Product, Provider, ShoppingCart } from "../interfaces";
import { DialogShoppingForm } from "../components/DialogShoppingForm";

export const ShoppingForm = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Product>();
  const [shoppingCartState, setShoppingCartState] = useState<ShoppingCart[]>(getShopping());
  const [selectedProvider, setSelectedProvider] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([getProducts(controller.signal), getProviders(controller.signal)])
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setShopping(shoppingCartState);
  }, [shoppingCartState]);

  const selectProduct = (product: Product) => {
    setSelected(product);
    setOpenDialog(true);
  };

  const getProducts = async (signal?: AbortSignal) => {
    // setLoading(true);
    const data = await getApiProducts(search, signal);
    setProducts(data);
  };

  const getProviders = async (signal?: AbortSignal) => {
    // setLoading(true)
    const data = await getApiProviders(search, signal);
    setProviders(data);
  };

  const getShoppingData = (shopping: ShoppingCart) => {

    setShoppingCartState((prev) => {
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
    const newProducts = shoppingCartState.filter(p => p.productCode !== productCode);
    setShoppingCartState(newProducts);
  };

  const setTotal = () => {
    const total = shoppingCartState.reduce((acc, el) => acc + (el.quantity * el.pucharsePrice), 0);
    return total;
  };

  const onClean = () => {
    setSelectedProvider(0);
    setShoppingCartState([]);
  };

  const saveShooping = async () => {
    if (shoppingCartState.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    if (!selectedProvider) {
      alert('Debe seleccionar un proveedor');
      return;
    }

    setLoading(true);
    const data = { providerId: selectedProvider, products: shoppingCartState };
    await createApiShopping(data);
    await getProducts();
    onClean();
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getProducts();
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={3}>
        <Paper sx={{ padding: '20px', flex: 1 }} component={Stack} spacing={2}>

          <Stack direction="row" justifyContent="space-between" alignItems="self-start">
            <Typography variant="subtitle1">Lista de productos</Typography>

            <form onSubmit={onSubmit}>
              <Stack direction="row" spacing={1}>
                <TextField id="search" label="Buscar" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
                <Button type="button" variant="outlined" color="success" size="small" onClick={() => getProducts()}>
                  <SearchOutlinedIcon />
                </Button>
              </Stack>
            </form>
          </Stack>


          {!loading &&
            <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
              <TableContainer sx={{ maxHeight: '70vh' }}>
                <Table stickyHeader aria-label="simple table">
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
                          <Button size="small" variant="text" color="success" onClick={() => selectProduct(row)}>
                            <ArrowForwardIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          }

          {loading && 'loading'}
        </Paper>

        <Paper sx={{ padding: '20px', flex: 1, overflow: 'hidden' }}>

          <Stack spacing={2}>

            <Typography variant="subtitle1">Carrito de compras</Typography>

            {providers &&
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedProvider || ''}
                  label="Proveedor"
                  onChange={(e) => setSelectedProvider(Number(e.target.value))}
                >
                  {providers.map((p) => (<MenuItem key={`${p.id}-${p.name}`} value={p.id}>{p.name}</MenuItem>))}
                </Select>
              </FormControl>
            }

            <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
              <TableContainer sx={{ maxHeight: '47vh' }}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Codigo</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="center">P. Compra</TableCell>
                      <TableCell align="center">P. Venta</TableCell>
                      <TableCell align="center">Subtotal</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shoppingCartState.map((row, index) => (
                      <TableRow
                        key={`${index}-${row.productCode}`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">{row.productCode}</TableCell>
                        <TableCell align="center">{row.quantity}</TableCell>
                        <TableCell align="center">{row.pucharsePrice} Bs</TableCell>
                        <TableCell align="center">{row.salePrice} Bs</TableCell>
                        <TableCell align="center">{Math.round((row.quantity * row.pucharsePrice) * 10) / 10} Bs</TableCell>
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
              <Button type="button" variant="outlined" size="small" color="success" fullWidth onClick={saveShooping}>guardar</Button>
            </Stack>
          </Stack>

        </Paper>
      </Stack>
      <DialogShoppingForm title="Compras" product={selected} open={openDialog} handleOpenDialog={toggleDialog} onConfirmDialog={getShoppingData} />
    </Box>
  );
};
