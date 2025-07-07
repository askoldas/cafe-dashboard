import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import styles from './Navbar.module.scss'

const navItems = [
  { label: 'Обзор', to: '/' },
  { label: 'Закупки', to: '/purchases' },
  { label: 'Продажи', to: '/sales' },
  { label: 'Блюда', to: '/dishes' },
  { label: 'Ингредиенты', to: '/products' },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMenu = () => setMobileOpen(prev => !prev)

  return (
    <>
      {/* Topbar always shown on mobile */}
      <div className={styles.topbar}>
        <button className={styles.menuBtn} onClick={toggleMenu}>
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>RubinRub</h1>
      </div>

      {/* Sidebar (desktop) */}
      <aside className={styles.sidebar}>
        <div className={styles.title}>RubinRub</div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}

export default Navbar
