import React from 'react';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import { Login } from '../components/auth/Login';
import { CalendarScreen } from '../components/calendar/CalendarScreen';


export const AppRouter = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<CalendarScreen/>}/>
                
            </Routes>
        </BrowserRouter>

    </div>
  )
}
