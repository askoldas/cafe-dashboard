import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase'
import PurchaseModal from '@/components/PurchaseModal'

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState(null)

  const loadPurchases = async () => {
    try {
      const q = query(collection(db, 'purchases'), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPurchases(data)
    } catch (err) {
      console.error('Ошибка при загрузке закупок:', err)
    }
  }

  useEffect(() => {
    loadPurchases()
  }, [])

  const formatDate = timestamp => {
    if (!timestamp?.toDate) return ''
    const date = timestamp.toDate()
    return date.toLocaleDateString() // Only date, no time
  }

  const getTotal = items =>
    items?.reduce((sum, i) => sum + (parseFloat(i.totalPrice) || 0), 0).toFixed(2)

  const openNewModal = () => {
    setEditingPurchase(null)
    setModalOpen(true)
  }

  const openEditModal = purchase => {
    setEditingPurchase(purchase)
    setModalOpen(true)
  }

  return (
    <div>
      <h2>Закупки</h2>
      <p>История и добавление новых закупок</p>

      <div style={{ margin: '1rem 0' }}>
        <button onClick={openNewModal}>+ Добавить закупку</button>
      </div>

      {purchases.length === 0 ? (
        <p>Нет закупок</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {purchases.map(p => (
            <li
              key={p.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => openEditModal(p)}
            >
              <strong>{formatDate(p.date)}</strong><br />
              {p.items.length} позиций – {getTotal(p.items)} €
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <PurchaseModal
          onClose={() => setModalOpen(false)}
          onSaved={loadPurchases}
          existingPurchase={editingPurchase}
        />
      )}
    </div>
  )
}

export default PurchasesPage
