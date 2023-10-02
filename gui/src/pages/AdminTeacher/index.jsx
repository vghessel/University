import { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import _ from 'lodash';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhachedTableHead from '../../components/EnhachedTableHead';
import PageBase from '../../components/PageBase'

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
      {_.map(_.orderBy(filteredTeachers, orderBy, order), teacher => (
        <TableRow
          hover
          key={teacher.id}
        >
          <TableCell>{teacher.teacher_name}</TableCell>
          <TableCell>{format(parseISO(teacher.teacher_birth_date),'dd/MM/yyyy')}</TableCell>
          <TableCell colSpan={2}>{teacher.teacher_email}</TableCell>
        </TableRow>
      ))
      }
      {(filteredTeachers || []).length === 0 &&
        <TableRow
          hover
          key={1}
        >
          <TableCell colSpan={4}>Nenhuma professor encontrado</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
