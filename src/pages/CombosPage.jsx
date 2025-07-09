import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase'
import ComboModal from '@/components/ComboModal'

const CombosPage = () => {
  const [combos, setCombos] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState(null)

  const loadCombos = async () => {
    try {
      const q = query(collection(db, 'combos'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCombos(data)
    } catch (err) {
      console.error('Ошибка при загрузке комбо:', err)
    }
  }

  useEffect(() => {
    loadCombos()
  }, [])

  const openNewModal = () => {
    setEditingCombo(null)
    setModalOpen(true)
  }

  const openEditModal = combo => {
    setEditingCombo(combo)
    setModalOpen(true)
  }

  return (
    <div>
      <h2>Комбо-блюда</h2>
      <p>Список комплексных обедов</p>

      <div style={{ margin: '1rem 0' }}>
        <button onClick={openNewModal}>+ Добавить комбо</button>
      </div>

      {combos.length === 0 ? (
        <p>Нет комбо</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {combos.map(c => (
            <li
              key={c.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => openEditModal(c)}
            >
              <strong>{c.name}</strong><br />
              {c.dishes.length} блюд
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <ComboModal
          onClose={() => setModalOpen(false)}
          onSaved={loadCombos}
          existingCombo={editingCombo}
        />
      )}
    </div>
  )
}

export default CombosPage
