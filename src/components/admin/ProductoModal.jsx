import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { generarSlugUnico } from '../../utils/generalFunctions';
import SelectField from './SelectField';

export default function ProductoModal({ isOpen, onClose, editarProducto, disponibles }) {
  const opciones = (arr) =>
    arr.map((el) => ({
      value: el.valor,
      label: el.valor,
      raw: el
    }));

  const transformarOpciones = (arr) =>
    Array.isArray(arr)
      ? arr.map((el) =>
          typeof el === 'object'
            ? { value: el.valor || el, label: el.valor || el, raw: el }
            : { value: el, label: el }
        )
      : [];

  const transformarOpcion = (valor) =>
    valor && typeof valor === 'object'
      ? { value: valor.valor, label: valor.valor, raw: valor }
      : valor
      ? { value: valor, label: valor }
      : null;

  const USOS = opciones(disponibles.uso || []);
  const CATEGORIAS = opciones(disponibles.tipo || []);
  const MATERIALES = opciones(disponibles.material || []);
  const ORIGENES = opciones(disponibles.origen || []);
  const MARCAS = opciones(disponibles.marca || []);
  const USUARIOS = opciones(disponibles.usuario || []);

  const [imagenes, setImagenes] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [variantes, setVariantes] = useState([]);
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [errorVariantes, setErrorVariantes] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
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
        origen: transformarOpcion(editarProducto.origen),
        marca: transformarOpcion(editarProducto.marca),
        usuario: transformarOpcion(editarProducto.usuario),
      });

      const variantesEditadas = (editarProducto.variantes || []).map((v) => ({
        ...v,
        imagenLocal: v.imagen || '',
        color: v.color || '',
        codigoColor: v.codigoColor || '',
        tallas: Array.isArray(v.tallas) ? v.tallas : [],
      }));

      setPreviewUrls((editarProducto.imagenes || []));
      setVariantes(variantesEditadas);
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
        origen: null,
        marca: null,
        usuario: null,
      });
      setPreviewUrls([]);
      setVariantes([]);
      setEtiquetas([]);
    }

    setImagenes([]);
  }, [isOpen, editarProducto, reset]);

  const usuarioWatch = watch('usuario');
  useEffect(() => {
    if (usuarioWatch?.raw) {
      setUsuarioSeleccionado(usuarioWatch.raw);
    } else if (usuarioWatch?.value) {
      const encontrado = disponibles.usuario?.find(u => u.valor === usuarioWatch.value);
      if (encontrado) setUsuarioSeleccionado(encontrado);
    }
  }, [usuarioWatch]);

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const nuevosFiles = files.slice(0, 9 - previewUrls.length); // limita a 9 imágenes en total

    const nuevasUrls = nuevosFiles.map((file) => URL.createObjectURL(file));
    setImagenes((prev) => [...prev, ...nuevosFiles]);
    setPreviewUrls((prev) => [...prev, ...nuevasUrls]);

    const tallasDefault = Array.isArray(usuarioSeleccionado?.tallas)
      ? usuarioSeleccionado.tallas.map((t) => ({ talla: t, stock: 0 }))
      : [];

    const nuevasVariantes = nuevasUrls.map((url) => ({
      imagenLocal: url,
      imagen: '',
      color: '',
      codigoColor: '',
      tallas: [...tallasDefault],
    }));

    setVariantes((prev) => [...prev, ...nuevasVariantes]);

    e.target.value = '';
  };


  const eliminarVariante = (idx) => {
    setVariantes(prev => prev.filter((_, i) => i !== idx));
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

  const subirImagenACloudinary = async (file) => {
    const url = 'https://api.cloudinary.com/v1_1/ddebdvfcg/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nikosperu_preset');
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    return data.secure_url;
  };

  const validarVariantes = () => {
    if (variantes.length === 0) {
      setErrorVariantes('Debes agregar al menos una variante.');
      return false;
    }
    for (const v of variantes) {
      if (!Array.isArray(v.tallas) || v.tallas.length === 0) {
        setErrorVariantes('Cada variante debe tener al menos una talla.');
        return false;
      }
    }
    setErrorVariantes(null);
    return true;
  };

  const onSubmit = async (data) => {
    if (!validarVariantes()) return;
    setSubiendo(true);
    try {
      const nuevasUrls = await Promise.all(imagenes.map(subirImagenACloudinary));

      const slug = await generarSlugUnico(data.nombre, editarProducto?.id);

      const imagenesFinal = [...previewUrls];
      nuevasUrls.forEach((url, idx) => {
        const index = previewUrls.length - nuevasUrls.length + idx;
        imagenesFinal[index] = url;
      });

      const variantesFinal = variantes.map((v, idx) => ({
        color: v.color || '',
        codigoColor: v.codigoColor || '',
        tallas: v.tallas || [],
        imagen: imagenesFinal[idx] || '',
      }));

      const productoData = {
        ...data,
        slug,
        precio: parseFloat(data.precio),
        precioDescuento: parseFloat(data.precioDescuento),
        precioMayorista: parseFloat(data.precioMayorista),
        imagenes: imagenesFinal,
        variantes: variantesFinal,
        etiquetas,
        marca: data.marca?.value || '',
        usuario: data.usuario?.value || '',
        tipoCalzado: data.tipoCalzado?.value || '',
        material: data.material?.map((opt) => opt.value),
        uso: data.uso?.map((opt) => opt.value),
        origen: data.origen?.value || '',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow relative max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          {editarProducto ? 'Editar' : 'Nuevo'} Producto
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} id='form-producto' className="space-y-4 flex-1 overflow-y-auto pr-1">
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
            
            {variantes.map((v, idx) => (
  <div key={idx} className="relative">
    <img src={v.imagenLocal || v.imagen} className="w-full h-20 object-cover rounded border" />
    <button
      type="button"
      onClick={() => eliminarVariante(idx)}
      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
    >
      ×
    </button>
  </div>
))}

            {previewUrls.length < 9 && (
              <label className="border-2 border-dashed w-full h-20 flex items-center justify-center rounded cursor-pointer">
                <span className="text-gray-500">+</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagenChange} />
              </label>
            )}
          </div>

          {/* Variantes */}
          <div className='my-2'>
        <h3 className="text-md font-semibold mb-2">Variantes por imagen y talla</h3>
        {errorVariantes && <p className="text-red-500 text-sm mb-2">{errorVariantes}</p>}
        {variantes.map((v, i) => (
          <div key={i} className="border p-3 rounded mb-3">
            <div className="flex items-center gap-2 mb-2">
              <img src={v.imagenLocal || v.imagen} className="w-12 h-12 object-cover rounded border" />
              <input value={v.color} onChange={(e) => actualizarVariante(i, 'color', e.target.value)} placeholder="Color" className="flex-1 border px-2 py-1 rounded" />
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
      </div>
        </form>
        <div className="sticky z-30 bottom-0 left-0 bg-white pt-4 mt-4 pb-2 border-t border-gray-200 flex justify-end gap-2 z-10">
          <button
            type="submit"
            form="form-producto"
            disabled={subiendo}
            className={`px-4 py-2 bg-black text-white rounded hover:bg-gray-800 ${
              subiendo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {subiendo ? 'Guardando...' : 'Guardar Producto'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={subiendo}
            className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 ${
              subiendo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
