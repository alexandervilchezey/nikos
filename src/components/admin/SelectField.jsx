import { Controller } from 'react-hook-form';
import Select from 'react-select';

export default function SelectField({ name, label, control, options, errors, isMulti = false, rules = {} }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            isMulti={isMulti}
            options={options}
            placeholder={label}
            classNamePrefix="react-select"
          />
        )}
      />
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}
