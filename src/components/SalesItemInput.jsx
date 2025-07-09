import { useEffect, useState } from 'react'

const SalesItemInput = ({ allDishes, allCombos, initialData = {}, onChange }) => {
  const [type, setType] = useState(initialData.type || 'dish')
  const [itemId, setItemId] = useState(initialData.itemId || '')
  const [quantity, setQuantity] = useState(initialData.quantity || '')

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
      <select value={type} onChange={e => {
        setType(e.target.value)
        setItemId('')
      }}>
        <option value="dish">Блюдо</option>
        <option value="combo">Комбо</option>
      </select>

      <select value={itemId} onChange={e => setItemId(e.target.value)}>
        <option value="">Выберите {type === 'dish' ? 'блюдо' : 'комбо'}</option>
        {(type === 'dish' ? allDishes : allCombos).map(i => (
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
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
