import { Routes, Route, Navigate } from 'react-router-dom';
import _ from 'lodash';

import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/NavBar';
import { useUser } from './context/UserStore';

function App() {
  const { loggedInUser } = useUser();
  return (
    <>
      {_.get(loggedInUser, 'loggedIn', false) ? (
        <div>
          <Navbar />
          <div>
            <div style={{ marginLeft: '261px' }}>
              <Routes>
                <Route path='/' element={<Home />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
