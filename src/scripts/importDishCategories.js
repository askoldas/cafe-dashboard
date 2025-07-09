import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// ✅ Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDXkGMXK9DuKEutVS8piegeSy4VXwnYB-M',
  authDomain: 'cafe-dashboard-337fa.firebaseapp.com',
  projectId: 'cafe-dashboard-337fa',
  storageBucket: 'cafe-dashboard-337fa.appspot.com',
  messagingSenderId: '285955705042',
  appId: '1:285955705042:web:2470a77ac7751f72e4850b'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 🎯 Dish categories to import
const dishCategories = [
  { name: 'Закуски и салаты', order: 1 },
  { name: 'Супы', order: 2 },
  { name: 'Основные блюда', order: 3 },
  { name: 'Выпечка и десерты', order: 4 },
  { name: 'Напитки', order: 5 }
]

const importDishCategories = async () => {
  const colRef = collection(db, 'dish_categories')

  for (const category of dishCategories) {
    try {
      await addDoc(colRef, category)
      console.log(`✅ Added: ${category.name}`)
    } catch (err) {
      console.error(`❌ Failed to add ${category.name}:`, err)
    }
  }

  console.log('🎉 Dish category import complete.')
}

importDishCategories()


// node src/scripts/importDishCategories.js
