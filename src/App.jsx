// src/App.jsx
import './App.css'
import Banner from './components/Banner'
import Header from './components/Header'
// import ProductList from './components/ProductList'
function App() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Banner/>
      {/* <ProductList /> */}
    </div>
  )
}

export default App