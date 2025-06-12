import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout'
import Home from './pages/Home'
import Products from './pages/Products';
function App() {
  return (
    <div className="relative" style={{ minHeight: '100dvh' }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Products />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App