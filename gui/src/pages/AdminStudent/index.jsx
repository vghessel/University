import { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhachedTableHead from '../../components/EnhachedTableHead';
import PageBase from '../../components/PageBase'
import PersonForm from '../../components/PersonForm';
import DeleteConfirmation from '../../components/DeleteConfirmation';

import { API } from '../../services/connection'
import { useUser } from '../../context/UserStore';
const headCells = [
  {
    id: 'student_name',
    numeric: false,
    disablePadding: false,
    label: "Nome",
  },
  {
    id: 'student_birth_date',
    numeric: false,
    disablePadding: false,
    label: "Data de Nascimento",
  },
  {
    id: 'student_email',
    numeric: false,
    disablePadding: false,
    label: "E-Mail",
  },
];
export default function AdminStudent() {
  const { loggedInUser } = useUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('student_name');
  const [search, setSearch] = useState();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isNew, setIsNew] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null)

  const getStudents = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/student/', {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setStudents(data);
      setFilteredStudents(data)
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const saveStudents = async (newData) => {
    const payload = {
      student_name: newData.name,
      student_email: newData.email,
      student_password: newData.password,
      student_birth_date: format(newData.birth_date, 'yyyy-MM-dd')
    }
    try {
      if (newData.id) {
        await API.put(`/student/${newData.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
          }
        });
      } else {
        await API.post('/student/', payload, {
          headers: {
            Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
          }
        });
      }
      getStudents();
    } catch (err) {
      console.warn(err)
    } finally {
      setIsNew(null)
    }
  }

  const deleteStudent = async () => {
    try {
      await API.delete(`/student/${deleteItem.id}/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      getStudents();
    } catch (err) {
      console.warn(err)
    } finally {
      setDeleteItem(null)
    }
  }
  const doSearchStudents = (text) => {
    setSearch(text);
    const filtered = _.filter(
      students,
      (student) =>
        _.toLower(student.student_name).includes(_.toLower(text)) ||
        _.toLower(student.student_email).includes(_.toLower(text))
    );
    setFilteredStudents(filtered);
  };

  const doSort = (event, newOrderBy) => {
    const isAsc = orderBy === newOrderBy && order === 'asc';
    const toggledOrder = isAsc ? 'desc' : 'asc';
    setOrder(toggledOrder);
    setOrderBy(newOrderBy);
  };

  useEffect(() => {
    getStudents();
  }, []);
  console.warn('delete', deleteItem)
  return (
    <PageBase
      loading={loading}
      removePadding
      toolBar={
        <EnhancedTableToolbar
          label="Alunos"
          search={search}
          doSearch={doSearchStudents}
          setIsNew={() => setIsNew({
            id: null
          })}
        />
      }
      tableHeader={
        <EnhachedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={doSort}
          headCells={headCells}
        />
      }
    >
      {isNew &&
        <PersonForm
          title="Aluno"
          handleClose={() => setIsNew(null)}
          data={isNew}
          onSave={saveStudents}
        />
      }
      {deleteItem &&
        <DeleteConfirmation
          handleClose={() => setDeleteItem(null)}
          deleteItem={deleteItem.student_name}
          onDelete={deleteStudent}
        />
      }
      {_.map(_.orderBy(filteredStudents, orderBy, order), student => (
        <TableRow
          hover
          key={student.id}
        >
          <TableCell>{student.student_name}</TableCell>
          <TableCell>{format(parseISO(student.student_birth_date), 'dd/MM/yyyy')}</TableCell>
          <TableCell>{student.student_email}</TableCell>
          <TableCell>
            <Tooltip title="Editar Aluno">
              <IconButton
                onClick={() => setIsNew({
                  id: student.id,
                  name: student.student_name,
                  email: student.student_email,
                  birth_date: parseISO(student.student_birth_date)
                })}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover Aluno">
              <IconButton
                onClick={() => setDeleteItem(student)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))
      }
      {(filteredStudents || []).length === 0 &&
        <TableRow>
          <TableCell colSpan={4}>Nenhum aluno encontrado</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
