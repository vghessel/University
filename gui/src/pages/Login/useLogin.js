import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import md5 from "js-md5";

import { useUser } from '../../context/UserStore';
import { LOGIN } from '../../services/connection'

const ROTAS = ['/', '/student', '/teacher', '/admin']

export default () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [errorInLogin, setErrorInLogin] = useState('')

  const { changeLoggedInUser } = useUser()

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const changeUsername = (event) => {
    setUsername(event.target.value)
  }

  const changePassword = (event) => {
    setPassword(event.target.value)
  }

  const login = async () => {
    if (!username.length || !password.length) return null

    const passwordHash = md5(password);

    const payload = {
      user: username,
      password: passwordHash,
    };

    // try {
    //  await LOGIN.post("security/login", payload)
    const user = {
      level: 1,
      id: 1, 
      name: 'Wendell',
      apiKey: '',
      loggedIn: true
    }
    changeLoggedInUser(user)
    return navigate(ROTAS[user.level])
    /* }
    catch (error) {
      return setErrorInLogin('Error trying to login, please try again.')
    } */
  }

  return {
    username,
    changeUsername,
    password,
    changePassword,
    errorInLogin,
    handleClickShowPassword,
    showPassword,
    login
  }
}
