const Modal8 = ({ isOpen }) => {

    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="bg-gray-800 bg-opacity-75 flex items-center justify-center fixed inset-0">
              <div className="bg-white rounded-lg p-6">
              <img className="h-16 w-16" 
                src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" 
                alt=""/>
              </div>
            </div>
          </div>
        )}
      </>  )
  
  }
  
  export default Modal8