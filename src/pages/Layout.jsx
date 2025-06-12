import { Outlet } from 'react-router-dom';
import Header from '../components/reusable/Header'
import Footer from '../components/reusable/Footer'
export default function Layout() {
  return (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
  );
}