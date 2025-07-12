
import { ConfigProvider, App, message } from 'antd';
import esES from 'antd/locale/es_ES';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRoutes from './router/AppRouter';
import { tema } from './theme';
import { AuthProvider } from './context/AuthContext';

export default function MyApp() {
  return (
    <ConfigProvider locale={esES} theme={tema}>
      <App>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </App>
    </ConfigProvider>
  );
}