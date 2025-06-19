import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import BreadCrumbs from '../components/reusable/BreadCrumbs';
import ProductGallery from '../components/products/ProductGallery';
import ProductSummary from '../components/products/ProductSummary.jsx';
import ProductDescription from '../components/products/ProductDescription.jsx';

const Products = () => {
  const { slug } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const productosRef = collection(db, 'productos');
        const q = query(productosRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setProducto({ id: doc.id, ...doc.data() });
        } else {
          setProducto(null);
        }
      } catch (error) {
        console.error('Error al obtener el producto por slug:', error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Cargando producto...</p>;
  if (!producto) return <h2 className="text-center mt-10">Producto no encontrado</h2>;

  return (
    <main className="m-2">
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
