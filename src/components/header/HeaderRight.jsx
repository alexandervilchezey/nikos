export default function HeaderRight({ setIsSearchOpen }) {
  return (
    <div className="header-right">
      <div className="list-inline">
        <ul className="list-none">
          <li><a href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }}><i className='bx bx-search'></i></a></li>
          <li><a href=""><i className='bx bx-cart'></i></a></li>
        </ul>
      </div>
    </div>
  );
}
