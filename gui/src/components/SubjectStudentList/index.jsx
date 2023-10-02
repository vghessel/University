import { useState, useEffect } from 'react';
import _ from 'lodash'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


import { API } from '../../services/connection'
import { useUser } from '../../context/UserStore';
import DeleteConfirmation from '../DeleteConfirmation';
import { Tab } from '@mui/material';

export default function SubjectStudentList({ students, handleClose, data }) {

  const { loggedInUser } = useUser()
  const [grades, setGrades] = useState([])
  const [deleteItem, setDeleteItem] = useState(null)
  const [filteredStudents, setFilteredStudents] = useState(students)


  const saveGrade = async (_event, newGrade) => {
    const payload = {
      grade: 0,
      student_name: newGrade.id,
      subject_name: data.id,
    }
    try {
      await API.post('/grade/', payload, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      getGrades();
    } catch (err) {
      console.warn(err)
    }
  }

  const getGrades = async () => {
    try {
      const { data: subjectData } = await API.get(`/subject/${data.id}/students/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });

      const dataWithStudentName = _.map(subjectData, item => ({
        ...item,
        student_id: item.student_name,
        student_name: _.find(students, { 'id': item.student_name }).student_name
      }))
      setFilteredStudents(_.filter(students, fS => !_.includes(_.map(dataWithStudentName, 'student_id'), fS.id)))
      setGrades(dataWithStudentName);
    } catch (err) {
      console.warn(err)
    }
  }

  const deleteGrade = async () => {
    try {
      await API.delete(`/grade/${deleteItem.id}/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      getGrades();
    } catch (err) {
      console.warn(err)
    } finally {
      setDeleteItem(null)
    }
  }
  useEffect(() => {
    getGrades();
  }, []);
  return (
    <>
      {deleteItem &&
        <DeleteConfirmation
          handleClose={() => setDeleteItem(null)}
          deleteItem={deleteItem.student_name}
          onDelete={deleteGrade}
        />
      }
      <Dialog open maxWidth="sm" fullWidth>
        <DialogTitle>
          {`Lista de estudantes de ${data.subject_name}`}
        </DialogTitle>
        <DialogContent>
          {(filteredStudents || []).length > 0 &&
            <>
              <br />
              <Autocomplete
                disableClearable
                blurOnSelect
                options={filteredStudents}
                onChange={saveGrade}
                renderInput={(params) => <TextField {...params} label="Adicionar aluno" size="small" />}
                renderOption={(props, option) => (
                  <MenuItem key={option.id} value={option.id} {...props}>
                    {option.label}
                  </MenuItem>
                )}
              />
            </>}
          <TableContainer component={Paper} >
            <Table>
              <TableBody>
                {_.map(_.orderBy(grades, 'student_name'), grade => (

                  <TableRow>
                    <TableCell>{grade.student_name}</TableCell>
                    <TableCell>
                      <Tooltip title="Remover Aluno">
                        <IconButton
                          onClick={() => setDeleteItem(grade)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {(grades || []).length === 0 &&
                  <TableRow>
                    <TableCell colSpan={2}>Nenhum aluno encontrado</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

SubjectStudentList.propTypes = {
  students: PropTypes.array,
  handleClose: PropTypes.func,
  data: PropTypes.object
};