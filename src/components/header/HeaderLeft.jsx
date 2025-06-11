export default function HeaderLeft({ setIsMobileMenuOpen }) {
  return (
    <div className="header-left">
      <div className="menu-bar">
        <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(true); }} className="flex md992:hidden menu-trigger">
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
  );
}
