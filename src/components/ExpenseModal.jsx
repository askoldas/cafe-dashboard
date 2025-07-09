import { useEffect, useState } from 'react'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

const ExpenseModal = ({ onClose, onSaved, existingExpense }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (existingExpense) {
      setName(existingExpense.name || '')
      setAmount(existingExpense.amount || '')
      setDescription(existingExpense.description || '')
    }
  }, [existingExpense])

  const handleSave = async () => {
    if (!name || isNaN(parseFloat(amount))) {
      alert('Введите корректные данные')
      return
    }

    setSaving(true)
    const date = new Date()
    const timestamp = date.toISOString()
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    const data = {
      name,
      amount: parseFloat(amount),
      description,
      timestamp,
      monthYear
    }

    try {
      if (existingExpense) {
        const ref = doc(db, 'expenses', existingExpense.id)
        await updateDoc(ref, data)
      } else {
        await addDoc(collection(db, 'expenses'), data)
      }
      onSaved()
      onClose()
    } catch (err) {
      console.error('Ошибка при сохранении расхода:', err)
      alert('Не удалось сохранить расход')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.container}>
        <h2>{existingExpense ? 'Редактировать расход' : 'Новый расход'}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Сумма"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <textarea
            placeholder="Описание (необязательно)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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
    maxWidth: '500px'
  }
}

export default ExpenseModal
