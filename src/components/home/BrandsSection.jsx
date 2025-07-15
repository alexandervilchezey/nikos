import { optimizarImagenCloudinary } from '../../utils/generalFunctions'

export default function BrandsSection({ marcas = [] }) {
  return (
    <div className="brandssection" id="marcas">
      <div className="wrap">
        <div className="dotgrid">
          <div
            id="scrolling-container"
            className="wrapper overflow-x-auto whitespace-nowrap w-full"
          >
            <div className="flex gap-4 py-2 items-center w-max">
              {marcas.map((marca, i) => (
                <div key={i}>
                  {marca.imagen && (
                    <div className="flex-shrink-0 w-[220px] bg-gray-100 rounded shadow p-4 flex items-center justify-center">
                      <img
                        alt={marca.nombre}
                        loading="lazy"
                        src={optimizarImagenCloudinary(marca.imagen)}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
