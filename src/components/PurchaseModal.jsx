import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/firebase'
import PurchaseCategoryBlock from './PurchaseCategoryBlock'

const PurchaseModal = ({ onClose, onSaved, existingPurchase }) => {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState({})
  const [saving, setSaving] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'product_categories'))
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCategories(list)
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err)
      }
    }

    fetchCategories()
  }, [])

  // If editing, preload existing items
  useEffect(() => {
    if (existingPurchase) {
      const initialItems = {}
      existingPurchase.items.forEach(item => {
        initialItems[item.productId] = item
      })
      setItems(initialItems)
    }
  }, [existingPurchase])

  const handleProductChange = entry => {
    setItems(prev => ({
      ...prev,
      [entry.productId]: entry
    }))
  }

  const handleSave = async () => {
    const entries = Object.values(items).filter(i => i.quantity > 0)
    if (entries.length === 0) {
      alert('Добавьте хотя бы один продукт')
      return
    }

    setSaving(true)
    try {
      if (existingPurchase) {
        const ref = doc(db, 'purchases', existingPurchase.id)
        await updateDoc(ref, { items: entries })
      } else {
        await addDoc(collection(db, 'purchases'), {
          date: Timestamp.now(),
          items: entries
        })
      }

      onSaved()
      onClose()
    } catch (err) {
      console.error('Ошибка при сохранении закупки:', err)
      alert('Не удалось сохранить закупку')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.container}>
        <h2>{existingPurchase ? 'Редактировать закупку' : 'Новая закупка'}</h2>

        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
          {categories.map(cat => (
            <PurchaseCategoryBlock
              key={cat.id}
              category={cat}
              onProductChange={handleProductChange}
              existingItems={items}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} disabled={saving}>Отмена</button>
          <button onClick={handleSave} disabled={saving}>
            {existingPurchase ? 'Сохранить изменения' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  container: {
    background: 'white',
    borderRadius: '10px',
    padding: '2rem',
    width: '90%',
    maxWidth: '700px'
  }
}

export default PurchaseModal
