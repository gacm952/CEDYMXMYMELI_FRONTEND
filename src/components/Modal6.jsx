import { useState } from "react"

const Modal6 = ({ isOpen, onClose, onConfirm, bookingId}) => {

const [passwordInput, setPasswordInput] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);

const handleInputChange = (event) => {
  setPasswordInput(event.target.value);
};

const handleSubmit = (event) => {
  event.preventDefault();

  // No permitir enviar el input vacio

  setIsSubmitted(true);

  // Enviar los datos a la funcion

  onConfirm(bookingId, passwordInput);
  onClose();

};

    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="bg-gray-800 bg-opacity-75 flex items-center justify-center fixed inset-0">
              <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg p-6">
  
              <div className="mb-4 rounded-full border border-gray-300 flex items-center justify-center w-12 h-12 flex-shrink-0 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
              </div>
      
                <div className="md:flex items-center">
                  
                  <div className="mt-4 md:mt-0 text-center md:text-left">
                    
                      <h2 className="text-xl font-bold text-center">No estas autorizado/a</h2>
                      <p className="text-sm text-center text-gray-700 mt-1"> Para realizar esta acción ingresa la clave.
                        </p>

                        

                        <input className=
                              {`w-full px-3 py-2 text-gray-800 border rounded outline-none bg-gray-50 mt-4 ${
                                (isSubmitted && passwordInput.trim() === "") ? "border-red-500" : ""
                              }`}
                              type="password" 
                              placeholder="Clave"
                              value={passwordInput}
                              onChange={handleInputChange}/>    
                  </div>
                  </div>
  
                <div className="text-center md:text-right mt-4 md:flex md:justify-center">
                <button type="submit" className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-emerald-200 text-emerald-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
                  > Ingresar </button>

                

               
                  <button onClick={onClose} className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm mt-4
                      md:mt-0 md:order-1">Volver atrás</button>
                  </div>

              </div>
              </form>
            </div>
          </div>
        )}
      </>  )
  
  }
  
  export default Modal6