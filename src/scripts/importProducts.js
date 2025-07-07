import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc
} from 'firebase/firestore'

// ✅ Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDXkGMXK9DuKEutVS8piegeSy4VXwnYB-M',
  authDomain: 'cafe-dashboard-337fa.firebaseapp.com',
  projectId: 'cafe-dashboard-337fa',
  storageBucket: 'cafe-dashboard-337fa.appspot.com',
  messagingSenderId: '285955705042',
  appId: '1:285955705042:web:2470a77ac7751f72e4850b',
  measurementId: 'G-FE2VRQZRRZ'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 🧾 Load the confirmed, properly sorted data
import productData from './productData.json' assert { type: 'json' }

const getCategoryIdBySlug = async (slug) => {
  const q = query(
    collection(db, 'product_categories'),
    where('slug', '==', slug)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    throw new Error(`❌ Category not found for slug: ${slug}`)
  }
  return snapshot.docs[0].id
}

const importProducts = async () => {
  const colRef = collection(db, 'ingredients')

  for (const categorySlug in productData) {
    const categoryId = await getCategoryIdBySlug(categorySlug)
    const products = productData[categorySlug]

    for (const product of products) {
      try {
        await addDoc(colRef, {
          name: product.name,
          unit: product.unit,
          categoryId,
          basePrice: product.basePrice,
          order: product.order
        })
        console.log(`✅ Added: ${product.name} → ${categorySlug}`)
      } catch (err) {
        console.error(`❌ Failed: ${product.name}`, err)
      }
    }
  }

  console.log('🎉 Product import complete.')
}

importProducts()



// node src/scripts/importProducts.js