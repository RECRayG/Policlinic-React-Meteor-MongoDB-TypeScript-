// @ts-ignore
import React, { FC } from 'react';

import { Outlet } from 'react-router-dom';

// @ts-ignore
import { ThemeProvider } from '@mui/material';

// @ts-ignore
import { useMeteorCall } from '../shared/hooks/useMeteorCall';
// @ts-ignore
import { Loader } from '../shared/ui/Loader';
// @ts-ignore
import { Navbar } from '../widgets/Navbar';

// @ts-ignore
import { theme } from '/imports/ui/shared/ui/theme';
export const RoleRoute: FC<{ roles: string[] }> = ({ roles = [] }) => {
  const { data, error, isLoading } = useMeteorCall<string>('user.getUserRole');
  if (isLoading || !data) {
    return <Loader />;
  }

  // @ts-ignore
  if (error || !roles.includes(data)) {
    return <div>403</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar>
        <Outlet />
      </Navbar>
    </ThemeProvider>
  );
};
