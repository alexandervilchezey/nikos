export default function SelectField({
  name,
  label,
  options = [],
  register,
  required = false,
  error
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        {...register(name, {
          required: required && "Este campo es obligatorio",
        })}
        className={`border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Seleccione una opción</option>
        {options.map((opcion, index) => (
          <option key={index} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  );
}
