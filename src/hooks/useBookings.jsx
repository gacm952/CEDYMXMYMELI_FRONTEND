import { useContext } from 'react'
import BookingContext from '../context/BookingProvider'

const useBookings = () => {
    return useContext(BookingContext)
}

export default useBookings