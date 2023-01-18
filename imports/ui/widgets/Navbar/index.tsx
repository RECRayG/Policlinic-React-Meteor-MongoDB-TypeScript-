// @ts-ignore
import React, {FC, ReactNode, useState} from 'react';

import { useNavigate } from 'react-router-dom';

import { AccountCircle } from '@mui/icons-material';
// @ts-ignore
import { AppBar, CssBaseline } from "@mui/material";
// @ts-ignore
import Box from '@mui/material/Box';
// @ts-ignore
import Button from '@mui/material/Button';
// @ts-ignore
import Container from '@mui/material/Container';
// @ts-ignore
import IconButton from '@mui/material/IconButton';
// @ts-ignore
import Menu from '@mui/material/Menu';
// @ts-ignore
import MenuItem from '@mui/material/MenuItem';
// @ts-ignore
import Toolbar from '@mui/material/Toolbar';
// @ts-ignore
import Tooltip from '@mui/material/Tooltip';
// @ts-ignore
import Typography from '@mui/material/Typography';
// @ts-ignore
import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { useTracker } from 'meteor/react-meteor-data';

import { useMeteorCall } from '../../shared/hooks/useMeteorCall';
import { Loader } from '../../shared/ui/Loader';

// @ts-ignore
import { RolesEnum } from '/imports/api/user';

type ListType = {
  text: string;
  path: string;
  roles?: string[];
};

const list: ListType[] = [
  {
    text: 'Приёмная',
    path: '/receptions',
    roles: [RolesEnum.ADMIN, RolesEnum.DOCTOR],
  },
  {
    text: 'Врачи',
    path: '/doctors',
    roles: [RolesEnum.ADMIN],
  },
  {
    text: 'Расписание врачей',
    path: '/timetable',
    roles: [RolesEnum.ADMIN],
  },
  {
    text: 'Пациенты',
    path: '/patients',
    roles: [RolesEnum.ADMIN],
  },
  {
    text: 'Пользователи',
    path: '/users',
    roles: [RolesEnum.ADMIN],
  },
];

export const Navbar: React.FC = ({ children }) => {
  const user = useTracker(() => Meteor.user());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { data: userRole, isLoading } = useMeteorCall<string>('user.getUserRole');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    Meteor.logout();
    navigate('/login');
    setAnchorEl(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-around' }}>
                {list.map((page) => {
                  if (userRole && !page.roles?.includes(userRole)) {
                    return null;
                  }
                  return (
                      <Button
                          key={page.text}
                          onClick={() => navigate(page.path)}
                          sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        {page.text}
                      </Button>
                  );
                })}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title={"(" + userRole + ") " + "Выйти"}>
                  <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                    <AccountCircle style={{color: "#fff"}}/>
                  </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '50px' }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                  <Typography textAlign="center">{user?.username}</Typography>
                  <MenuItem onClick={onLogout}>
                    <Typography textAlign="center">Выйти</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
  );
}
