import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore' // ✅ Add this

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
const analytics = getAnalytics(app)

// ✅ Manually initialize Firestore
const db = getFirestore(app)

// ✅ Now you can export all
export { app, analytics, db }
