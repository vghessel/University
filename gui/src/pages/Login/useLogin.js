import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import _ from 'lodash'

import { useUser } from '../../context/UserStore';
import { API } from '../../services/connection'

const ROTAS = ['/', '/student', '/teacher', '/admin']

export default () => {
  const [username, setUsername] = useState('v@gmail.com')
  const [password, setPassword] = useState('1234')

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

    const payload = {
      username: username,
      password: password,
    };

    try {
      const { data } = await API.post("/login/", payload)
      const user = {
        level: _.get(data,'groups[0].id', 1),
        id: data.user_id,
        name: data.name,
        apiKey: data.access_token,
        loggedIn: true
      }
      changeLoggedInUser(user)
      return navigate(ROTAS[user.level])
    }
    catch (error) {
      return setErrorInLogin('Error trying to login, please try again.')
    }
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
