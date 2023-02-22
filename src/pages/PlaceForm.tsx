import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Container } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import { createApiPlace, deleteApiPlace, getApiPlace, updateApiPlace } from "../services";

interface StateData {
  name: string;
  description?: string;
}

export const PlaceForm = () => {
  const [data, setData] = useState<StateData>({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getApiPlace(Number(id))
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
      await updateApiPlace(Number(id), data);
      navigate('/places', { replace: true });
    } else {
      await createApiPlace(data);
      navigate('/places', { replace: true });
    }
  };

  const onDelete = async () => {
    await deleteApiPlace(Number(id));
    navigate('/places', { replace: true });
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
              <Button variant="outlined" color="inherit" size="small" component={Link} to="/places">
                <ArrowBackIcon />
              </Button>
            </Stack>

            <Typography variant="body1">{id ? 'Editar' : 'Nuevo'} Ubicación</Typography>

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
          title="Ubicaciones"
          open={openDialog}
          handleOpenDialog={handleOpenDialog}
          onConfirmDialog={onDelete}
          text={`¿Desea la ubicación con el id: ${id}?`}
          textConfirmButton="Si, Eliminar"
          textCacelButton="Cancelar"
        />
      }
    </Container>
  );
};
