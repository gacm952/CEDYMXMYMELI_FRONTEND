import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-emerald-900 px-4 text-white py-4 w-full">
    <div className="container mx-auto flex justify-between items-center">
      <div>
        <span className="text-sm">
          &copy; {new Date().getFullYear()} MyMeLi
        </span>
      </div>
      <div>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="hover:text-gray-300">
              Términos y condiciones
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Política de privacidad
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
  )
}

export default Footer