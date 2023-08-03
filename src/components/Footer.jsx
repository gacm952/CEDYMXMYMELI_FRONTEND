import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-emerald-900 px-4 text-white py-4 w-full">
    <div className="container mx-auto flex justify-center items-center">
      <div>
        <p className="text-sm">
          Desarrollado por: <span className="font-bold">BrandAdvisories</span> |
          <span className="ml-1 text-sm">
          &copy; {new Date().getFullYear()} <span className="font-bold">MyMeLi</span> 
        </span>
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer