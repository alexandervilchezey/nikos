import { useAuth } from "../../hooks/useAuth";

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
          <li className={user? "w-[280px]" : 'w-[170px]'}></li>
        </ul>
      </div>
    </div>
  );
}
