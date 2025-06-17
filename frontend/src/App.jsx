import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import './App.css'; 
import AppRoutes from './router/AppRouter';


export default function App() {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          //Generales
          borderRadius: 20,
          fontSize: 16,
          
          // Colores informativos
          colorPrimary: '#57d1c5',
          colorSuccess: '#48bb78',         
          colorWarning: '#ed8936',         
          colorError: '#e53e3e',           
          colorInfo: '#4299e1',           
          colorBgLayout: '#ffffff',
          
          // Colores para el texto
          colorText: '#333333',
          colorTextSecondary: '#718096',   
          colorTextDisabled: '#b0b8c4',

          // Colores para fondo
          colorBgLayout: '#e3f5f4',   
          colorBgContainer: '#ffffff',
        },
        components: {
          Button: {
            colorPrimary: '#57d1c5',
            borderRadius: 20,
          },
          Input: {
            borderRadius: 20,
          },
          Card: {
            borderRadius: 20,
          },
        },
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}

