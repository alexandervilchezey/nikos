export default function InputField({
  name,
  label,
  register,
  required = false,
  type = "text",
  pattern,
  error
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        {...register(name, {
          required: required && "Este campo es obligatorio",
          pattern: pattern
        })}
        className={`border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  );
}
