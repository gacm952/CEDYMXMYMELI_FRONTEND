import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';
import { es } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';

const CalendarRange2 = ({ onDateChange, onTimeChange }) => {

    setDefaultOptions({ locale: es })

    const [valueEnd, setValueEnd] = useState(null)
    const [valueEndTime, setValueEndTime] = useState(null)

    const handleDateChange = (date) => {
        setValueEnd(date);
        onDateChange(date);
      };
    
    const handleTimeChange = (time) => {
        setValueEndTime(time);
        onTimeChange(time);
      };

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={es}>
        <section className='flex gap-4 justify-center'>
            <div>
        <DatePicker
            label="Fecha"
            value={valueEnd}
            onChange={handleDateChange}
            format="dd-MM-yyyy"
            />
            </div>

            <div>
        <TimePicker
            ampm={false}
            label="Hora"
            value={valueEndTime}
            onChange={handleTimeChange}
            />
            </div> 
        </section>
    </LocalizationProvider>
    
    </>
  )
}

export default CalendarRange2