import { Box, Button, Stack, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Link } from "react-router-dom";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es-mx';

interface State {
  begin: Dayjs | null;
  end: Dayjs | null;
}

export const Shopping = () => {
  const [paramsReport, setParamsReport] = useState<State>({ begin: null, end: null });

  const handleChange = (value: Dayjs | null, name: string) => {
    setParamsReport((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { begin, end } = paramsReport;
    if (begin && end) {
      const beginDay = begin?.startOf('day').toISOString();
      const endDay = end?.endOf('day').toISOString();
      const params = { begin: beginDay, end: endDay };
      console.log(params);
    } else {
      alert('Rango de fechas no valido');
    }
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={5}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" color="primary" size="small" component={Link} to='/shopping/form'>
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
      </Stack>
    </Box>
  );
};
