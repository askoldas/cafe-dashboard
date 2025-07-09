import { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import ComboDishItem from '@/components/ComboDishItem'

const ComboModal = ({ onClose, onSaved, existingCombo }) => {
  const [name, setName] = useState(existingCombo?.name || '')
  const [dishes, setDishes] = useState(existingCombo?.dishes || [{}])
  const [allDishes, setAllDishes] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dishesSnap = await getDocs(collection(db, 'dishes'))
        const ingredientsSnap = await getDocs(collection(db, 'ingredients'))

        const ingredientMap = {}
        ingredientsSnap.docs.forEach(doc => {
          const data = doc.data()
          ingredientMap[doc.id] = data.basePrice || 0
        })

        const dishesList = dishesSnap.docs.map(doc => {
          const dish = doc.data()
          const enrichedIngredients = (dish.ingredients || []).map(i => ({
            ...i,
            basePrice: ingredientMap[i.productId] || 0
          }))

          return {
            id: doc.id,
            ...dish,
            ingredients: enrichedIngredients
          }
        })

        setAllDishes(dishesList)
      } catch (err) {
        console.error('Ошибка при загрузке данных для комбо:', err)
      }
    }

    fetchData()
  }, [])

  const handleDishChange = (index, updated) => {
    setDishes(prev => {
      const copy = [...prev]
      copy[index] = updated

      const isLast = index === prev.length - 1
      const filled = updated.dishId && updated.portionMultiplier > 0

      if (isLast && filled) {
        return [...copy, {}]
      }

      return copy
    })
  }

  const handleSave = async () => {
    const validDishes = dishes.filter(i => i.dishId && i.portionMultiplier > 0)
    if (!name || validDishes.length === 0) {
      alert('Введите название и добавьте хотя бы одно блюдо')
      return
    }

    setSaving(true)
    try {
      if (existingCombo) {
        const ref = doc(db, 'combos', existingCombo.id)
        await updateDoc(ref, { name, dishes: validDishes })
      } else {
        await addDoc(collection(db, 'combos'), { name, dishes: validDishes })
      }
      onSaved()
    } catch (err) {
      console.error('Ошибка при сохранении комбо:', err)
      alert('Не удалось сохранить комбо')
    } finally {
      setSaving(false)
    }
  }

  const getTotalCost = () => {
    return dishes.reduce((sum, i) => {
      const dish = allDishes.find(d => d.id === i.dishId)
      if (!dish || !i.portionMultiplier || !Array.isArray(dish.ingredients) || !dish.portions) return sum

      const totalCost = dish.ingredients.reduce((acc, ing) => {
        const price = parseFloat(ing.basePrice) || 0
        const qty = parseFloat(ing.quantityPerPortion) || 0
        return acc + qty * price
      }, 0)

      const costPerPortion = totalCost / dish.portions

      return sum + (costPerPortion * i.portionMultiplier)
    }, 0).toFixed(2)
  }

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.container}>
        <h2>{existingCombo ? 'Редактировать комбо' : 'Новое комбо'}</h2>

        <input
          type="text"
          placeholder="Название комбо"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
          {dishes.map((item, idx) => (
            <ComboDishItem
              key={idx}
              allDishes={allDishes}
              initialData={item}
              onChange={updated => handleDishChange(idx, updated)}
            />
          ))}
        </div>

        <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          Общая себестоимость комбо: {getTotalCost()} €
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

export default ComboModal
