import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';

import RegisterView from 'src/views/auth/RegisterView';
import RepairsView from 'src/views/repairs/RepairsView';
import DevicesView from 'src/views/devices/DevicesView';
import CategoriesView from 'src/views/categories/CategoriesView';
import DevicesDetailedView from 'src/views/devices/DetailedView';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'repairs', element: <RepairsView /> },
      { path: 'devices/:id', element: <DevicesDetailedView /> },
      { path: 'devices', element: <DevicesView /> },
      { path: 'categories', element: <CategoriesView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
