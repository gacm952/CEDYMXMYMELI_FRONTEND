const Modal9 = ({ isOpen, onClose }) => {

    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="bg-gray-800 bg-opacity-75 flex items-center justify-center fixed inset-0">
              <div className="bg-white rounded-lg p-6">
  
              <div className="mb-4 rounded-full border border-gray-300 flex items-center justify-center w-12 h-12 flex-shrink-0 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
              </div>
      
                <div className="md:flex items-center">
                  
                  <div className="mt-4 md:mt-0 text-center md:text-left">
                      <h2 className="text-xl font-bold text-center">¡Advertencia!</h2>
                      <p className="text-sm text-center text-gray-700 mt-1"> 
                      Has cancelado citas muy repetidamente en periodo corto de tiempo. 
                        </p>
                  </div>
                  </div>
  
                <div className="text-center md:text-right mt-4 md:flex md:justify-center">
                <button onClick={onClose} className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
                  > Volver Atrás </button> 
                  </div>
              </div>
            </div>
          </div>
        )}
      </>  )
  
  }
  
  export default Modal9