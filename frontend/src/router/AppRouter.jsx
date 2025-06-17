// src/router/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { Home as HomePage } from '../paginas/home/HomePage.jsx';
import { LoginForm } from '../paginas/formulario/LoginForm.jsx';
import RegisterForm from '../paginas/formulario/RegisterForm.jsx';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginForm/>} />
      <Route path="/register" element={<RegisterForm/>} />
      
    </Routes>
  );
};

export default AppRoutes;