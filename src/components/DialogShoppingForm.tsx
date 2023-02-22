import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import { useState } from "react";

interface Props {
  title: string;
  text: string;
  open: boolean;
  handleOpenDialog: () => void;
  onConfirmDialog: (quantity: string) => void;
}

export const DialogShoppingForm = ({ open, title, text, handleOpenDialog, onConfirmDialog }: Props) => {
  const [quantity, setQuantity] = useState('');

  const onClick = () => {
    if (quantity) {
      onConfirmDialog(quantity);
    } else {
      alert('La cantidad es requerida');
    }
  };

  return (
    <Dialog open={open} onClose={handleOpenDialog} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          variant="standard"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" size="small" onClick={handleOpenDialog}>Cancelar</Button>
        <Button variant="text" color="success" size="small" onClick={onClick}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};
