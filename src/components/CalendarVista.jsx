import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isWeekend, setDefaultOptions, addDays, startOfToday, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const CalendarVista = ({ value, onChange }) => {
  setDefaultOptions({ locale: es });

  const handleDateChange = (newValue) => {
    onChange(newValue);
  };

  const shouldDisableDate = (date) => {
    // Deshabilitar fines de semana
    if (isWeekend(date)) {
      return true;
    }

    // Solo mostrar las fechas hasta los siguientes 3 meses desde el día actual
    const today = startOfToday();
    const threeMonthsLater = addMonths(today, 3);

    return date > threeMonthsLater;
   
  
  /* // Solo mostrar los dos días siguientes al actual
    const today = startOfToday();
    const twoDaysLater = addDays(today, 1);
    return date > twoDaysLater;*/
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={es}>
        
      <DatePicker 
        value={value}
        onChange={handleDateChange}
        shouldDisableDate={shouldDisableDate}
        disablePast
        className='w-40'
      />
    </LocalizationProvider>
  );
};

export default CalendarVista;