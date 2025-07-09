import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const SalesItemInput = ({ allDishes, allCombos, initialData = {}, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(() => {
    if (initialData.type && initialData.itemId) {
      return `${initialData.type}:${initialData.itemId}`
    }
    return ''
  })
  const [quantity, setQuantity] = useState(initialData.quantity || '')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const snap = await getDocs(collection(db, 'dish_categories'))
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCategories(list)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    console.log('--- DEBUG DISH CATEGORY MATCHING ---')
    allDishes.forEach(d => {
      const raw = d.categoryId
      const interpreted = typeof raw === 'string' ? raw : raw?.id
      console.log('Dish:', d.name, '| categoryId:', raw, '| interpreted:', interpreted)
    })

    console.log('--- AVAILABLE CATEGORIES ---')
    categories.forEach(c => {
      console.log('Category:', c.name, '| id:', c.id)
    })
  }, [allDishes, categories])

  const [type, itemId] = selectedValue.split(':')
  const selectedItem =
    type === 'dish' ? allDishes.find(d => d.id === itemId) : allCombos.find(c => c.id === itemId)

  const getDishCost = (dish) => {
    if (!dish || !dish.ingredients || !dish.portions) return 0
    return dish.ingredients.reduce((sum, ing) => {
      const qty = parseFloat(ing.quantityPerPortion) || 0
      const price = parseFloat(ing.basePrice) || 0
      return sum + qty * price
    }, 0) / dish.portions
  }

  const getComboCost = (combo) => {
    if (!combo || !combo.dishes || !Array.isArray(combo.dishes)) return 0
    return combo.dishes.reduce((sum, entry) => {
      const dish = allDishes.find(d => d.id === entry.dishId)
      const cost = getDishCost(dish)
      return sum + cost * (entry.portionMultiplier || 1)
    }, 0)
  }

  const unitPrice = type === 'dish' ? getDishCost(selectedItem) : getComboCost(selectedItem)
  const totalValue = unitPrice * (parseFloat(quantity) || 0)

  useEffect(() => {
    if (!itemId || !quantity) return
    onChange({ type, itemId, quantity: parseFloat(quantity), unitPrice, totalValue })
  }, [type, itemId, quantity])

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
      <select
        value={selectedValue}
        onChange={e => setSelectedValue(e.target.value)}
        style={{ minWidth: '200px' }}
      >
        <option value="">Выберите блюдо или комбо</option>

        {categories.map(cat => {
          const dishesInCat = allDishes.filter(d => {
            const catId = typeof d.categoryId === 'string'
              ? d.categoryId
              : d.categoryId?.id
            return catId === cat.id
          })

          console.log(`Category ${cat.name} (${cat.id}) matched dishes:`, dishesInCat.map(d => d.name))

          if (dishesInCat.length === 0) {
            console.log(`No matches for category "${cat.name}"`)
            return null
          }

          return (
            <optgroup key={cat.id} label={cat.name}>
              {dishesInCat.map(d => (
                <option key={d.id} value={`dish:${d.id}`}>{d.name}</option>
              ))}
            </optgroup>
          )
        })}

        {allCombos.length > 0 && (
          <optgroup label="Комбо">
            {allCombos.map(c => (
              <option key={c.id} value={`combo:${c.id}`}>{c.name}</option>
            ))}
          </optgroup>
        )}
      </select>

      <input
        type="number"
        placeholder="Кол-во"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        style={{ width: '80px' }}
      />

      {itemId && (
        <span>
          {unitPrice.toFixed(2)} € × {quantity || 0} = {totalValue.toFixed(2)} €
        </span>
      )}
    </div>
  )
}

export default SalesItemInput
