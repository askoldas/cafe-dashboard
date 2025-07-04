import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import styles from './DashboardLayout.module.scss'

const DashboardLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />

      <div className={styles.main}>
        {/* This is your topbar placeholder, only visible on mobile */}
        <div className={styles.topbarSpacer} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
