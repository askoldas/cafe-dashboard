import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore'
import { db } from '@/firebase'
import DishIngredientItem from '@/components/DishIngredientItem'
import { sortByOrder } from '@/utils/sortByOrder'

const DishModal = ({ onClose, onSaved, existingDish, categoryId }) => {
  const [name, setName] = useState(existingDish?.name || '')
  const [portions, setPortions] = useState(existingDish?.portions || 1)
  const [ingredients, setIngredients] = useState(existingDish?.ingredients || [{}])
  const [productsFlat, setProductsFlat] = useState([])
  const [productsGrouped, setProductsGrouped] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const catSnap = await getDocs(collection(db, 'product_categories'))
      const ingSnap = await getDocs(collection(db, 'ingredients'))

      const categories = sortByOrder(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      const ingredients = sortByOrder(ingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      setProductsFlat(ingredients.map(i => ({
        id: i.id,
        name: i.name,
        unit: i.unit,
        price: i.basePrice
      })))

      setProductsGrouped(
        categories.map(cat => ({
          categoryId: cat.id,
          categoryName: cat.name,
          products: ingredients
            .filter(i => i.categoryId === cat.id)
            .map(i => ({ id: i.id, name: i.name }))
        })).filter(group => group.products.length > 0)
      )
    }

    fetchData()
  }, [])

  const handleIngredientChange = (index, updated) => {
    setIngredients(prev => {
      const copy = [...prev]
      copy[index] = updated

      const isLast = index === prev.length - 1
      const filled = updated.productId && updated.quantityPerPortion > 0

      if (isLast && filled) {
        return [...copy, {}]
      }

      return copy
    })
  }

  const handleSave = async () => {
    const validIngredients = ingredients.filter(i => i.productId && i.quantityPerPortion > 0)
    if (!name || validIngredients.length === 0) {
      alert('Введите название и добавьте хотя бы один ингредиент')
      return
    }

    setSaving(true)
    const dishData = {
      name,
      portions,
      categoryId,
      ingredients: validIngredients
    }

    try {
      if (existingDish) {
        const ref = doc(db, 'dishes', existingDish.id)
        await updateDoc(ref, dishData)
      } else {
        await addDoc(collection(db, 'dishes'), dishData)
      }

      onSaved()
    } catch (err) {
      console.error('Ошибка при сохранении блюда:', err)
      alert('Не удалось сохранить блюдо')
    } finally {
      setSaving(false)
    }
  }

  const getCostStats = () => {
    const total = ingredients.reduce((sum, i) => {
      const product = productsFlat.find(p => p.id === i.productId)
      if (!product || !i.quantityPerPortion || !product.price) return sum
      return sum + i.quantityPerPortion * product.price
    }, 0)

    const perPortion = portions > 0 ? (total / portions).toFixed(2) : '0.00'

    return {
      total: total.toFixed(2),
      perPortion
    }
  }

  const { total, perPortion } = getCostStats()

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.container}>
        <h2>{existingDish ? 'Редактировать блюдо' : 'Новое блюдо'}</h2>

        <input
          type="text"
          placeholder="Название блюда"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <input
          type="number"
          placeholder="Кол-во порций"
          value={portions}
          onChange={e => setPortions(parseInt(e.target.value) || 1)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
          {ingredients.map((ing, idx) => (
            <DishIngredientItem
              key={idx}
              productsGrouped={productsGrouped}
              productsFlat={productsFlat}
              initialData={ing}
              portions={portions}
              onChange={updated => handleIngredientChange(idx, updated)}
            />
          ))}
        </div>

        <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          Общая себестоимость: {total} €<br />
          Себестоимость одной порции: {perPortion} €
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} disabled={saving}>Отмена</button>
          <button onClick={handleSave} disabled={saving}>Сохранить</button>
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

export default DishModal
