import { useState, useEffect } from 'react'

const PurchaseItemDropdown = ({
  productsGrouped,
  productsFlat,
  onChange,
  initialData = {}
}) => {
  const [productId, setProductId] = useState(initialData.productId || '')
  const [quantity, setQuantity] = useState(initialData.quantity || '')
  const [pricePerUnit, setPricePerUnit] = useState(initialData.pricePerUnit || '')
  const [totalPrice, setTotalPrice] = useState(initialData.totalPrice || '')

  const selectedProduct = productsFlat.find(p => p.id === productId)
  const unit = selectedProduct?.unit || ''

  useEffect(() => {
    if (!productId) return

    onChange({
      productId,
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      totalPrice: parseFloat(totalPrice)
    })
  }, [productId, quantity, pricePerUnit, totalPrice])

  const handleSelect = e => setProductId(e.target.value)

  const handleQuantityChange = e => {
    const qty = e.target.value
    setQuantity(qty)

    const price = parseFloat(pricePerUnit)
    if (qty && price) {
      setTotalPrice((parseFloat(qty) * price).toFixed(2))
    }
  }

  const handlePriceChange = e => {
    const price = e.target.value
    setPricePerUnit(price)

    const qty = parseFloat(quantity)
    if (qty && price) {
      setTotalPrice((qty * parseFloat(price)).toFixed(2))
    }
  }

  const handleTotalChange = e => {
    const total = e.target.value
    setTotalPrice(total)

    const qty = parseFloat(quantity)
    if (qty && total) {
      setPricePerUnit((parseFloat(total) / qty).toFixed(2))
    }
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
      <select value={productId} onChange={handleSelect}>
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
              placeholder="Кол-во"
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '80px' }}
            />
            <span>{unit}</span>
          </div>

          <input
            type="number"
            placeholder="Цена"
            value={pricePerUnit}
            onChange={handlePriceChange}
            style={{ width: '100px' }}
          />

          <input
            type="number"
            placeholder="Итого"
            value={totalPrice}
            onChange={handleTotalChange}
            style={{ width: '100px' }}
          />
        </>
      )}
    </div>
  )
}

export default PurchaseItemDropdown
