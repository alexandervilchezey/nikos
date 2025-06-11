export default function SearchFloat({ isSearchOpen, setIsSearchOpen }) {
  return (
    <div id="search-float" className={`search-float ${isSearchOpen ? 'active' : ''}`}>
      <div className="wide">
        <form className="search" action="">
          <i className='bx bx-search'></i>
          <input type="search" placeholder="Buscar Productos" />
          <i className='bx bx-x' onClick={() => setIsSearchOpen(false)}></i>
        </form>
      </div>
    </div>
  );
}
