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
    id: 'teacher_name',
    numeric: false,
    disablePadding: false,
    label: "Nome",
  },
  {
    id: 'teacher_birth_date',
    numeric: false,
    disablePadding: false,
    label: "Data de Nascimento",
  },
  {
    id: 'teacher_email',
    numeric: false,
    disablePadding: false,
    label: "E-Mail",
  },
];
export default function AdminTeacher() {
  const { loggedInUser } = useUser()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('teacher_name');
  const [search, setSearch] = useState();
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null)

  const getTeachers = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/teacher/', {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setTeachers(data);
      setFilteredTeachers(data)
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const saveTeachers = async (newData) => {
    const payload = {
      teacher_name: newData.name,
      teacher_email: newData.email,
      teacher_password: newData.password,
      teacher_birth_date: format(newData.birth_date, 'yyyy-MM-dd')
    }
    try {
      if (newData.id) {
        await API.put(`/teacher/${newData.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
          }
        });
      } else {
        await API.post('/teacher/', payload, {
          headers: {
            Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
          }
        });
      }
      getTeachers();
    } catch (err) {
      console.warn(err)
    } finally {
      setIsNew(null)
    }
  }
  const deleteTeacher = async () => {
    try {
      await API.delete(`/teacher/${deleteItem.id}/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      getTeachers();
    } catch (err) {
      console.warn(err)
    } finally {
      setDeleteItem(null)
    }
  }
  const doSearchTeachers = (text) => {
    setSearch(text);
    const filtered = _.filter(
      teachers,
      (teacher) =>
        _.toLower(teacher.teacher_name).includes(_.toLower(text)) ||
        _.toLower(teacher.teacher_email).includes(_.toLower(text))
    );
    setFilteredTeachers(filtered);
  };

  const doSort = (event, newOrderBy) => {
    const isAsc = orderBy === newOrderBy && order === 'asc';
    const toggledOrder = isAsc ? 'desc' : 'asc';
    setOrder(toggledOrder);
    setOrderBy(newOrderBy);
  };

  useEffect(() => {
    getTeachers();
  }, []);
  return (
    <PageBase
      loading={loading}
      removePadding
      toolBar={
        <EnhancedTableToolbar
          label="Professores"
          search={search}
          doSearch={doSearchTeachers}
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
          title="Professor"
          handleClose={() => setIsNew(null)}
          data={isNew}
          onSave={saveTeachers}
        />
      }
      {deleteItem &&
        <DeleteConfirmation
          handleClose={() => setDeleteItem(null)}
          deleteItem={deleteItem.teacher_name}
          onDelete={deleteTeacher}
        />
      }
      {_.map(_.orderBy(filteredTeachers, orderBy, order), teacher => (
        <TableRow
          hover
          key={teacher.id}
        >
          <TableCell>{teacher.teacher_name}</TableCell>
          <TableCell>{format(parseISO(teacher.teacher_birth_date), 'dd/MM/yyyy')}</TableCell>
          <TableCell>{teacher.teacher_email}</TableCell>
          <TableCell>
            <Tooltip title="Editar Professor">
              <IconButton
                onClick={() => setIsNew({
                  id: teacher.id,
                  name: teacher.teacher_name,
                  email: teacher.teacher_email,
                  birth_date: parseISO(teacher.teacher_birth_date)
                })}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover Professor">
              <IconButton
                onClick={() => setDeleteItem(teacher)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))
      }
      {(filteredTeachers || []).length === 0 &&
        <TableRow>
          <TableCell colSpan={4}>Nenhum professor encontrado</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
