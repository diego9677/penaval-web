import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import React, { useEffect, useState } from "react";
import { Product, SaleCart } from "../interfaces";


interface Props {
  title: string;
  product: Product | undefined;
  open: boolean;
  handleOpenDialog: () => void;
  onConfirmDialog: (shoppingState: SaleCart) => void;
}

export const DialogSaleForm = ({ open, title, product, handleOpenDialog, onConfirmDialog }: Props) => {
  const [saleState, setSaleState] = useState<SaleCart>({ productId: 0, productCode: '', quantity: 0, salePrice: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = Number(value);
    if (val) {
      setSaleState((prev) => ({ ...prev, [name]: val }));
    }
  };

  useEffect(() => {
    if (product) {
      setSaleState((prev) => ({ ...prev, productId: product.id, productCode: product.code, salePrice: Number(product.price) }));
    }

    return () => {
      setSaleState({ productId: 0, productCode: '', quantity: 0, salePrice: 0 });
    };
  }, [product]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof saleState.quantity === 'string' || typeof saleState.salePrice === 'string') {
      alert('Formulario no valido');
      return;
    }

    onConfirmDialog(saleState);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          {product &&
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Stack direction="row" spacing={4} alignItems="center">
                  <Stack spacing={1}>
                    <Typography color="text.primary" variant="caption">
                      {product.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.measures}
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                      {product.brand.name}
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                      {product.place.name}
                    </Typography>
                  </Stack>

                  <Typography variant="body2">
                    {product.price} Bs
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          }

          <TextField
            autoFocus
            name="quantity"
            margin="dense"
            label="Cantidad"
            type="number"
            fullWidth
            variant="standard"
            value={saleState.quantity || ''}
            onChange={handleChange}
          />

          <TextField
            autoFocus
            name="salePrice"
            margin="dense"
            label="Precio de venta"
            type="number"
            fullWidth
            variant="standard"
            value={saleState.salePrice || ''}
            onChange={handleChange}
          />

        </DialogContent>
        <DialogActions style={{ padding: 20 }}>
          <Button type="button" variant="text" color="inherit" size="small" onClick={handleOpenDialog}>Cancelar</Button>
          <Button type="submit" variant="text" color="success" size="small">Confirmar</Button>
        </DialogActions>
      </form>
    </Dialog >
  );
};
