// LAYOUT PRINCIPAL
import React, { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';

import {
  MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SolutionOutlined, FileTextOutlined,
  EditOutlined, FilePdfOutlined, IdcardOutlined, TeamOutlined, DollarCircleOutlined,
  SettingOutlined, BankOutlined, PoweroffOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Divider } from 'antd';
import WorkCertificateModal from './WorkCertificateModal';

const { Sider, Content } = Layout;
// --- DEFINICIÓN DE MENÚS PARA CADA ROL ---

// Rol: HIRING GROUP (admin / employeehg)
const hiringGroupItems = [
  { key: '/hiring-group/empresas', icon: <IdcardOutlined />, label: <Link to="/hiring-group/empresas">Gestionar Empresas</Link> },
  { key: '/hiring-group/postulaciones', icon: <TeamOutlined />, label: <Link to="/hiring-group/postulaciones">Postulaciones</Link> },
  { key: '/hiring-group/nomina', icon: <DollarCircleOutlined />, label: <Link to="/hiring-group/nomina">Gestión de Nómina</Link> },
  {
    key: 'configuracion',
    icon: <SettingOutlined />,
    label: 'Configuración',
    children: [
      { key: '/hiring-group/bancos', icon: <BankOutlined />, label: <Link to="/hiring-group/bancos">Bancos</Link> },
    ]
  },
];

// Rol: CANDIDATE
const baseCandidateItems = [
  { key: '/candidato/curriculum', icon: <UserOutlined />, label: <Link to="/candidato/curriculum">Currículum</Link> },
  { key: '/candidato/ofertas', icon: <SolutionOutlined />, label: <Link to="/candidato/ofertas">Ofertas</Link> },
  { key: '/candidato/ofertas-aplicadas', icon: <SolutionOutlined />, label: <Link to="/candidato/ofertas-aplicadas">Ofertas Aplicadas</Link> },
];


const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const location = useLocation();
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const contractData = {
    name: user?.name || 'Usuario',
    startDate: '01/01/2024',
    position: 'Desarrollador de Software',
    company: 'Tech Solutions Inc.',
    salary: '5500'
  };

// Rol: COMPANY
const companyItems = [
  { key: '/usuario-Empresa/editar-Ofertas', icon: <EditOutlined />, label: <Link to="/usuario-Empresa/editar-Ofertas">Gestionar Ofertas</Link> },
  { key: 'settings', icon: <SettingOutlined />, label: 'Mi Cuenta', onClick: () => setIsSettingsModalOpen(true) },
];

  const menuItems = useMemo(() => {
    if (!user || !user.role) {
      return [];
    }

    let roleItems = [];

    switch (user.role.toLowerCase()) {
      case 'admin':
      case 'employeehg':
        roleItems = hiringGroupItems;
        break;

      case 'company':
        roleItems = companyItems;
        break;

      case 'candidate':
        roleItems = [...baseCandidateItems];
        if (user.hired || user.is_hired) {
          const hiredOptions = [
            { key: '/contratado/recibos', icon: <FileTextOutlined />, label: <Link to="/contratado/recibos">Mis Recibos</Link> },
            { key: 'constancia', icon: <FilePdfOutlined />, label: 'Solicitar Constancia', onClick: () => setIsCertificateModalOpen(true) },
          ];
          roleItems.push(...hiredOptions);
        }
        break;

      default:
        roleItems = [];
    }
    return [
      ...roleItems,
      { type: 'divider', key: 'divider' },
      {
        key: 'logout',
        icon: <PoweroffOutlined />,
        label: 'Cerrar Sesión',
        onClick: handleLogout,
        danger: true,
      },
    ];

  }, [user]);
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          style={{ backgroundColor: token.colorBgLayout }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '18px', width: 64, height: 64, color: token.colorText }}
          />
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['configuracion']}
            items={menuItems}
            style={{ backgroundColor: token.colorBgLayout, borderRight: 0 }}
          />
        </Sider>

        <Layout>
          <Content style={{ padding: 24, overflow: 'auto' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {/* El modal para la constancia de trabajo */}
      <WorkCertificateModal
        open={isCertificateModalOpen}
        onCancel={() => setIsCertificateModalOpen(false)}
        userData={contractData}
      />

      <SettingsModal
        open={isSettingsModalOpen}
        onCancel={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};

export default MainLayout;