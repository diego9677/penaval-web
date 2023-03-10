import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { Link } from "react-router-dom";
import 'dayjs/locale/es-mx';

import { Box, Button, Stack, TextField, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Collapse, Typography, IconButton } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { getApiSales } from "../services";
import { ParamsReport, Sale } from "../interfaces";

const Row = ({ row }: { row: Sale; }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {row.client.nit}
        </TableCell>
        <TableCell align="center">{row.client.person.firstName} {row.client.person.lastName}</TableCell>
        <TableCell align="center">{dayjs(row.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
        <TableCell align="center">{row.saleDetail.length}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de venta
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">P. de venta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.saleDetail.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.product.code}
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="right">{row.salePrice} Bs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const Sales = () => {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [paramsReport, setParamsReport] = useState<ParamsReport>({ begin: null, end: null });

  const getSales = async (params: { begin: string; end: string; }) => {
    setLoading(true);
    try {
      const data = await getApiSales(params);
      setSales(data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: Dayjs | null, name: string) => {
    setParamsReport((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { begin, end } = paramsReport;
    if (begin && end) {
      const beginDay = begin?.startOf('day').toISOString();
      const endDay = end?.endOf('day').toISOString();
      const params = { begin: beginDay, end: endDay };
      await getSales(params);
    } else {
      alert('Rango de fechas no valido');
    }
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={5}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" color="primary" size="small" component={Link} to='/sales/form'>
            Nuevo
          </Button>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es-mx'}>
            <form onSubmit={onSubmit}>
              <Stack direction="row" spacing={2}>
                <DesktopDatePicker
                  label="Inicio"
                  inputFormat="DD/MM/YYYY"
                  value={paramsReport.begin}
                  onChange={(value) => handleChange(value, 'begin')}
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
                <DesktopDatePicker
                  label="Fin"
                  inputFormat="DD/MM/YYYY"
                  value={paramsReport.end}
                  onChange={(value) => handleChange(value, 'end')}
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
                <Button type="submit" variant="outlined" color="success" size="small">
                  <SearchOutlinedIcon />
                </Button>
              </Stack>
            </form>
          </LocalizationProvider>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {!loading &&
            <TableContainer sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">nit</TableCell>
                    <TableCell align="center">Cliente</TableCell>
                    <TableCell align="center">Creado</TableCell>
                    <TableCell align="center">Productos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((row) => <Row key={row.id} row={row} />)}
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
