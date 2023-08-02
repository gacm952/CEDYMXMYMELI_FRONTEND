import { useState, useEffect } from "react"
import { Link, useParams } from 'react-router-dom'
import costumerAxios from "../config/costumerAxios"
import Alert from "../components/Alert"
import { useNavigate } from "react-router-dom"
import Modal8 from '../components/Modal8'

const CreatePassword = () => {

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alert, setAlert] = useState('')
  const [tokenValid, setTokenValid] = useState(false)
  const [changedPassword, setChangedPassword] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const {token} = params
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await costumerAxios(`/resetpassword/${token}`)
        setTokenValid(true)

      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    checkToken()
  }, [])

  function passwordValidation(password) {
    const haveLetter = /[A-Za-z]/.test(password);
    const haveNumber = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /[@$!%*?&]/.test(password);
    const isValid = /^[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  
    if (!haveLetter) {
      return "La contraseña debe contener al menos una letra.";
    }
    if (!haveNumber) {
      return "La contraseña debe contener al menos un número.";
    }
    if (!hasUppercase) {
      return "La contraseña debe contener al menos una mayúscula.";
    }
    if (!hasSymbol) {
      return "La contraseña debe contener al menos un símbolo (@, $, !, %, *, ?, o &).";
    }
    if (!isValid) {
      return "La contraseña debe ser de mínimo 8 caracteres y no contener caracteres especiales.";
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if(password.length < 8) {
      setAlert({
        msg: 'La contraseña debe ser mínimo de 8 caracteres',
        error: true
      })
      return
    }

    if(password !== confirmPassword) {
      setAlert({
        msg: 'Las contraseñas deben de ser iguales',
        error: true
      })
      return
    }

    const passwordError = passwordValidation(password);

    if (passwordError) {
      setAlert({
        msg: passwordError,
        error: true,
      });
      return;
    }

    try {

      setIsModalOpen(true)

      const url = `/createpassword/${token}`

      const { data } = await costumerAxios.post(url, { password })
      setAlert({
        msg: data.msg,
        error: false
      })

      setIsModalOpen(false)

      setChangedPassword(true)

      setTimeout(() => {
        navigate("/Login")
      }, 3000);

    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true
      })
    }


  }

  const { msg } = alert

  return (
    <>
      <section>
      <div className="flex justify-center mx-auto max-w-screen-xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">      
          <div className="max-w-xl shadow-md bg-white shadow-gray-600 border-2 border-emerald-600 rounded-3xl">
            <div className="p-8 sm:p-32 lg:py-40 lg:px-16 lg:my-12">
                 <h2 className="text-4xl font-extrabold sm:text-5xl font-poppins text-gray-900 mb-12 capitalize">Crea tu contraseña</h2>
              <div className="mt-6 font-poppins">
                 
              { msg && <Alert alert={alert}/> }
              <Modal8 isOpen={isModalOpen} />

              { tokenValid && ( <form onSubmit={handleSubmit} className="space-y-1">
                    <div>
                        <label 
                          htmlFor="password" 
                          className="block font-medium text-gray-700 mt-2 lg:mt-0">Ingresa tu Contraseña
                        </label>
                        <input 
                          id="password"
                          type="password" 
                          className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Escribe Tu Nueva Contraseña"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          />
                         <label 
                          htmlFor="password2" 
                          className="block font-medium text-gray-700 mt-2 lg:mt-0">Ingresa De Nuevo tu Contraseña
                        </label>
                        <input 
                          id="password2"
                          type="password" 
                          className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Escribe De Nuevo tu Contraseña"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          />
                      </div>
                  <div>
                    <button type="submit" className="mt-4 w-full py-3 bg-emerald-600 text-white hover:bg-emerald-800"> Guardar Nueva Contraseña
                    </button>
                  </div>
                </form>               
                )}

                
                  {changedPassword && (
                    <p className="mt-6 text-sm text-grey-600 text-center">
                    <Link to="/Login" className="font-medium text-emerald-600 hover:text-emerald-500 ">Inicia sesión</Link>
                    </p>
                  )}

              </div>
            </div>
          </div>
      </div>
      </section>
    </>
  )
}

export default CreatePassword