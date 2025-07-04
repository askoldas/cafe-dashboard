import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import styles from './Navbar.module.scss'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Dishes', to: '/dishes' },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMenu = () => setMobileOpen(prev => !prev)

  return (
    <>
      {/* Mobile toggle button */}
      <button className={styles.mobileToggle} onClick={toggleMenu}>
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`${styles.navbar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.title}>Cafe Dashboard</div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={() => setMobileOpen(false)} // closes menu on nav
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}

export default Navbar
