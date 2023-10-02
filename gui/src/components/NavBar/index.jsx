import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import makeStyles from '@mui/styles/makeStyles';
import _ from 'lodash'
import styled from "styled-components";

import { useUser } from '../../context/UserStore';
import { LogoHeader } from '../../assets/theme';

const Title = styled.div`
  width: 100% ;

  .title {
    font-weight: 500;
    font-size: 1rem;
  }
`

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    paddingRight: '0 !important',
    boxShadow: '0px 1px 0px 0px rgb(0 0 0 / 12%)',
  },
}));

export default function NavBar() {
  const { logout, loggedInUser } = useUser();
  const classes = useStyles();
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        <LogoHeader
          height="34px"
          style={{
            paddingRight: '24px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        />
        <Title>
          <p className='title'>Bem vindo à Universidade Delloite, <em>{_.get(loggedInUser, 'name', 'Coordenador')}</em></p>
        </Title>
        <Button style={{ margin: '0 24px' }} variant='outlined' color='secondary' onClick={logout}>
          <LogoutIcon  />
        </Button>
      </Toolbar>
    </AppBar>
  );
}
