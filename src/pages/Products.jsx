import BreadCrumbs from '../components/reusable/BreadCrumbs'
import ProductGallery from '../components/products/ProductGallery'
import ProductSummary from '../components/products/ProductSummary.jsx'
import ProductDescription from '../components/products/ProductDescription.jsx';
import { useParams } from 'react-router-dom';
import dataProductos from '../utils/dataProductos.js';

const Products = () => {
  const { slug } = useParams();
  const producto = dataProductos.find((p) => p.slug === slug);
  if (!producto) {
    return <h2>Producto no encontrado</h2>;
  }
  return (
    <main className='m-2'>
      <BreadCrumbs producto={producto} />
      <div className="dotgrid">
        <div className="wrapper flex gap-[20px] flex-col md992:flex-row justify-center">
          <ProductGallery producto={producto} />
          <ProductSummary producto={producto} />
        </div>
      </div>
      <ProductDescription producto={producto} />
    </main>
  );
};

export default Products;
