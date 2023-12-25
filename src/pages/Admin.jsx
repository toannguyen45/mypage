import AppLayout from '@components/AppLayout'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default Admin
