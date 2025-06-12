export default function BreadCrumbs() {
  return (
    <main>
        <div className="wrap">
            <div className="breadcrumb list-inline">
                <ul className="flex gap-[10px]">
                    <li><a href="">Home</a></li>
                    <li><a href="">Products</a></li>
                    <li><a href=""><span>Stilettos</span></a></li>
                </ul>
            </div>
        </div>
    </main>
  );
};