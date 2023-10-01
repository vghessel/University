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
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: "Matérias",
  },
  {
    id: 'professor',
    numeric: false,
    disablePadding: false,
    label: 'Professor',
  },
  {
    id: 'load',
    numeric: true,
    disablePadding: false,
    label: 'Carga horária',
  },
  {
    id: 'nota',
    numeric: true,
    disablePadding: false,
    label: 'Nota',
  },
];
export default function Student() {
  const { loggedInUser } = useUser()
  const [ subjects, setSubjects ] = useState([])
  const [ loading, setLoading ] = useState(true)

  const getSubjects = async () => {
    setLoading(true)
    try {
      const { data } = await API.get(`/student/${_.get(loggedInUser, 'id') }/subjects/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setSubjects(data);
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSubjects();
  }, []);
  return (
    <PageBase
      loading={loading}
      toolBar={<EnhancedTableToolbar label="Notas" hideAdd />}
      tableHeader={
        <EnhachedTableHead
          order={'order'}
          orderBy={'orderBy'}
          rowCount={0}
          onRequestSort={() => null}
          headCells={headCells}
          noActions
        />
      }
    >
      {_.map(_.get(subjects, 'grades', []), subject => (
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
      {_.get(subjects, 'grades', []).length === 0 &&
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
