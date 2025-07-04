import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardLayout from '@/layout/DashboardLayout'

// Pages
import Home from '@/pages/Home'
import ProductsPage from '@/pages/ProductsPage'
import DishesPage from '@/pages/DishesPage'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'dishes', element: <DishesPage /> },
      { path: '*', element: <NotFound /> }, // catch-all inside layout
    ],
  },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
