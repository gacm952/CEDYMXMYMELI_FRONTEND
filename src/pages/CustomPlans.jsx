import { Link } from "react-router-dom"

const CustomPlans = () => {
  return (
    <>
     <section className="w-full min-h-screen flex-grow flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-28 place-content-center font-bold text-center text-lg"> 
          <Link 
           to="/MenuAdmission/Bookings" 
           state={{ from: '/MenuAdmission/CustomPlans' }}
          className="flex w-80 justify-center items-center gap-4 rounded-xl bg-gray-200 shadow-md shadow-gray-600 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-95  duration-300 p-12 h-full text-center"
          >
              Suscripción de Planes
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
          </Link>

          <Link
          to="#"
          className="flex justify-center items-center gap-4 rounded-xl bg-gray-200 shadow-md shadow-gray-600 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-95 duration-300 p-12 w-full h-full text-center"
          >
             2
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
          </Link>

        </div>
    </section>
    </>
  )
}

export default CustomPlans