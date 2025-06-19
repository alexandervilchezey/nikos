import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import Banner from '../components/home/Banner';
import ProductsCarousel from '../components/home/ProductsCarousel';
import ProductsCategory from '../components/home/ProductsCategory';
import BrandsSection from '../components/home/BrandsSection';

const Home = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'));
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(items);
    };
    fetchProductos();
  }, []);

  return (
    <>
      <Banner />
      <ProductsCarousel productos={productos} />
      <ProductsCategory productos={productos} />
      <BrandsSection />
    </>
  );
};

export default Home;
