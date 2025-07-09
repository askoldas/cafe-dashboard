import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import ExpenseModal from '@/components/ExpenseModal'
import styles from './ExpensesPage.module.scss'

const getMonthName = (index) => [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
][index] || ''

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([])
  const [monthFilter, setMonthFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const loadExpenses = () => {
    const q = query(collection(db, 'expenses'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setExpenses(list)
    })
    return unsub
  }

  useEffect(() => {
    const unsub = loadExpenses()
    return () => unsub()
  }, [])

  const openNewModal = () => {
    setEditingExpense(null)
    setModalOpen(true)
  }

  const openEditModal = (expense) => {
    setEditingExpense(expense)
    setModalOpen(true)
  }

  const filtered = expenses.filter(exp => {
    const date = new Date(exp.timestamp)
    const monthMatches = monthFilter === 'all' || date.getMonth().toString() === monthFilter
    const yearMatches = yearFilter === 'all' || date.getFullYear().toString() === yearFilter
    return monthMatches && yearMatches
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i)

  return (
    <div className={styles.page}>
      <h2>Расходы</h2>
      <p>Учёт прочих затрат и регулярных расходов</p>

      <div className={styles.filters}>
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
          <option value="all">Все месяцы</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{getMonthName(i)}</option>
          ))}
        </select>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
          <option value="all">Все годы</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className={styles.list}>
        {filtered.map(exp => (
          <div
            key={exp.id}
            className={styles.item}
            onClick={() => openEditModal(exp)}
            style={{ cursor: 'pointer' }}
          >
            <div><strong>{exp.name}</strong></div>
            <div>{exp.amount} €</div>
            <div>{new Date(exp.timestamp).toLocaleDateString()}</div>
            {exp.description && <div>{exp.description}</div>}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button onClick={openNewModal}>+ Добавить расход</button>
      </div>

      {modalOpen && (
        <ExpenseModal
          existingExpense={editingExpense}
          onClose={() => setModalOpen(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  )
}

export default ExpensesPage