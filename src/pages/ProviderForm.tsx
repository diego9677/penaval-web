import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Container } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import { createApiProvide, deleteApiProvider, getApiProvider, updateApiProvider } from "../services";

interface StateData {
  name: string;
  address: string;
}

export const ProviderForm = () => {
  const [data, setData] = useState<StateData>({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getApiProvider(Number(id))
        .then((data) => {
          setData({ name: data.name, address: data.address });
        }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      await updateApiProvider(Number(id), data);
      navigate('/providers', { replace: true });
    } else {
      await createApiProvide(data);
      navigate('/providers', { replace: true });
    }
  };

  const onDelete = async () => {
    await deleteApiProvider(Number(id));
    navigate('/providers', { replace: true });
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
              <Button variant="outlined" color="inherit" size="small" component={Link} to="/providers">
                <ArrowBackIcon />
              </Button>
            </Stack>

            <Typography variant="body1">{id ? 'Editar' : 'Nuevo'} Proveedor</Typography>

            <TextField name="name" variant="outlined" label="Nombre" size="small" value={data.name} onChange={handleChange} />

            <TextField name="address" variant="outlined" label="Descripción" size="small" value={data.address} onChange={handleChange} />

            <Stack direction="row" spacing={2}>
              {id && <Button type="button" variant="outlined" size="small" color="error" fullWidth onClick={handleOpenDialog}>Eliminar</Button>}
              <Button type="submit" variant="outlined" size="small" color="primary" fullWidth>Guardar</Button>
            </Stack>

          </Stack>
        </form>
      </Paper>
      {id &&
        <AlertDialog
          title="Proveedores"
          open={openDialog}
          handleOpenDialog={handleOpenDialog}
          onConfirmDialog={onDelete}
          text={`¿Desea eliminar el proveedor con el id: ${id}?`}
          textConfirmButton="Si, Eliminar"
          textCacelButton="Cancelar"
        />
      }
    </Container>
  );
};
