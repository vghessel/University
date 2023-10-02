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
    id: 'subject_name',
    numeric: false,
    disablePadding: false,
    label: "Matéria",
  },
  {
    id: 'subject_workload',
    numeric: false,
    disablePadding: false,
    label: "Carga Horária",
  },
  {
    id: 'teacher_name',
    numeric: false,
    disablePadding: false,
    label: "Professor",
  },
];
export default function AdminStudent() {
  const { loggedInUser } = useUser()
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('subject_name');
  const [search, setSearch] = useState();
  const [filteredSubjects, setFilteredSubjects] = useState([]);


  const getTeachers = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/teacher/', {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setTeachers(data);
      getSubjects()
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const getSubjects = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/subject/', {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      const dataWithTeacherName = _.map(data, item => ({
        ...item,
        teacher_id: item.teacher_name,
        teacher_name: _.find(teachers, { 'id': item.teacher_name }).teacher_name
      }))
      setSubjects(dataWithTeacherName);
      setFilteredSubjects(dataWithTeacherName)
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const doSearchSubjects = (text) => {
    setSearch(text);
    const filtered = _.filter(
      subjects,
      (subject) =>
        _.toLower(subject.subject_name).includes(_.toLower(text)) ||
        _.toLower(subject.teacher_name).includes(_.toLower(text))
    );
    setFilteredSubjects(filtered);
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
          label="Matérias"
          search={search}
          doSearch={doSearchSubjects}
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
      {_.map(_.orderBy(filteredSubjects, orderBy, order), subject => (
        <TableRow
          hover
          key={subject.id}
        >
          <TableCell>{subject.subject_name}</TableCell>
          <TableCell>{subject.subject_workload}</TableCell>
          <TableCell>{subject.teacher_name}</TableCell>
        </TableRow>
      ))
      }
      {(filteredSubjects || []).length === 0 &&
        <TableRow
          hover
          key={1}
        >
          <TableCell colSpan={4}>Nenhuma matéria encontrado</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
