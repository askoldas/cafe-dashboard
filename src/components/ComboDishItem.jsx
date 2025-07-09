import { useEffect, useState } from 'react'

const ComboDishItem = ({ allDishes, initialData = {}, onChange }) => {
  const [dishId, setDishId] = useState(initialData.dishId || '')
  const [portionMultiplier, setPortionMultiplier] = useState(initialData.portionMultiplier || 1)

  useEffect(() => {
    if (!dishId) return
    onChange({ dishId, portionMultiplier: parseFloat(portionMultiplier) })
  }, [dishId, portionMultiplier])

  const selectedDish = allDishes.find(d => d.id === dishId)

  const costPerPortion = (() => {
    if (!selectedDish || !Array.isArray(selectedDish.ingredients) || !selectedDish.portions) return 0

    const total = selectedDish.ingredients.reduce((sum, ing) => {
      const qty = parseFloat(ing.quantityPerPortion) || 0
      const price = parseFloat(ing.basePrice) || 0
      return sum + qty * price
    }, 0)

    return total / selectedDish.portions
  })()

  const totalLineCost = (costPerPortion * portionMultiplier).toFixed(2)

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
      <select value={dishId} onChange={e => setDishId(e.target.value)}>
        <option value="">Выберите блюдо</option>
        {allDishes.map(dish => (
          <option key={dish.id} value={dish.id}>{dish.name}</option>
        ))}
      </select>

      {dishId && (
        <>
          <input
            type="number"
            placeholder="Порций"
            value={portionMultiplier}
            onChange={e => setPortionMultiplier(e.target.value)}
            style={{ width: '100px' }}
          />
          <span>{portionMultiplier} × {costPerPortion.toFixed(2)} € = {totalLineCost} €</span>
        </>
      )}
    </div>
  )
}

export default ComboDishItem
