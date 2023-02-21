import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  title: string;
  text: string;
  open: boolean;
  textConfirmButton: string;
  textCacelButton: string;
  handleOpenDialog: () => void;
  onConfirmDialog: () => void;
}

export default function AlertDialog({ title, text, open, textConfirmButton, textCacelButton, handleOpenDialog, onConfirmDialog }: Props) {

  return (
    <Dialog
      open={open}
      onClose={handleOpenDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" size="small" onClick={handleOpenDialog}>{textCacelButton}</Button>
        <Button variant="text" color="error" size="small" onClick={onConfirmDialog} autoFocus>
          {textConfirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}