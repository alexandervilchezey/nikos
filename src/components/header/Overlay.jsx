export default function Overlay({ isActive }) {
  return <div className={`overlay ${isActive ? 'active' : ''}`}></div>;
}