import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import useLogin from './useLogin';
import { Logo } from '../../assets/theme';

import * as Style from './style';

export default function Login() {
  const {
    username,
    changeUsername,
    password,
    changePassword,
    handleClickShowPassword,
    showPassword,
    login,
    errorInLogin,
  } = useLogin();

  return (
    <Style.Container>
      <Style.Left>
        <Style.LeftContainer>
          <Logo height="40px" />
          <div className='text'>
            <h1 className='title'>Bem vindo a universidade Delloite!</h1>
          </div>
        </Style.LeftContainer>
      </Style.Left>
      <Style.Right>
        <div className='box'>
          <h1 className='login'>Log in</h1>
          <h6 className='subtitle'>
            Informe seu usuário e senha
          </h6>
          <TextField
            className='input'
            label='Usuário'
            value={username}
            onChange={changeUsername}
          />  
          <FormControl className='input' sx={{ m: 1 }}>
            <InputLabel>
              Senha
            </InputLabel>
            <OutlinedInput
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={changePassword}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge='end'
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            onClick={login}
            variant='contained'
          >
            Login
          </Button>
          <Style.Error>{errorInLogin}</Style.Error>
        </div>
      </Style.Right>
    </Style.Container>
  );
}
