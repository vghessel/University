import { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import _ from 'lodash';
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
    label: "Matérias",
  },
  {
    id: 'teacher_name',
    numeric: false,
    disablePadding: false,
    label: 'Professor',
  },
  {
    id: 'subject_workload',
    numeric: true,
    disablePadding: false,
    label: 'Carga horária',
  },
  {
    id: 'grade',
    numeric: true,
    disablePadding: false,
    label: 'Nota',
  },
];
export default function Student() {
  const { loggedInUser } = useUser()
  const [ subjects, setSubjects ] = useState([])
  const [ loading, setLoading ] = useState(true)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('subject_name');
  const [search, setSearch] = useState();
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const getSubjects = async () => {
    setLoading(true)
    try {
      const { data } = await API.get(`/student/${_.get(loggedInUser, 'id') }/subjects/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setSubjects(data);
      setFilteredSubjects(data.grades)
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const doSearchSubjects = (text) => {
    setSearch(text);
    const filtered = _.filter(
      _.get(subjects, 'grades', []),
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
    getSubjects();
  }, []);

  return (
    <PageBase
      loading={loading}
      toolBar={
        <EnhancedTableToolbar
          label="Notas"
          search={search}
          doSearch={doSearchSubjects}
          hideAdd
        />
      }
      tableHeader={
        <EnhachedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={doSort}
          headCells={headCells}
          noActions
        />
      }
    >
      {_.map(_.orderBy(filteredSubjects, orderBy, order), subject => (
        <TableRow
          hover
          key={subject.id}
        >
          <TableCell>{subject.subject_name}</TableCell>
          <TableCell>{subject.teacher_name}</TableCell>
          <TableCell>{subject.subject_workload}</TableCell>
          <TableCell>{subject.grade}</TableCell>
        </TableRow>
      ))
      }
      {(filteredSubjects || []).length === 0 &&
        <TableRow
          hover
          key={1}
        >
          <TableCell colSpan={4}>Nenhuma matéria encontrada</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
