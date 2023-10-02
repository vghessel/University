import { useState, useEffect } from 'react';
import _ from 'lodash'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function SubjectForm({ teachers, handleClose, data, onSave }) {

  const [inputData, setInputData] = useState(data)
  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>
        {`${data.id ? 'Alterar' : 'Adicionar'} Matéria`}
      </DialogTitle>
      <DialogContent>
        <br />
        <Grid spacing={2} container justifyContent="space-around">
          <Grid item xs={8}>
            <TextField
              label="Matéria"
              fullWidth
              value={inputData.name}
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Carga horária"
              type="number"
              fullWidth
              value={inputData.workload}
              onChange={(e) => setInputData({ ...inputData, workload: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Professor"
              select
              fullWidth
              value={inputData.teacher_id || 0}
              onChange={(e) => setInputData({ ...inputData, teacher_id: e.target.value })}
            >
              <MenuItem value={0}><em>Selecione o professor</em></MenuItem>
              {_.map(_.orderBy(teachers, 'teacher_name'), teacher => (
                <MenuItem value={teacher.id}>{teacher.teacher_name}</MenuItem>
              ))}
            </TextField>
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
            !inputData.workload ||
            !inputData.teacher_id
          }
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SubjectForm.propTypes = {
  teachers: PropTypes.array,
  handleClose: PropTypes.func,
  data: PropTypes.object,
  onSave: PropTypes.func
};