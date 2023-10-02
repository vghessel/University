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
  return (
    <PageBase
      loading={loading}
      removePadding
      toolBar={
        <EnhancedTableToolbar
          label="Professores"
          search={search}
          doSearch={doSearchStudents}
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
      {_.map(_.orderBy(filteredStudents, orderBy, order), student => (
        <TableRow
          hover
          key={student.id}
        >
          <TableCell>{student.student_name}</TableCell>
          <TableCell>{format(parseISO(student.student_birth_date),'dd/MM/yyyy')}</TableCell>
          <TableCell colSpan={2}>{student.student_email}</TableCell>
        </TableRow>
      ))
      }
      {(filteredStudents || []).length === 0 &&
        <TableRow
          hover
          key={1}
        >
          <TableCell colSpan={4}>Nenhuma aluno encontrado</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
