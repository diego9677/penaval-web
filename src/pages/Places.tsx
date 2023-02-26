import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Link } from "react-router-dom";
import { Place } from "../interfaces";
import { getApiPlaces } from "../services";
import dayjs from 'dayjs';

export const Places = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getPlaces(controller.signal);

  }, []);


  const getPlaces = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getApiPlaces(search, signal);
      setPlaces(data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getPlaces();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={5}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" color="primary" size="small" component={Link} to='/places/form'>
            Nuevo
          </Button>
          <form onSubmit={onSubmit}>
            <Stack direction="row" spacing={2}>
              <TextField id="search" label="Buscar" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
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
                  {places.map((row) => (
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
                        <Button size="small" variant="text" color="success" component={Link} to={`/places/form?id=${row.id}`}>
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
