import { Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

interface LoginSubmit {
  username: string;
  password: string;
}

export const Login = () => {
  const [data, setData] = useState<LoginSubmit>({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const { authState: { loading }, login } = useContext(AuthContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(data.username, data.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPwd = () => {
    setShow(!show);
  };

  if (loading) {
    return (
      <div>loading</div>
    );
  }

  return (
    <Stack style={{ height: '100vh' }} justifyContent="center" alignItems="center">
      <Paper style={{ width: '600px', padding: '20px 40px 20px 40px' }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <Typography variant="h5" textAlign="center">Login</Typography>
            <TextField type="text" name="username" variant="outlined" label="Usuario" size="small" onChange={handleChange} />
            <TextField type={show ? 'text' : 'password'} name="password" variant="outlined" label="Contraseña" size="small" onChange={handleChange} />
            <FormControlLabel
              control={<Checkbox color="success" size="small" onChange={toggleShowPwd} />}
              label={<Typography variant="body2">Mostrar Contraseña</Typography>}
            />
            <Button type="submit" variant="contained" size="small" color="primary" fullWidth>ingresar</Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};
