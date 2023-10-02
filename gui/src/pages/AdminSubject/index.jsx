import { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhachedTableHead from '../../components/EnhachedTableHead';
import PageBase from '../../components/PageBase';
import SubjectForm from '../../components/SubjectForm';
import SubjectStudentList from '../../components/SubjectStudentList';
import DeleteConfirmation from '../../components/DeleteConfirmation';

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
  }
];
export default function AdminStudent() {
  const { loggedInUser } = useUser()
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('subject_name');
  const [search, setSearch] = useState();
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [studentsEdit, setStudentsEdit] = useState(null);

  const getStudents = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/student/', {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setStudents(data);
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }

  const getTeachers = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/teacher/', {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      setTeachers(data);
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
      if (!_.isEmpty(teachers)) {
        const dataWithTeacherName = _.map(data, item => ({
          ...item,
          teacher_id: item.teacher_name,
          teacher_name: _.find(teachers, { 'id': item.teacher_name }).teacher_name
        }))
        
        setSubjects(dataWithTeacherName);
        setFilteredSubjects(dataWithTeacherName)
      }
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false);
    }
  }
  const saveSubjects= async (newData) => {
    const payload = {
      subject_name: newData.name,
      subject_workload: newData.workload,
      teacher_name: newData.teacher_id,
    }
    try {
      if (newData.id) {
        await API.put(`/subject/${newData.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
          }
        });
      } else {
        await API.post('/subject/', payload, {
          headers: {
            Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
          }
        });
      }
      getSubjects();
    } catch (err) {
      console.warn(err)
    } finally {
      setIsNew(null)
    }
  }
  const deleteSubject = async () => {
    try {
      await API.delete(`/subject/${deleteItem.id}/`, {
        headers: {
          Authorization: `Bearer ${_.get(loggedInUser, 'apiKey')}`,
        }
      });
      getSubjects();
    } catch (err) {
      console.warn(err)
    } finally {
      setDeleteItem(null)
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
    getStudents();
  }, []);

  useEffect(() => {
    getTeachers();
  }, [students]);

  useEffect(() => {
    getSubjects();
  }, [teachers]);
  return (
    <PageBase
      loading={loading}
      removePadding
      toolBar={
        <EnhancedTableToolbar
          label="Matérias"
          search={search}
          doSearch={doSearchSubjects}
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
        <SubjectForm
          handleClose={() => setIsNew(null)}
          data={isNew}
          onSave={saveSubjects}
          teachers={teachers}
        />
      }
      {studentsEdit &&
        <SubjectStudentList
          handleClose={() => setStudentsEdit(null)}
          data={studentsEdit}
          students={_.map(students, i => ({...i, label: i.student_name}))}
        />
      }
      {deleteItem &&
        <DeleteConfirmation
          handleClose={() => setDeleteItem(null)}
          deleteItem={deleteItem.subject_name}
          onDelete={deleteSubject}
        />
      }
      {_.map(_.orderBy(filteredSubjects, orderBy, order), subject => (
        <TableRow
          hover
          key={subject.id}
        >
          <TableCell>{subject.subject_name}</TableCell>
          <TableCell>{subject.subject_workload}</TableCell>
          <TableCell>{subject.teacher_name}</TableCell>
          <TableCell>
            <Tooltip title="Editar Matéria">
              <IconButton
                onClick={() => setIsNew({
                  id: subject.id,
                  name: subject.subject_name,
                  workload: subject.subject_workload,
                  teacher_id: subject.teacher_id
                })}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Lista de Estudantes">
              <IconButton
                onClick={() => setStudentsEdit({
                  id: subject.id,
                  subject_name: subject.subject_name
                })}
              >
                <GroupsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover Matéria">
              <IconButton
                onClick={() => setDeleteItem(subject)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))
      }
      {(filteredSubjects || []).length === 0 &&
        <TableRow>
          <TableCell colSpan={4}>Nenhuma matéria encontrado</TableCell>
        </TableRow>
      }
    </PageBase>
  );
}
