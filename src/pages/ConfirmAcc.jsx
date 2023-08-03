import { useEffect, useState } from "react"
import { useParams, Link } from 'react-router-dom'
import costumerAxios from "../config/costumerAxios"
import Alert from "../components/Alert"

const ConfirmAcc = () => {

  const [alert, setAlert] = useState({})
  const [confirmAccount, setConfirmAccount] = useState(false)

  const params = useParams();
  const { id } = params

  useEffect(() =>{
    const confirmAccount = async () => {
      try {
        const url = `/confirm/${id}`
        const { data } = await costumerAxios(url)

        setAlert({
          msg: data.msg,
          error: false
        })

        setConfirmAccount(true)

        console.log(data)
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmAccount();
  }, [])

  const { msg } = alert 

  return (
    <>
      <section>
        <div className="flex justify-center mx-auto max-w-screen-xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">      
            <div className="max-w-xl shadow-md bg-white shadow-gray-600 border-2 border-emerald-600 rounded-3xl">
              <div className="p-8 sm:p-32 lg:py-40 lg:px-16 lg:my-12">
                  <h2 className="text-4xl font-extrabold sm:text-5xl font-poppins text-gray-900 mb-12 capitalize">Confirma tu cuenta</h2>
                <div className="mt-6 font-poppins">
                    <div className="">
                      {msg && <Alert alert={alert}/> }

                      {confirmAccount && (
                        <p className="mt-6 text-sm text-grey-600 text-center">
                        <Link to="/" className="font-medium text-emerald-600 hover:text-emerald-500 ">Inicia sesión</Link>
                        </p>
                      )}
                    </div>
                </div>
              </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default ConfirmAcc