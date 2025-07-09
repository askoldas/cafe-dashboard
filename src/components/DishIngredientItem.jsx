import { useEffect, useState } from 'react'

const DishIngredientItem = ({
  productsGrouped,
  productsFlat,
  initialData = {},
  portions,
  onChange
}) => {
  const [productId, setProductId] = useState(initialData.productId || '')
  const [quantity, setQuantity] = useState(initialData.quantityPerPortion || '')

  const selectedProduct = productsFlat.find(p => p.id === productId)
  const unit = selectedProduct?.unit || ''
  const price = selectedProduct?.price || 0
  const total = (quantity && portions && price)
    ? (quantity * price ).toFixed(2)
    : ''

  useEffect(() => {
    if (!productId) return
    onChange({
      productId,
      quantityPerPortion: parseFloat(quantity)
    })
  }, [productId, quantity])

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
      <select value={productId} onChange={e => setProductId(e.target.value)}>
        <option value="">Выберите продукт</option>
        {productsGrouped.map(group => (
          <optgroup key={group.categoryId} label={group.categoryName}>
            {group.products.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </optgroup>
        ))}
      </select>

      {productId && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <input
              type="number"
              placeholder="Кол-во на порцию"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={{ width: '100px' }}
            />
            <span>{unit}</span>
          </div>
          <div style={{ minWidth: '100px' }}>~ {total} €</div>
        </>
      )}
    </div>
  )
}

export default DishIngredientItem