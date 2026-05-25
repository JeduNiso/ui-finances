import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import AccountsPage from '../pages/AccountsPage'
import SpendingPage from '../pages/SpendingPage'
import ExpensesPage from '../pages/ExpensesPage'
import DebtsPage from '../pages/DebtsPage'
import FamilyPage from '../pages/FamilyPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'spending', element: <SpendingPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'debts', element: <DebtsPage /> },
      { path: 'family', element: <FamilyPage /> },
    ],
  },
])

export default router
