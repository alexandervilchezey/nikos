import { useState } from 'react';

export default function MainCategorySelector({ options, initial, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initial);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="relative max-w-[150px] inline-block text-left">
      <h3
        className="opt-trigger cursor-pointer flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="value font-medium">{selected.nombre}</span>
        <i className="bx bx-chevron-down text-[20px]"></i>
      </h3>

      {isOpen && (
        <ul className="absolute mt-2 bg-white border border-gray-300 shadow-md z-10 min-w-[120px]">
          {options.map((option) => (
            <li key={option.id}
              className='text-[1rem]'
            >
              <button
                className={`tabbed-trigger px-4 py-2 block w-full text-left hover:bg-black hover:text-white ${
                  selected === option ? 'font-semibold bg-black text-white' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {option?.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
