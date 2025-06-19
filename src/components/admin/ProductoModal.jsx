import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { generarSlugUnico } from '../../utils/generalFunctions';
import SelectField from './SelectField';

const opciones = (arr) => arr.map((el) => ({ value: el, label: el }));
const USOS = opciones(['Urbano', 'Deportivo', 'Casual', 'Formal']);
const CATEGORIAS = opciones(['Zapatillas', 'Botas', 'Sandalias', 'Tacones']);
const MATERIALES = opciones(['Cuero', 'Sintético', 'Lona', 'Malla']);
const ORIGENES = opciones(['Nacional', 'Importado']);
const MARCAS = opciones(['Nike', 'Adidas', 'Puma']);
const USUARIOS = opciones(['Hombre', 'Mujer', 'Niño/a', 'Juvenil', 'Bebé']);

const transformarOpciones = (arr) => (Array.isArray(arr) ? arr.map(el => ({ value: el, label: el })) : []);
const transformarOpcion = (obj) => (obj ? { value: obj, label: obj } : null);

export default function ProductoModal({ isOpen, onClose, editarProducto }) {
  const [imagenes, setImagenes] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [variantes, setVariantes] = useState([]);
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
  if (!isOpen) return;

  if (editarProducto) {
    reset({
      ...editarProducto,
      tipoCalzado: transformarOpcion(editarProducto.tipoCalzado),
      material: transformarOpciones(editarProducto.material),
      uso: transformarOpciones(editarProducto.uso),
      origen: transformarOpciones(editarProducto.origen),
      marca: transformarOpcion(editarProducto.marca),
      usuario: transformarOpcion(editarProducto.usuario),
    });
    setPreviewUrls(editarProducto.imagenes || []);
    setVariantes(editarProducto.variantes || []);
    setEtiquetas(editarProducto.etiquetas || []);
  } else {
    reset({
      nombre: '',
      descripcion: '',
      precio: '',
      precioDescuento: '',
      precioMayorista: '',
      tipoCalzado: null,
      material: [],
      uso: [],
      origen: [],
      marca: null,
      usuario: null,
    });
    setPreviewUrls([]);
    setVariantes([]);
    setEtiquetas([]);
  }

  setImagenes([]);
}, [isOpen, editarProducto, reset]);


  // ================= IMAGENES =================
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file && previewUrls.length < 9) {
      setImagenes([...imagenes, file]);
      setPreviewUrls([...previewUrls, URL.createObjectURL(file)]);
    }
    e.target.value = '';
  };

  const subirImagenACloudinary = async (file) => {
    const url = 'https://api.cloudinary.com/v1_1/ddebdvfcg/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nikosperu_preset');

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  const subirImagenesYObtenerURLs = async () => {
    const urls = [];
    for (const imagen of imagenes) {
      const url = await subirImagenACloudinary(imagen);
      urls.push(url);
    }
    return urls;
  };

  // ================= ETIQUETAS =================
  const agregarEtiqueta = () => {
    if (etiquetaInput.trim()) {
      setEtiquetas([...etiquetas, etiquetaInput.trim()]);
      setEtiquetaInput('');
    }
  };

  const eliminarEtiqueta = (index) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  // ================= VARIANTES =================
  const agregarVariante = () => {
    setVariantes([...variantes, { color: '', codigoColor: '#000000', tallas: [] }]);
  };

  const eliminarVariante = (idx) => {
    setVariantes(variantes.filter((_, i) => i !== idx));
  };

  const actualizarVariante = (idx, campo, valor) => {
    const nuevas = [...variantes];
    nuevas[idx][campo] = valor;
    setVariantes(nuevas);
  };

  const agregarTalla = (idx) => {
    const nuevas = [...variantes];
    nuevas[idx].tallas.push({ talla: '', stock: 0 });
    setVariantes(nuevas);
  };

  const actualizarTalla = (varIdx, tallaIdx, campo, valor) => {
    const nuevas = [...variantes];
    nuevas[varIdx].tallas[tallaIdx][campo] = valor;
    setVariantes(nuevas);
  };

  const eliminarTalla = (varIdx, tallaIdx) => {
    const nuevas = [...variantes];
    nuevas[varIdx].tallas.splice(tallaIdx, 1);
    setVariantes(nuevas);
  };

  // ================= SUBMIT =================
  const onSubmit = async (data) => {
    setSubiendo(true);
    try {
      const urls = imagenes.length > 0
        ? await subirImagenesYObtenerURLs()
        : editarProducto?.imagenes || [];

      const slug = await generarSlugUnico(data.nombre, editarProducto?.id);

      const productoData = {
        ...data,
        slug,
        precio: parseFloat(data.precio),
        precioDescuento: parseFloat(data.precioDescuento),
        precioMayorista: parseFloat(data.precioMayorista),
        imagenes: urls,
        variantes,
        etiquetas,
        marca: data.marca?.value || '',
        usuario: data.usuario?.value || '',
        tipoCalzado: data.tipoCalzado?.value || '',
        material: data.material?.map((opt) => opt.value),
        uso: data.uso?.map((opt) => opt.value),
        origen: data.origen?.map((opt) => opt.value),
        actualizadoEn: new Date(),
      };

      if (editarProducto) {
        const refDoc = doc(db, 'productos', editarProducto.id);
        await updateDoc(refDoc, productoData);
      } else {
        productoData.creadoEn = new Date();
        await addDoc(collection(db, 'productos'), productoData);
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setSubiendo(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-600 text-xl hover:text-black">×</button>
        <h2 className="text-xl font-semibold mb-4">{editarProducto ? 'Editar' : 'Nuevo'} Producto</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input {...register('nombre', { required: 'Nombre requerido' })} className="w-full border px-3 py-2 rounded" />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>
            <SelectField
                name="marca"
                label="Marca"
                control={control}
                options={MARCAS}
                errors={errors}
                rules={{ required: 'La marca es requerida' }}
            />
            <SelectField
                name="usuario"
                label="Usuario"
                control={control}
                options={USUARIOS}
                errors={errors}
                rules={{ required: 'Debe seleccionar al usuario' }}
            />
            <SelectField
                name="tipoCalzado"
                label="Tipo de calzado"
                control={control}
                options={CATEGORIAS}
                errors={errors}
                rules={{ required: 'Debe seleccionar el tipo de calzado' }}
            />
            <SelectField
                name="material"
                label="Material"
                control={control}
                options={MATERIALES}
                errors={errors}
                isMulti
                rules={{ required: 'Debe seleccionar al menos un material' }}
            />
            <SelectField
                name="uso"
                label="Usos"
                control={control}
                options={USOS}
                errors={errors}
                isMulti
                rules={{ required: 'Debe seleccionar al menos un uso' }}
            />
            <SelectField
                name="origen"
                label="Origen"
                control={control}
                options={ORIGENES}
                errors={errors}
                isMulti
                rules={{ required: 'Debe seleccionar el origen' }}
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Precio original</label>
              <input type="number" {...register('precio', { required: 'Precio requerido' })} className="w-full border px-3 py-2 rounded" />
              {errors.precio && <p className="text-red-500 text-sm">{errors.precio.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Precio Mayorista</label>
              <input type="number" {...register('precioMayorista', { required: 'Precio requerido' })} className="w-full border px-3 py-2 rounded" />
              {errors.precioMayorista && <p className="text-red-500 text-sm">{errors.precioMayorista.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Precio con descuento</label>
              <input type="number" {...register('precioDescuento', { required: 'Precio requerido' })} className="w-full border px-3 py-2 rounded" />
              {errors.precioDescuento && <p className="text-red-500 text-sm">{errors.precioDescuento.message}</p>}
            </div>
          </div>
            <div>
                <label className="block text-sm font-medium">Descripcion</label>
                <textarea {...register('descripcion')} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Descripción" />
            </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium">Etiquetas</label>
            <input
              value={etiquetaInput}
              onChange={(e) => setEtiquetaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarEtiqueta())}
              placeholder="Agregar etiqueta"
              className="border px-2 py-1 rounded w-full"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {etiquetas.map((et, i) => (
                <span key={i} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                  {et}
                  <button type="button" onClick={() => eliminarEtiqueta(i)} className="text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Imágenes */}
          <label className="block text-sm font-medium mt-2">Imágenes (max. 9)</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
            
            {previewUrls.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} className="w-full h-20 object-cover rounded border" />
                <button type="button" onClick={() => {
                  const newPreviews = [...previewUrls];
                  const newFiles = [...imagenes];
                  newPreviews.splice(idx, 1);
                  newFiles.splice(idx, 1);
                  setPreviewUrls(newPreviews);
                  setImagenes(newFiles);
                }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
              </div>
            ))}
            {previewUrls.length < 9 && (
              <label className="border-2 border-dashed w-full h-20 flex items-center justify-center rounded cursor-pointer">
                <span className="text-gray-500">+</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImagenChange} />
              </label>
            )}
          </div>

          {/* Variantes */}
          <div className='my-2'>
            <h3 className="text-md font-semibold mb-2">Variantes por color y talla</h3>
            {variantes.map((v, i) => (
              <div key={i} className="border p-3 rounded mb-3">
                <div className="flex gap-2 mb-2">
                  <input value={v.color} onChange={(e) => actualizarVariante(i, 'color', e.target.value)} placeholder="Color" className="flex-1 border px-2 py-1 rounded" />
                  <input type="color" value={v.codigoColor} onChange={(e) => actualizarVariante(i, 'codigoColor', e.target.value)} className="w-12 h-10 rounded border" />
                  <button type="button" onClick={() => eliminarVariante(i)} className="text-red-500 ml-auto">Eliminar</button>
                </div>
                {v.tallas.map((t, j) => (
                  <div key={j} className="flex gap-2 mb-1">
                    <input value={t.talla} onChange={(e) => actualizarTalla(i, j, 'talla', e.target.value)} placeholder="Talla" className="border px-2 py-1 rounded w-24" />
                    <input type="number" value={t.stock} onChange={(e) => actualizarTalla(i, j, 'stock', parseInt(e.target.value))} placeholder="Stock" className="border px-2 py-1 rounded w-24" />
                    <button type="button" onClick={() => eliminarTalla(i, j)} className="text-sm text-red-500">Quitar</button>
                  </div>
                ))}
                <button type="button" onClick={() => agregarTalla(i)} className="text-blue-500 text-sm">+ Agregar talla</button>
              </div>
            ))}
            <button type="button" onClick={agregarVariante} className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200">+ Agregar variante</button>
          </div>

          <div className='flex flex-row justify-end gap-2'>
            <button type="submit" disabled={subiendo} className="bg-black text-white p-2 rounded hover:bg-gray-800 transition">
              {subiendo ? 'Guardando...' : 'Guardar Producto'}
            </button>
            <button type="button" onClick={onClose} className="bg-red-500 text-white p-2 rounded transition">
              {'Cancelar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
