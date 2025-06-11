// src/App.jsx
import './App.css'
import Banner from './components/Banner'
import Header from './components/Header'
import ProductsCarousel from './components/ProductsCarousel'
function App() {
  return (
    <div className="relative" style={{ minHeight: '100dvh' }}>
      <Header />
      <Banner />
      <ProductsCarousel />
    </div>
  )
}

export default App