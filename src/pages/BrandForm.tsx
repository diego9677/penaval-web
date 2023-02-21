import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Container } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { Brand } from "../interfaces";
import AlertDialog from "../components/AlertDialog";

interface StateData {
  name: string;
  description?: string;
}

const getApiBrand = async (id: number) => {
  const response = await axiosInstance.get<Brand>(`/brands/${id}`);
  return response.data;
};

const createApiBrand = async (data: StateData) => {
  const response = await axiosInstance.post<Brand>('/brands', data);
  return response.data;
};

const updateApiBrand = async (id: number, data: StateData) => {
  const response = await axiosInstance.put<Brand>(`/brands/${id}`, data);
  return response.data;
};

const delteApiBrand = async (id: number) => {
  const response = await axiosInstance.delete<Brand>(`/brands/${id}`);
  return response.data;
};

export const BrandForm = () => {
  const [data, setData] = useState<StateData>({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getApiBrand(Number(id))
        .then((data) => {
          setData({ name: data.name, description: data.description });
        }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      await updateApiBrand(Number(id), data);
      navigate('/brands', { replace: true });
    } else {
      await createApiBrand(data);
      navigate('/brands', { replace: true });
    }
  };

  const onDelete = async () => {
    await delteApiBrand(Number(id));
    navigate('/brands', { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  if (loading) {
    return (
      <div>loading</div>
    );
  }

  return (
    <Container>
      <Paper style={{ padding: '20px 40px 20px 40px' }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>

            <Stack direction="row">
              <Button variant="outlined" color="inherit" size="small" component={Link} to="/brands">
                <ArrowBackIcon />
              </Button>
            </Stack>

            <Typography variant="body1">{id ? 'Editar' : 'Nuevo'} Marca de rodamiento</Typography>

            <TextField name="name" variant="outlined" label="Nombre" size="small" value={data.name} onChange={handleChange} />

            <TextField name="description" variant="outlined" label="Descripción" size="small" value={data.description} onChange={handleChange} />

            <Stack direction="row" spacing={2}>
              {id && <Button type="button" variant="outlined" size="small" color="error" fullWidth onClick={handleOpenDialog}>Eliminar</Button>}
              <Button type="submit" variant="outlined" size="small" color="primary" fullWidth>Guardar</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
      {id &&
        <AlertDialog
          title="Marca de rodamientos"
          open={openDialog}
          handleOpenDialog={handleOpenDialog}
          onConfirmDialog={onDelete}
          text={`¿Desea la marca con el id: ${id}?`}
          textConfirmButton="Si, Eliminar"
          textCacelButton="Cancelar"
        />
      }
    </Container>
  );
};
