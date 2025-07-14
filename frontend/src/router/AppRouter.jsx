import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/home/HomePage.jsx';
import { LoginForm } from '../pages/form/LoginForm.jsx';
import RegisterForm from '../pages/form/RegisterForm.jsx';
import JobOffers from '../pages/candidate/JobOffers.jsx';
import ModifyCurriculum from '../pages/candidate/ModifyCurriculum.jsx';
import ReceiptsPayment from '../pages/contracted/ReceiptsPayment.jsx';
import EditOffers from '../pages/BusinessUser/EditOffers.jsx';
import MainLayout from '../components/MainLayout.jsx'; 
import ManageCompanies from '../pages/HiringGroupUser/ManageCompanies.jsx';
import ReviewApplications from '../pages/HiringGroupUser/ReviewApplications.jsx';
import PayrollManagement from '../pages/HiringGroupUser/PayrollManagement.jsx';
import HistoryOffers from '../pages/candidate/HistoryOffers.jsx';
import ManageBanks from '../pages/HiringGroupUser/ManageBanks.jsx';


const AppRoutes = () => {
   return (
    <Routes>
      
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* ======================================================= */}
      {/* GRUPO DE RUTAS PRIVADAS QUE USAN EL LAYOUT DINÁMICO */}
      {/* ======================================================= */}

      <Route element={<MainLayout />}>

        {/*  Rutas de Usuario Hiring Group*/}
        <Route path="/hiring-group/empresas" element={<ManageCompanies />} /> 
        <Route path="/hiring-group/postulaciones" element={<ReviewApplications />} />
        <Route path="/hiring-group/nomina" element={<PayrollManagement />} />
        <Route path="/hiring-group/bancos" element={<ManageBanks/>} />

        {/* Rutas de la Empresa */}
        <Route path="/usuario-Empresa/editar-Ofertas" element={<EditOffers />} /> 

        {/* Rutas del Candidato */}
        <Route path="/candidato/curriculum" element={<ModifyCurriculum />} />
        <Route path="/candidato/ofertas" element={<JobOffers />} /> 
        <Route path="/candidato/ofertas-aplicadas" element={<HistoryOffers />} /> 

        {/* Rutas del Contratado */}
        <Route path="/contratado/recibos" element={<ReceiptsPayment />} />  
        
      </Route>

    </Routes>
  );
};

export default AppRoutes;