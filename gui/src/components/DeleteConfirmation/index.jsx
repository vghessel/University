import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

export default function DeleteConfirmation({ handleClose, deleteItem, onDelete }) {
  console.warn('delete')
  return (
    <Dialog open minW="sm" fullWidth>
      <DialogTitle>
        Tem certeza?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja deletar {deleteItem}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Não
        </Button>
        <Button
          variant="contained"
          onClick={onDelete}
          color="primary"
        >
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmation.propTypes = {
  handleClose: PropTypes.func,
  deleteItem: PropTypes.string,
  onDelete: PropTypes.func
};