import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";

const PopAlert = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Eliminar
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Deseas cancelar tu cita?"}
          </DialogTitle>
    
          <DialogActions>
            <Button onClick={handleClose}>
                Si
            </Button>
            <Button onClick={handleClose} autoFocus>
                No
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


export default PopAlert