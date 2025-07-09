import { useEffect, useState } from 'react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import CategoryBlock from '@/components/CategoryBlock'
import { sortByOrder } from '@/utils/sortByOrder'
import styles from './ProductPage.module.scss'

const ProductsPage = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'product_categories'))
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCategories(sortByOrder(list))
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }

    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    const name = prompt('Введите название категории:')
    if (!name) return

    const order = categories.length > 0
      ? Math.max(...categories.map(c => c.order ?? 0)) + 1
      : 1

    try {
      const docRef = await addDoc(collection(db, 'product_categories'), {
        name,
        order
      })
      setCategories(prev => sortByOrder([...prev, { id: docRef.id, name, order }]))
    } catch (err) {
      console.error('Ошибка при добавлении категории:', err)
    }
  }

  return (
    <div>
      <h2>Ингредиенты</h2>
      <p>Категории и список ингредиентов</p>

      {categories.map(category => (
        <CategoryBlock key={category.id} category={category} />
      ))}

      <div className={styles.actions}>
        <button onClick={handleAddCategory}>+ Добавить категорию</button>
      </div>
    </div>
  )
}

export default ProductsPage
