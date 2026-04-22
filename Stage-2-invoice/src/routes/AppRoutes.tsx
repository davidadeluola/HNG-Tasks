import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import DashboardPage from '../pages/DashboardPage'
import InvoiceDetailsPage from '../pages/InvoiceDetailsPage'
import { ROUTES } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.landing} element={<LandingPage />} />
      <Route path={ROUTES.dashboard} element={<Navigate to={ROUTES.accounts} replace />} />
      <Route path={ROUTES.accounts} element={<DashboardPage />} />
      <Route path={ROUTES.invoiceDetailsPattern} element={<InvoiceDetailsPage />} />
      <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
    </Routes>
  )
}
