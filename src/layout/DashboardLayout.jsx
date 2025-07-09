import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import styles from './DashboardLayout.module.scss'

const DashboardLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.main}>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
