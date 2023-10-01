import { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography'
import _ from 'lodash';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhachedTableHead from '../../components/EnhachedTableHead';
import Grade from '../../components/Grade';
import PageBase from '../../components/PageBase'

import { API } from '../../services/connection'
import { useUser } from '../../context/UserStore';
const headCells = [
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: "Aluno",
  },
  {
    id: 'nota',
    numeric: true,
    disablePadding: false,
    label: 'Nota *',
  },
];
export default function Teacher() {
  const { loggedInUser } = useUser()
  const [ subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  const getSubjects = async () => {
    setLoading(true)
    try {
      const { data } = await API.get(`/teacher/1/subjects/`, {
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
    <>
      <PageBase
        loading={loading}
        toolBar={<EnhancedTableToolbar label={`Alunos da matéria: ${_.get(subjects, 'subject.subject_name', '') }`} hideAdd />}
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
        {_.map(_.get(subjects, 'subject.students', []), student => (
          <TableRow
            hover
            key={student.id}
          >
            <TableCell>{student.student_name}</TableCell>
            <TableCell style={{ width: '100px' }}>
              <Grade initialValue={parseFloat(student.grade, 10)} />
            </TableCell>
          </TableRow>
        ))
        }
        {_.get(subjects, 'subject.students', []).length === 0 &&
          <TableRow
            hover
            key={1}
          >
            <TableCell colSpan={4}>Nenhuma aluno encontrado</TableCell>
          </TableRow>
        }
      </PageBase>
      <Typography style={{ paddingLeft: '20px', paddingRight: '20px' }} variant="caption" display="block">
        * clique 2 vezes para editar a nota do aluno
      </Typography>
    </>
  );
}
