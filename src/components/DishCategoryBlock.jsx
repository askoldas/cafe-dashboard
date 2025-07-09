import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import DishModal from '@/components/DishModal'
import { sortByOrder } from '@/utils/sortByOrder'

const DishCategoryBlock = ({ category, onReload }) => {
  const [open, setOpen] = useState(false)
  const [dishes, setDishes] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  useEffect(() => {
    if (!open) return

    const fetchDishes = async () => {
      try {
        const q = query(
          collection(db, 'dishes'),
          where('categoryId', '==', category.id)
        )
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setDishes(sortByOrder(list))
      } catch (err) {
        console.error('Failed to load dishes for', category.name, err)
      }
    }

    fetchDishes()
  }, [open, category.id, modalOpen])

  const handleOpenModal = (dish = null) => {
    setEditingDish(dish)
    setModalOpen(true)
  }

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div
        onClick={() => setOpen(prev => !prev)}
        style={{ padding: '1rem', background: '#f4f4f4', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
      >
        <h3>{category.name}</h3>
        <span>{open ? '−' : '+'}</span>
      </div>

      {open && (
        <div style={{ padding: '1rem' }}>
          {dishes.map(dish => (
            <div
              key={dish.id}
              onClick={() => handleOpenModal(dish)}
              style={{ padding: '0.5rem', borderBottom: '1px solid #eee', cursor: 'pointer' }}
            >
              <strong>{dish.name}</strong> – {dish.portions} порций
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => handleOpenModal()}>+ Добавить блюдо</button>
          </div>
        </div>
      )}

      {modalOpen && (
        <DishModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            onReload()
          }}
          existingDish={editingDish}
          categoryId={category.id}
        />
      )}
    </div>
  )
}

export default DishCategoryBlock
