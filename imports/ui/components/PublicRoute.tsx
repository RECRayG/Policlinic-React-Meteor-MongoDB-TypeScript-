// @ts-ignore
import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

// @ts-ignore
import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { useTracker } from 'meteor/react-meteor-data';

export const PublicRoute: React.FC = () => {
  const user = useTracker(() => Meteor.user());

  if (user !== null) {
    return <Navigate replace to="/receptions" />;
  }

  return <Outlet />;
};
