import { useState, useEffect } from 'react';

import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { getApiProducts } from "../services";
import { Product } from "../interfaces";
import { DialogShoppingForm } from "../components/DialogShoppingForm";

export const ShoppingForm = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Product>();

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal);
  }, []);

  const selectProduct = (product: Product) => {
    setSelected(product);
    setOpenDialog(true);
  };

  const getProducts = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getApiProducts(search, signal);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const getQuantity = (quantity: string) => {
    console.log({ ...selected, quantity: Number(quantity) });
    setOpenDialog(false);
  };

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
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
          {!loading &&
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Rodamiento</TableCell>
                    <TableCell align="center">Catidad</TableCell>
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
                        <Chip sx={{ padding: '1px 2px 1px 2px' }} label={<Typography variant="body1">{row.stock}</Typography>} variant="outlined" color={row.stock > 0 ? 'success' : 'error'} />
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
          }
          {loading &&
            <div>loading</div>
          }

        </Paper>
        <Paper sx={{ padding: '20px', flex: 1 }}>
          Shopping Form
        </Paper>
      </Stack>
      <DialogShoppingForm title="Compras" text="Debe agregar la cantidad" open={openDialog} handleOpenDialog={toggleDialog} onConfirmDialog={getQuantity} />
    </Box>
  );
};
