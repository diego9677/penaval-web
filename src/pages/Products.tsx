import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Typography } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Product } from "../interfaces";
import { getApiProducts } from "../services";
import { Link } from "react-router-dom";




export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal);

  }, []);


  const getProducts = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getApiProducts(search, signal);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getProducts();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={5}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" color="primary" size="small" component={Link} to='/products/form'>
            Nuevo
          </Button>
          <form onSubmit={onSubmit}>
            <Stack direction="row" spacing={2}>
              <TextField type="text" id="search" label="Buscar" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
              <Button type="submit" variant="outlined" color="success" size="small">
                <SearchOutlinedIcon />
              </Button>
            </Stack>
          </form>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {!loading &&
            <TableContainer sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">#</TableCell>
                    <TableCell align="center">Marca</TableCell>
                    <TableCell align="center">C??digo</TableCell>
                    <TableCell align="center">Medidas</TableCell>
                    <TableCell align="center">Ubicaci??n</TableCell>
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
                      <TableCell align="center" component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{row.brand.name}</TableCell>
                      <TableCell align="center">{row.code}</TableCell>
                      <TableCell align="center">{row.measures}</TableCell>
                      <TableCell align="center">{row.place.name}</TableCell>
                      <TableCell align="center">
                        <Chip sx={{ padding: '1px 2px 1px 2px' }} label={<Typography variant="body2">{row.stock}</Typography>} variant="outlined" color={row.stock > 0 ? 'success' : 'error'} />
                      </TableCell>
                      <TableCell align="center">{row.price} Bs</TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="text" color="success" component={Link} to={`/products/form?id=${row.id}`}>
                          <ModeEditOutlineOutlinedIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
          {loading && 'loading'}
        </Paper>

      </Stack>
    </Box>
  );
};
