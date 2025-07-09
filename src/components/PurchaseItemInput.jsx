import { useState, useEffect } from 'react'

const PurchaseItemInput = ({ product, onChange, initialValues = {} }) => {
    const [quantity, setQuantity] = useState(initialValues.quantity || '')
    const [unitPrice, setUnitPrice] = useState(initialValues.unitPrice || '')
    const [totalValue, setTotalValue] = useState(initialValues.totalValue || '')
    const [lastChanged, setLastChanged] = useState(null)


    // Sync recalculated field
    useEffect(() => {
        const qty = parseFloat(quantity)
        const price = parseFloat(unitPrice)
        const total = parseFloat(totalValue)

        if (lastChanged === 'quantity' && !isNaN(qty) && !isNaN(unitPrice)) {
            setTotalValue((qty * unitPrice).toFixed(2))
        } else if (lastChanged === 'unitPrice' && !isNaN(quantity) && !isNaN(price)) {
            setTotalValue((quantity * price).toFixed(2))
        } else if (lastChanged === 'totalValue' && !isNaN(quantity) && quantity !== 0 && !isNaN(total)) {
            setUnitPrice((total / quantity).toFixed(2))
        }
    }, [quantity, unitPrice, totalValue, lastChanged])

    // Bubble changes up
    useEffect(() => {
        onChange({
            productId: product.id,
            quantity: parseFloat(quantity) || 0,
            unitPrice: parseFloat(unitPrice) || 0,
            totalValue: parseFloat(totalValue) || 0
        })
    }, [quantity, unitPrice, totalValue])

    return (
        <div style={{ marginBottom: '1rem' }}>
            <strong>{product.name}</strong>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <input
                    type="number"
                    placeholder="Количество"
                    value={quantity}
                    onChange={e => {
                        setQuantity(e.target.value)
                        setLastChanged('quantity')
                    }}
                />
                <input
                    type="number"
                    placeholder="Цена за ед."
                    value={unitPrice}
                    onChange={e => {
                        setUnitPrice(e.target.value)
                        setLastChanged('unitPrice')
                    }}
                />
                <input
                    type="number"
                    placeholder="Сумма"
                    value={totalValue}
                    onChange={e => {
                        setTotalValue(e.target.value)
                        setLastChanged('totalValue')
                    }}
                />
            </div>
        </div>
    )
}

export default PurchaseItemInput
