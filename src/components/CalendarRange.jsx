import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';
import { es } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';

const CalendarRange = ({ onDateChange, onTimeChange }) => {

    setDefaultOptions({ locale: es })

    const [valueStart, setValueStart] = useState(null);
    const [valueStartTime, setValueStartTime] = useState(null);

    const handleDateChange = (date) => {
        setValueStart(date);
        onDateChange(date);
      };
    
    const handleTimeChange = (time) => {
        setValueStartTime(time);
        onTimeChange(time);
      };

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={es}>
        <section className='flex gap-4 justify-center'>
            <div>
        <DatePicker
            label="Fecha"
            value={valueStart}
            onChange={handleDateChange}
            format="dd-MM-yyyy"
            />
            </div>

            <div>
        <TimePicker
            ampm={false}
            label="Hora"
            value={valueStartTime}
            onChange={handleTimeChange}
            />
            </div> 
        </section>
    </LocalizationProvider>
    
    </>
  )
}

export default CalendarRange