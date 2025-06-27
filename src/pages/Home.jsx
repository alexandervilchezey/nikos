import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import Banner from '../components/home/Banner';
import ProductsCarousel from '../components/home/ProductsCarousel';
import ProductsCategory from '../components/home/ProductsCategory';
import BrandsSection from '../components/home/BrandsSection';

const ordenUsuarios = ['Hombre', 'Mujer', 'Juvenil'];

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productosSnap = await getDocs(collection(db, 'productos'));
      const items = productosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(items);

      const filtrosSnap = await getDocs(collection(db, 'filtros'));
      const filtros = filtrosSnap.docs.map(doc => doc.data());

      const marcasFiltradas = filtros
        .filter(f => f.tipo === 'marca')
        .map(f => ({
          nombre: f.valor,
          imagen: f.imagen
        }));

      const usuariosFiltrados = ordenUsuarios
        .filter(u => filtros.some(f => f.tipo === 'usuario' && f.valor === u))
        .map(nombre => ({ nombre }));

      setMarcas(marcasFiltradas);
      setUsuarios(usuariosFiltrados);
    };

    fetchData();
  }, []);

  return (
    <>
      <Banner />
      <ProductsCarousel productos={productos} />
      <ProductsCategory productos={productos} usuarios={usuarios} />
      <BrandsSection marcas={marcas} />
    </>
  );
};

export default Home;
