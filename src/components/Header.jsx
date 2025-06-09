
import product01 from '../assets/images/product_01.jpg';
import product01b from '../assets/images/product_01b.jpg';
import { useState } from 'react';


export default function Header() {
const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div id="page" className="page-home">
        <header>
            <div className="inner-header">
                <div className="wide">
                    <div className="wrap">
                        <div className="header-left">
                            <div className="menu-bar">
                                <a href="#0" className="flex md992:hidden menu-trigger">
                                    <i className='bx bx-menu'></i>
                                </a>
                            </div>
                            <div className="hidden md992:block list-inline">
                                <ul className="list-none">
                                    <li>
                                        <a href="">
                                            <i className='bx bx-user'></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="header-center">
                            <nav className="hidden md992:grid menu">
                                <ul className="list-none">
                                    <li><a className='link-menu' href="/">Inicio</a></li>
                                    <li>
                                        <a className='link-menu' href="/products">Productos
                                            <i className='bx bx-caret-down'></i>
                                        </a>
                                        <ul className="sub-mega">
                                            <li>
                                                <div className="wrapper">
                                                    <div className="mega-content">
                                                        <div className="dotgrid">
                                                            <div className="wrapper">
                                                                <div className="item">
                                                                    <div className="dot-images">
                                                                        <a href="" className="product-permalink"></a>
                                                                        <div className="thumbnail">
                                                                            <img src={product01} alt="" />
                                                                        </div>
                                                                        <div className="thumbnail hover">
                                                                            <img src={product01b} alt="" />
                                                                        </div>
                                                                        <div className="actions">
                                                                            <ul>
                                                                                <li><a href=""><i className='bx bx-eye'></i></a></li>
                                                                            </ul>
                                                                        </div>
                                                                        <div className="label"><span>25%</span></div>
                                                                    </div>
                                                                    <div className="dot-info">
                                                                        <h2 className="dot-title"><a href="">The new Shoes</a></h2>
                                                                        <div className="product-price">
                                                                            <span className="before">$62.00</span>
                                                                            <span className="current">$46.50</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="item">
                                                                    <div className="dot-images">
                                                                        <a href="" className="product-permalink"></a>
                                                                        <div className="thumbnail">
                                                                            <img src={product01} alt="" />
                                                                        </div>
                                                                        <div className="actions">
                                                                            <ul>
                                                                                <li><a href=""><i className='bx bx-expand-left'></i> </a></li>
                                                                                <li><a href=""><i className='bx bx-eye'></i></a></li>
                                                                            </ul>
                                                                        </div>
                                                                        <div className="label"><span>25%</span></div>
                                                                    </div>
                                                                    <div className="dot-info">
                                                                        <h2 className="dot-title"><a href="">The new Shoes</a></h2>
                                                                        <div className="product-price">
                                                                            <span className="before">$62.00</span>
                                                                            <span className="current">$46.50</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="item">
                                                                    <div className="dot-images">
                                                                        <a href="" className="product-permalink"></a>
                                                                        <div className="thumbnail">
                                                                            <img src={product01} alt="" />
                                                                        </div>
                                                                        <div className="actions">
                                                                            <ul>
                                                                                <li><a href=""><i className='bx bx-chevrons-left-right'></i></a></li>
                                                                                <li><a href=""><i className='bx bx-eye'></i></a></li>
                                                                            </ul>
                                                                        </div>
                                                                        <div className="label"><span>25%</span></div>
                                                                    </div>
                                                                    <div className="dot-info">
                                                                        <h2 className="dot-title"><a href="">The new Shoes</a></h2>
                                                                        <div className="product-price">
                                                                            <span className="before">$62.00</span>
                                                                            <span className="current">$46.50</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="links">
                                                            <div className="list-block">
                                                                <h3 className="dot-title">Aparel</h3>
                                                                <ul>
                                                                    <li><a href="">Nike</a></li>
                                                                    <li><a href="">Adidas</a></li>
                                                                    <li><a href="">Reebok</a></li>
                                                                    <li><a href="">Puma</a></li>
                                                                </ul>
                                                            </div>
                                                            <div className="list-block">
                                                                <h3 className="dot-title">Aparel</h3>
                                                                <ul>
                                                                    <li><a href="">Nike</a></li>
                                                                    <li><a href="">Adidas</a></li>
                                                                    <li><a href="">Reebok</a></li>
                                                                    <li><a href="">Puma</a></li>
                                                                </ul>
                                                            </div>
                                                            <div className="list-block">
                                                                <h3 className="dot-title">Aparel</h3>
                                                                <ul>
                                                                    <li><a href="">Nike</a></li>
                                                                    <li><a href="">Adidas</a></li>
                                                                    <li><a href="">Reebok</a></li>
                                                                    <li><a href="">Puma</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul className="list-none">
                                    <li><a className='link-menu' href="/about">Nosotros</a></li>
                                    <li><a className='link-menu' href="/contact">Contacto</a></li>
                                </ul>
                            </nav>
                            <div className='logoNikos'><a href="">Nikos</a></div>
                        </div>
                        <div className="header-right">
                            <div className="list-inline">
                                <ul className="list-none">
                                    <li><a href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }}><i className='bx bx-search'></i> </a></li>
                                    <li><a href=""> <i className='bx bx-cart'></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="search-float" className={`search-float ${isSearchOpen ? 'active' : ''}`}>
                    <div className="wide">
                        <form className="search" action="">
                            <i className='bx bx-search'></i>
                            <input type="search" name="" id="" placeholder="Buscar Productos" />
                            <i className='bx bx-x' onClick={() => setIsSearchOpen(false)}></i> 
                        </form>
                    </div>
                </div>
            </div>
        </header>
        <div className={`overlay ${isSearchOpen ? 'active' : ''}`}></div>
        <div id="mobile-menu" className="mobile-menu">
            <div className="wrap">
                <a href="" className='close-trigger'>
                    <i className='bx bx-x'></i>
                </a>
                <div className="main-menu">
                    <nav>
                        <ul>
                            <li><a href=""><span>Inicio</span></a></li>
                            <li className='has-child'>
                                <a href="">
                                    <span>Productos</span>
                                    <i className='bx bx-caret-down'></i>
                                </a>
                                <ul className="sub-menu-list-block">
                                    <li><a href="">Adidas</a></li>
                                    <li><a href="">Nike</a></li>
                                    <li><a href="">Reebok</a></li>
                                    <li><a href="">Puma</a></li>
                                    <li><a href="">DC</a></li>
                                    <li><a href="">Adidas</a></li>
                                    <li><a href="">Nike</a></li>
                                    <li><a href="">Reebok</a></li>
                                    <li><a href="">Puma</a></li>
                                    <li><a href="">DC</a></li>
                                </ul>
                            </li>
                            <li><a href=""><span>Nosotros</span></a></li>
                            <li><a href=""><span>Contacto</span></a></li>
                        </ul>
                    </nav>
                    <div className="button">
                        <a href="" className="secondary-btn">Iniciar Sesion</a>
                        <a href="" className="primary-btn">Registrar</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
