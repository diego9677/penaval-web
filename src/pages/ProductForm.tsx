import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Container } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import { createApiProduct, delteApiProduct, getApiBrands, getApiPlaces, getApiProduct, updateApiProduct } from "../services";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Brand, Place } from "../interfaces";

interface StateData {
  code: string;
  measures: string;
  price: number;
  placeId: number | '';
  brandId: number | '';
}

export const ProductForm = () => {
  const [data, setData] = useState<StateData>({ code: '', measures: '', price: 0, brandId: '', placeId: '' });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [brands, setBrands] = useState<Brand[]>();
  const [places, setPlaces] = useState<Place[]>();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (id) {
      Promise.all([getApiProduct(Number(id), controller.signal), getApiBrands('', controller.signal), getApiPlaces('', controller.signal)])
        .then(([product, brands, places]) => {
          const { code, measures, price, place: { id: placeId }, brand: { id: brandId } } = product;
          setData({
            code,
            measures,
            price: Number(price),
            brandId,
            placeId
          });
          setBrands(brands);
          setPlaces(places);
        }).finally(() => setLoading(false));
    } else {
      Promise.all([getApiBrands('', controller.signal), getApiPlaces('', controller.signal)])
        .then(([brands, places]) => {
          setBrands(brands);
          setPlaces(places);
        })
        .finally(() => setLoading(false));
    }

    return () => {
      controller.abort();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
    if (id) {
      await updateApiProduct(Number(id), data);
      navigate('/products', { replace: true });
    } else {
      await createApiProduct(data);
      navigate('/products', { replace: true });
    }
  };

  const onDelete = async () => {
    await delteApiProduct(Number(id));
    navigate('/products', { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let val: string | number = value;
    if (name === 'price') val = Number(value);
    setData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
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
              <Button variant="outlined" color="inherit" size="small" component={Link} to="/products">
                <ArrowBackIcon />
              </Button>
            </Stack>

            <Typography variant="body1">{id ? 'Editar' : 'Nuevo'} Producto</Typography>

            <TextField type="text" name="code" variant="outlined" label="Nombre" size="small" value={data.code} onChange={handleChange} />

            <TextField type="text" name="measures" variant="outlined" label="Descripción" size="small" value={data.measures} onChange={handleChange} />

            <TextField
              type="number"
              name="price"
              variant="outlined"
              label="Precio"
              size="small"
              value={data.price} onChange={handleChange}
              inputProps={{
                maxLength: 13,
                step: "0.01"
              }}
            />

            {brands &&
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Marca</InputLabel>
                <Select
                  size="small"
                  name="brandId"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={data.brandId}
                  label="Marca"
                  onChange={handleSelectChange}
                >
                  {brands.map((b) => (<MenuItem key={`${b.id}-${b.name}`} value={b.id}>{b.name}</MenuItem>))}
                </Select>
              </FormControl>
            }

            {places &&
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Ubicación</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  name="placeId"
                  id="demo-simple-select"
                  value={data.placeId}
                  label="Ubicación"
                  onChange={handleSelectChange}
                >
                  {places.map((b) => (<MenuItem key={`${b.id}-${b.name}`} value={b.id}>{b.name}</MenuItem>))}
                </Select>
              </FormControl>
            }

            <Stack direction="row" spacing={2}>
              {id && <Button type="button" variant="outlined" size="small" color="error" fullWidth onClick={handleOpenDialog}>Eliminar</Button>}
              <Button type="submit" variant="outlined" size="small" color="primary" fullWidth>Guardar</Button>
            </Stack>

          </Stack>
        </form>
      </Paper>
      {id &&
        <AlertDialog
          title="Productos"
          open={openDialog}
          handleOpenDialog={handleOpenDialog}
          onConfirmDialog={onDelete}
          text={`¿Desea eliminar el poroducto con el id: ${id}?`}
          textConfirmButton="Si, Eliminar"
          textCacelButton="Cancelar"
        />
      }
    </Container>
  );
};
