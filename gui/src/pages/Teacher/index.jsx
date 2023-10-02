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
    id: 'student_name',
    numeric: false,
    disablePadding: false,
    label: "Aluno",
  },
  {
    id: 'grade',
    numeric: true,
    disablePadding: false,
    label: 'Nota *',
  },
];
export default function Teacher() {
  const { loggedInUser } = useUser()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('subject_name');
  const [search, setSearch] = useState();
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const getSubjects = async () => {
    setLoading(true)
    try {
      const { data } = await API.get(`/teacher/${_.get(loggedInUser, 'id') }/subjects/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setSubjects(data);
      setFilteredSubjects(_.get(data, 'subject.students', []))
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const doSearchSubjects = (text) => {
    setSearch(text);
    const filtered = _.filter(
      _.get(subjects, 'subject.students', []),
      (subject) =>
        _.toLower(subject.student_name).includes(_.toLower(text)) ||
        _.toLower(subject.grade).includes(_.toLower(text))
    );
    setFilteredSubjects(filtered);
  };

  const doSort = (event, newOrderBy) => {
    const isAsc = orderBy === newOrderBy && order === 'asc';
    const toggledOrder = isAsc ? 'desc' : 'asc';
    setOrder(toggledOrder);
    setOrderBy(newOrderBy);
  };

  const doUpdateGrade = async (grade, gradeValue) => {
    const gradeObject = {
      id: grade.id,
      grade: gradeValue,
      subject_name: _.get(subjects, 'subject.id', 0),
      student_name: grade.student_id
    }
    await API.get('/grade/', {
      headers: {
        Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
      }
    })
    await API.put(`/grade/${grade.id}/`, gradeObject, {
      headers: {
        Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
      }
    })
  }

  useEffect(() => {
    getSubjects();
  }, []);
  return (
    <>
      <PageBase
        loading={loading}
        toolBar={
          <EnhancedTableToolbar
            label={`Alunos da matéria: ${_.get(subjects, 'subject.subject_name', '')}`}
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
        {_.map(_.orderBy(filteredSubjects, orderBy, order), student => (
          <TableRow
            hover
            key={student.id}
          >
            <TableCell>{student.student_name}</TableCell>
            <TableCell style={{ width: '100px' }}>
              <Grade
                initialValue={parseFloat(student.grade, 10)}
                grade={student}
                handlerChange={doUpdateGrade}
              />
            </TableCell>
          </TableRow>
        ))
        }
        {(filteredSubjects || []).length === 0 &&
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
