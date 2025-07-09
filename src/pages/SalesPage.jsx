import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import SalesModal from '@/components/SalesModal'

const SalesPage = () => {
  const [sales, setSales] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState(null)

  const loadSales = async () => {
    try {
      const q = query(collection(db, 'sales'), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSales(data)
    } catch (err) {
      console.error('Ошибка при загрузке продаж:', err)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  const openNewModal = () => {
    setEditingSale(null)
    setModalOpen(true)
  }

  const openEditModal = (sale) => {
    setEditingSale(sale)
    setModalOpen(true)
  }

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return ''
    return timestamp.toDate().toLocaleDateString()
  }

  return (
    <div>
      <h2>Продажи</h2>
      <p>История и статистика продаж</p>

      <div style={{ margin: '1rem 0' }}>
        <button onClick={openNewModal}>+ Добавить продажу</button>
      </div>

      {sales.length === 0 ? (
        <p>Нет продаж</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {sales.map(s => (
            <li
              key={s.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => openEditModal(s)}
            >
              <strong>{formatDate(s.date)}</strong>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <SalesModal
          onClose={() => setModalOpen(false)}
          onSaved={loadSales}
          existingSale={editingSale}
        />
      )}
    </div>
  )
}

export default SalesPage
