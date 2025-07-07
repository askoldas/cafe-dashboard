import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc
} from 'firebase/firestore'
import { db } from '@/firebase'
import ListItem from './ListItem'
import { sortByOrder } from '@/utils/sortByOrder'
import styles from './CategoryBlock.module.scss'

const CategoryBlock = ({ category }) => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!open) return

    const fetchItems = async () => {
      try {
        const q = query(
          collection(db, 'ingredients'),
          where('categoryId', '==', category.id)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setItems(sortByOrder(data))
      } catch (err) {
        console.error(`Failed to load ingredients for ${category.id}:`, err)
      }
    }

    fetchItems()
  }, [open, category.id])

  const handleAddProduct = async () => {
    const name = prompt('Название ингредиента:')
    if (!name) return

    const unit = prompt('Единица измерения (например, кг, л, шт):')
    if (!unit) return

    // Calculate next order number based on existing items
    const order = items.length > 0
      ? Math.max(...items.map(i => i.order ?? 0)) + 1
      : 1

    try {
      const newItem = {
        name,
        unit,
        categoryId: category.id,
        order
      }

      const docRef = await addDoc(collection(db, 'ingredients'), newItem)
      setItems(prev => sortByOrder([...prev, { id: docRef.id, ...newItem }]))
    } catch (err) {
      console.error('Ошибка при добавлении ингредиента:', err)
    }
  }

  return (
    <div className={styles.block}>
      <div className={styles.header} onClick={() => setOpen(prev => !prev)}>
        <h3>{category.name}</h3>
        <span>{open ? '−' : '+'}</span>
      </div>

      {open && (
        <div className={styles.content}>
          {items.map(item => (
            <ListItem key={item.id} name={item.name} secondary={item.unit} />
          ))}

          <div className={styles.actions}>
            <button onClick={handleAddProduct}>+ Добавить ингредиент</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryBlock
