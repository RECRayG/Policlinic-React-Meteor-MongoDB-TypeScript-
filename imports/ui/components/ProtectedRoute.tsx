// @ts-ignore
import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

// @ts-ignore
import { ThemeProvider } from '@mui/material';
// @ts-ignore
import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { useTracker } from 'meteor/react-meteor-data';

// @ts-ignore
import { theme } from '../shared/ui/theme';
// @ts-ignore
import { Navbar } from '../widgets/Navbar';
import {DoctorsCollection} from "/imports/api/doctors";

export const ProtectedRoute: React.FC = () => {
  const user = useTracker(() => Meteor.user());

  if (user === null) {
    return <Navigate replace to="/login" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar>
        <Outlet />
      </Navbar>
    </ThemeProvider>
  );
};
