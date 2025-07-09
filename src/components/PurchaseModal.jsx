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
import PurchaseItem from './PurchaseItem'
import { sortByOrder } from '@/utils/sortByOrder'

const PurchaseModal = ({ onClose, onSaved, existingPurchase }) => {
  const [productsGrouped, setProductsGrouped] = useState([])
  const [productsFlat, setProductsFlat] = useState([])
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnap = await getDocs(collection(db, 'product_categories'))
        const ingSnap = await getDocs(collection(db, 'ingredients'))

        const categories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const ingredients = ingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const sortedCategories = sortByOrder(categories)
        const sortedIngredients = sortByOrder(ingredients)

        // Flat product list for unit lookup
        const flatList = sortedIngredients.map(ing => ({
          id: ing.id,
          name: ing.name,
          unit: ing.unit
        }))
        setProductsFlat(flatList)

        // Grouped product list for dropdown
        const grouped = sortedCategories.map(cat => {
          const productsInCategory = sortByOrder(
            sortedIngredients.filter(ing => ing.categoryId === cat.id)
          )

          return {
            categoryId: cat.id,
            categoryName: cat.name,
            products: productsInCategory.map(ing => ({
              id: ing.id,
              name: ing.name
            }))
          }
        }).filter(group => group.products.length > 0)

        setProductsGrouped(grouped)
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (existingPurchase) {
      setItems([...existingPurchase.items, {}])
    } else {
      setItems([{}])
    }
  }, [existingPurchase])

  const handleLineChange = (index, updated) => {
    setItems(prev => {
      const copy = [...prev]
      copy[index] = updated

      const isLast = index === prev.length - 1
      const filled = updated.productId && updated.quantity > 0

      if (isLast && filled) {
        return [...copy, {}]
      }

      return copy
    })
  }

  const handleSave = async () => {
    const validItems = items.filter(i => i.productId && i.quantity > 0)

    if (validItems.length === 0) {
      alert('Добавьте хотя бы один продукт')
      return
    }

    setSaving(true)
    try {
      if (existingPurchase) {
        const ref = doc(db, 'purchases', existingPurchase.id)
        await updateDoc(ref, { items: validItems })
      } else {
        await addDoc(collection(db, 'purchases'), {
          date: Timestamp.now(),
          items: validItems
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

  const totalSum = items
    .filter(i => i.totalPrice && !isNaN(i.totalPrice))
    .reduce((sum, i) => sum + parseFloat(i.totalPrice), 0)
    .toFixed(2)

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.container}>
        <h2>{existingPurchase ? 'Редактировать закупку' : 'Новая закупка'}</h2>

        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
          {items.map((item, idx) => (
            <PurchaseItem
              key={idx}
              productsGrouped={productsGrouped}
              productsFlat={productsFlat}
              initialData={item}
              onChange={updated => handleLineChange(idx, updated)}
            />
          ))}
        </div>

        <div style={{
          textAlign: 'right',
          fontWeight: 'bold',
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          Общая сумма: {totalSum} €
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
