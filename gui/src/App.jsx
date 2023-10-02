import { Routes, Route, Navigate } from 'react-router-dom';
import _ from 'lodash';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';

import Student from './pages/Student';
import Teacher from './pages/Teacher';
import AdminHome from './pages/AdminHome';
import Login from './pages/Login';
import Navbar from './components/NavBar';
import { useUser } from './context/UserStore';

function App() {
  const { loggedInUser } = useUser();
  const loggedIn = _.get(loggedInUser, 'loggedIn', false)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      {loggedIn ? (
        <div>
          <Navbar />
          <div>
            <Routes>
              <Route path='/student' element={<Student />} />
              <Route path='/teacher' element={<Teacher />} />
              <Route path='/admin' element={<AdminHome />} />
              <Route path='/' element={<Login />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      )}
    </LocalizationProvider>
  );
}

export default App;
