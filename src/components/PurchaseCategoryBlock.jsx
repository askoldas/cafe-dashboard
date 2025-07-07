import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import PurchaseItemInput from './PurchaseItemInput'

const PurchaseCategoryBlock = ({ category, onProductChange, existingItems }) => {
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || products.length > 0) return

        const fetchProducts = async () => {
            setLoading(true)
            try {
                const q = query(
                    collection(db, 'ingredients'),
                    where('categoryId', '==', category.id)
                )
                const snapshot = await getDocs(q)
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setProducts(items)
            } catch (err) {
                console.error('Ошибка при загрузке ингредиентов:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [open, category.id, products.length])

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <div
                onClick={() => setOpen(prev => !prev)}
                style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: '0.5rem',
                    background: '#f9f9f9',
                    borderRadius: '6px'
                }}
            >
                {category.name} {open ? '▲' : '▼'}
            </div>

            {open && (
                <div style={{ marginTop: '1rem' }}>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        products.map(product => (
                            <PurchaseItemInput
                                key={product.id}
                                product={product}
                                initialValues={existingItems[product.id]}
                                onChange={onProductChange}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default PurchaseCategoryBlock
