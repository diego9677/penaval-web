import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Link } from "react-router-dom";
import { Brand } from "../interfaces";
import { getApiBrands } from "../services";
import dayjs from "dayjs";


export const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getProviders(controller.signal);

  }, []);


  const getProviders = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getApiBrands(search, signal);
      setBrands(data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getProviders();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={5}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" color="primary" size="small" component={Link} to='/brands/form'>
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
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">Descripción</TableCell>
                    <TableCell align="center">Creado</TableCell>
                    <TableCell align="center">Actualizado</TableCell>
                    <TableCell align="center">Acion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brands.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center" component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{dayjs(row.createdAt).format('DD/MM/YYYY HH:MM')}</TableCell>
                      <TableCell align="center">{dayjs(row.updatedAt).format('DD/MM/YYYY HH:MM')}</TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="text" color="success" component={Link} to={`/brands/form?id=${row.id}`}>
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
