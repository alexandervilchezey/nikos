import { useAuth } from "../../hooks/useAuth";
import HeaderUserMenu from "./HeaderMenu";

export default function HeaderLeft({ setIsMobileMenuOpen }) {
  const { user } = useAuth();
  return (
    <div className="header-left">
      <div className="menu-bar">
        <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(true); }} className="flex md992:hidden menu-trigger">
          <i className='bx bx-menu'></i>
        </a>
      </div>
      <div className="hidden md992:block list-inline">
        <ul className="list-none">
          <li className="hidden md992:flex">
            {user ? (
              <HeaderUserMenu />
            ) : (
              <a href="/login">
                <i className='cursor-pointer bx bx-user'></i>
              </a>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
