import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import DishCategoryBlock from '@/components/DishCategoryBlock'
import { sortByOrder } from '@/utils/sortByOrder'

const DishesPage = () => {
  const [categories, setCategories] = useState([])
  const [reloadTrigger, setReloadTrigger] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'dish_categories'))
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCategories(sortByOrder(list))
      } catch (err) {
        console.error('Failed to load dish categories:', err)
      }
    }

    fetchCategories()
  }, [reloadTrigger])

  const handleReload = () => setReloadTrigger(prev => !prev)

  return (
    <div>
      <h2>Блюда</h2>
      <p>Категории и список блюд</p>

      {categories.map(category => (
        <DishCategoryBlock
          key={category.id}
          category={category}
          onReload={handleReload}
        />
      ))}
    </div>
  )
}

export default DishesPage
