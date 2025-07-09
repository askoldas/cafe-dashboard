import { useEffect, useState } from 'react'
import { addDoc, updateDoc, doc, collection, Timestamp, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import SalesItemInput from './SalesItemInput'

const SalesModal = ({ onClose, onSaved, existingSale }) => {
  const [date, setDate] = useState(existingSale?.date?.toDate().toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10))
  const [kitchen, setKitchen] = useState(existingSale?.kitchen || [{}])
  const [bar, setBar] = useState(existingSale?.bar || [{}])
  const [takeaway, setTakeaway] = useState(existingSale?.takeaway || [{}])
  const [dishes, setDishes] = useState([])
  const [combos, setCombos] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const dishSnap = await getDocs(collection(db, 'dishes'))
      const comboSnap = await getDocs(collection(db, 'combos'))
      setDishes(dishSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setCombos(comboSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    loadData()
  }, [])

  const handleChange = (setter) => (index, item) => {
    setter(prev => {
      const copy = [...prev]
      copy[index] = item
      const isLast = index === prev.length - 1
      const filled = item.itemId && item.quantity > 0
      if (isLast && filled) copy.push({})
      return copy
    })
  }

  const prepareItems = (items) => {
    return items.filter(i => i.itemId && i.quantity > 0)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      date: Timestamp.fromDate(new Date(date)),
      kitchen: prepareItems(kitchen),
      bar: prepareItems(bar),
      takeaway: prepareItems(takeaway)
    }

    try {
      if (existingSale) {
        const ref = doc(db, 'sales', existingSale.id)
        await updateDoc(ref, payload)
      } else {
        await addDoc(collection(db, 'sales'), payload)
      }
      onSaved()
      onClose()
    } catch (err) {
      console.error('Ошибка при сохранении продажи:', err)
      alert('Не удалось сохранить продажу')
    } finally {
      setSaving(false)
    }
  }

  const renderSection = (title, data, setter) => (
    <div style={{ marginTop: '1.5rem' }}>
      <h3>{title}</h3>
      {data.map((item, idx) => (
        <SalesItemInput
          key={idx}
          allDishes={dishes}
          allCombos={combos}
          initialData={item}
          onChange={(updated) => handleChange(setter)(idx, updated)}
        />
      ))}
    </div>
  )

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.container}>
        <h2>{existingSale ? 'Редактировать продажу' : 'Новая продажа'}</h2>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Дата:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        {renderSection('Кухня', kitchen, setKitchen)}
        {renderSection('Бар', bar, setBar)}
        {renderSection('Навынос', takeaway, setTakeaway)}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={onClose} disabled={saving}>Отмена</button>
          <button onClick={handleSave} disabled={saving}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  container: {
    background: 'white',
    borderRadius: '10px',
    padding: '2rem',
    width: '90%',
    maxWidth: '700px'
  }
}

export default SalesModal