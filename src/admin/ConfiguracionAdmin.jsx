import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function ConfiguracionAdmin() {
  const [form, setForm] = useState({
    direccion: "",
    telefono: "",
    instagram: "",
    facebook: "",
    horario: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const ref = doc(db, "config", "datosFooter");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setForm(snap.data());
        }
      } catch (err) {
        console.error(err);
        setMensaje("❌ Error al cargar la configuración.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensaje("");
    setError(false);

    try {
      const whatsapp = `51${form.telefono}`;
      await setDoc(doc(db, "config", "datosFooter"), {
        direccion: form.direccion,
        instagram: form.instagram,
        facebook: form.facebook,
        horario: form.horario,
        telefono: form.telefono,
        whatsapp: whatsapp,
      });
      setMensaje("Cambios guardados correctamente.");
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar los cambios.");
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Cargando configuración...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded p-6 mt-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Configuración del Footer</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
        <FormField label="Teléfono (solo número sin código)" name="telefono" value={form.telefono} onChange={handleChange} />
        <FormField label="Instagram (URL)" name="instagram" value={form.instagram} onChange={handleChange} />
        <FormField label="Facebook (URL)" name="facebook" value={form.facebook} onChange={handleChange} />
        <FormField label="Horario de atención" name="horario" value={form.horario} onChange={handleChange} />

        {mensaje && (
          <div className={`text-sm font-medium ${error ? "text-red-600" : "text-green-600"}`}>
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}

function FormField({ label, name, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:ring-black/30"
      />
    </div>
  );
}
