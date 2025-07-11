import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from '@/router'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
)
