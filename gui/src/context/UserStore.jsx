import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { API } from '../services/connection';

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const navigate = useNavigate();

  const changeLoggedInUser = value => {
    setLoggedInUser(value);
  };

  const logout = async () => {
    try {
      await API.delete('logout');
      setLoggedInUser(null);
    } catch (err) {
      setLoggedInUser(null);
      navigate('/');
    }
  };

  return (
    <UserContext.Provider value={{ loggedInUser, changeLoggedInUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

export default UserProvider;
