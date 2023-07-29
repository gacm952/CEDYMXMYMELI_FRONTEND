import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';

const CalendarRegister = ({ value, onChange }) => {
  setDefaultOptions({ locale: es });

  const handleDateChange = (newValue) => {
    onChange(newValue);
  };

  const shouldDisableDate = (date) => {
    const limitDate = new Date(1925, 0, 1);
    return date < limitDate;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={es}>
        
      <DatePicker 
        value={value}
        onChange={handleDateChange}
        disableFuture
        shouldDisableDate={shouldDisableDate}
        format="dd-MM-yyyy"
        className='w-full'
      />
    </LocalizationProvider>
  );
};

export default CalendarRegister;