// src/pages/Home.jsx
import ProductList from '../components/ProductList'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Sneaker Store 👟</h1>
      <ProductList />
    </div>
  )
}