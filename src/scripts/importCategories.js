import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// ✅ Firebase config (your actual project)
const firebaseConfig = {
  apiKey: 'AIzaSyDXkGMXK9DuKEutVS8piegeSy4VXwnYB-M',
  authDomain: 'cafe-dashboard-337fa.firebaseapp.com',
  projectId: 'cafe-dashboard-337fa',
  storageBucket: 'cafe-dashboard-337fa.appspot.com',
  messagingSenderId: '285955705042',
  appId: '1:285955705042:web:2470a77ac7751f72e4850b',
  measurementId: 'G-FE2VRQZRRZ' // Not used in Node scripts
}

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Category list with slugs and order
const categories = [
  { name: 'Овощи и фрукты', slug: 'fruits-veg', order: 1 },
  { name: 'Мясо и птица', slug: 'meat', order: 2 },
  { name: 'Рыба и морепродукты', slug: 'seafood', order: 3 },
  { name: 'Молочные продукты', slug: 'dairy', order: 4 },
  { name: 'Хлеб и выпечка', slug: 'bakery', order: 5 },
  { name: 'Крупы, макароны и бобовые', slug: 'grains', order: 6 },
  { name: 'Замороженные продукты', slug: 'frozen', order: 7 },
  { name: 'Масла и жиры', slug: 'oils', order: 8 },
  { name: 'Напитки', slug: 'drinks', order: 9 },
  { name: 'Кондитерские изделия', slug: 'sweets', order: 10 },
  { name: 'Специи и приправы', slug: 'spices', order: 11 },
  { name: 'Орехи и сухофрукты', slug: 'nuts-dried', order: 12 },
  { name: 'Соусы и маринады', slug: 'sauces', order: 13 },
  { name: 'Упаковочные материалы', slug: 'packaging', order: 14 },
  { name: 'Хозяйственные товары', slug: 'household', order: 15 }
]

const importCategories = async () => {
  const colRef = collection(db, 'product_categories')

  for (const category of categories) {
    try {
      await addDoc(colRef, category)
      console.log(`✅ Added: ${category.name} (${category.slug})`)
    } catch (err) {
      console.error(`❌ Failed to add ${category.name}:`, err)
    }
  }

  console.log('🎉 Category import complete.')
}

importCategories()






// node src/scripts/importCategories.js


