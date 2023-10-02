import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import _ from 'lodash'

import { useUser } from '../../context/UserStore';
import { API } from '../../services/connection'

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

    const payload = {
      username: username,
      password: password,
    };

    try {
      const { data } = await API.post("/login/", payload)
      let userIdLocation = 'user_id'
      let userNameLocation = 'name'
      const level = _.get(data, 'groups[0].id', 1)
      switch(level) {
        case 1:
          userIdLocation = 'student.id'
          userNameLocation = 'student.student_name'
          break
        case 2:
          userIdLocation = 'teacher.id'
          userNameLocation = 'teacher.teacher_name'
          break
        default:
      }
      const user = {
        level: level,
        id: _.get(data, userIdLocation),
        name: _.get(data, userNameLocation),
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
