import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function PersonForm({ title, handleClose, data, onSave }) {
  const [inputData, setInputData ] = useState(data)
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>
        {`${data.id ? 'Alterar' : 'Adicionar'} ${title}`}
      </DialogTitle>
      <DialogContent>
        <br />
        <Grid spacing={2} container justifyContent="space-around">
          <Grid item xs={7}>
            <TextField
              label="Nome"
              fullWidth
              value={inputData.name}
              onChange={(e) => setInputData({ ...inputData, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={5}>
            <DatePicker
              fullWidth
              label="Data de Nascimento"
              value={inputData.birth_date}
              onChange={(newValue) => setInputData({ ...inputData, birth_date: newValue })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled={!!inputData.id}
              label="E-mail"
              fullWidth
              value={inputData.email}
              onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>
                Senha
              </InputLabel>
              <OutlinedInput
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={inputData.password || ''}
                onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge='end'
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined" onClick={handleClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onSave(inputData)}
          color="primary"
          disabled={
            !inputData.name ||
            !inputData.email ||
            !inputData.birth_date
          }
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PersonForm.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  data: PropTypes.object,
  onSave: PropTypes.func
};