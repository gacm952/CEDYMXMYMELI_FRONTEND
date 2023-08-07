import { useState } from "react";
import { Link } from "react-router-dom";

const CustomPlansSubscription = () => {

  const [typeDocument, setTypeDocument] = useState('');
  const [searchDocument, setSearchDocument] = useState('');

  return (
    <>
      <section className="w-full min-h-screen flex-col flex justify-center items-center">

        {/* Document Search */}

        <div className="mb-6">
          <div className='flex gap-2'>
            <div className='flex-[1%] mt-8'>
              <select
                id="emailV"
                className="text-center font-bold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={typeDocument}
                onChange={e => setTypeDocument(e.target.value)}

              >🡣
                <option value="" hidden >▼</option>
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="RUT">RUT</option>
                <option value="CE">CE</option>
                <option value="RCN">RCN</option>
                <option value="NIT">NIT</option>
                <option value="PEP">PEP</option>
                <option value="PPT">PPT</option>
                <option value="P">P</option>
                <option value="LM">LM</option>
                <option value="ESI">EX</option>

              </select>
            </div>

            <div className='flex-[80%] flex-col'>

              <label
                className="inline-flex mb-2 text-sm text-gray-800"
                htmlFor=''
              >Ingresa el Documento del Paciente </label>

              <input
                type="search"
                placeholder='Buscar Documento'
                className='w-full
                                    px-3
                                    py-2
                                    text-gray-800
                                    border
                                    rounded
                                    outline-none
                                    bg-gray-50
                                    focus:ring
                                    ring-emerald-500
                                    mb-4
                                    '
                value={searchDocument}
                onChange={e => setSearchDocument(e.target.value)}>
              </input>
            </div>      
          </div>

          <div className='flex justify-end'>
                      <button className='  
                      px-12
                      py-2
                      text-sm text-white
                    bg-emerald-700
                      rounded-lg
                      outline-none
                    hover:bg-emerald-800
                    ring-indigo-300' 
                    >Buscar</button>
          </div>
        </div>

        {/* Document Search Results */}

          <div action="">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Primer Nombre</label>

                <input
                  type="search"
                  placeholder='Primer Nombre'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Segundo Nombre</label>

                <input
                  type="search"
                  placeholder='Segundo Nombre'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Primer Apellido</label>

                <input
                  type="search"
                  placeholder='Primer Apellido'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Segundo Apellido</label>

                <input
                  type="search"
                  placeholder='Segundo Apellido'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Email</label>

                <input
                  type="search"
                  placeholder='Email'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Número Teléfono</label>

                <input
                  type="search"
                  placeholder='Número Teléfono'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

            {/* Others Questions && Select Plan */}

            <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Plan a Elegir</label>

                <input
                  type="search"
                  placeholder='Plan a Elegir'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div>
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Método de Pago</label>

                <input
                  type="search"
                  placeholder='Método de Pago'
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>

              <div className="col-span-2">
                <label
                  className="inline-flex mb-2 text-sm text-gray-800"
                  htmlFor=''
                >Fecha de Inicio</label>

                <input
                  type="Date"
                  className='w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 focus:ring ring-emerald-500 mb-4 '
                  value={searchDocument}
                  onChange={e => setSearchDocument(e.target.value)}>
                </input>
              </div>
            </div>
          </div>

          <div className="">
            <div className="flex justify-between space-x-96 gap-72 mt-4">
              <button
                to="/Menu"
                className="
                inline-flex
                justify-start
                items-center
                px-6
                py-2
                text-sm text-gray-800
                rounded-lg
                shadow
                outline-none
                gap-x-1
                bg-gray-100
                hover:bg-gray-200
                "
                >Volver
                
              </button>

              <Link
                to="/MenuAdmission/Bookings" 
                state={{ from: '/MenuAdmission/PlanSubscription' }}
                className="
                    px-6
                    py-2
                    text-sm text-white
                  bg-emerald-700
                    rounded-lg
                    outline-none
                  hover:bg-emerald-800
                  ring-indigo-300"
                >Confirmar Plan
              </Link>
            </div>
          </div>

      </section>
    </>
  )
}

export default CustomPlansSubscription