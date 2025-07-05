// LAYOUT PRINCIPAL


import React, { useState, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

import {
  MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SolutionOutlined, FileTextOutlined,
  EditOutlined, FilePdfOutlined, IdcardOutlined, TeamOutlined, DollarCircleOutlined,
  SettingOutlined, BankOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import WorkCertificateModal from './WorkCertificateModal'; 

const { Sider, Content } = Layout;


// Rol: HIRING_GROUP (ID 2)
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

// Rol: COMPANY (ID 3)
const companyItems = [
    { key: '/usuarioEmpresa/editarOfertas', icon: <EditOutlined />, label: <Link to="/usuarioEmpresa/editarOfertas">Gestionar Ofertas</Link> },
];

// Rol: CANDIDATE (ID 4) 
const baseCandidateItems = [
    { key: '/candidate/curriculum', icon: <UserOutlined />, label: <Link to="/candidate/curriculum">Currículum</Link> },
    { key: '/candidate/ofertas', icon: <SolutionOutlined />, label: <Link to="/candidate/ofertas">Ofertas</Link> },
];


const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const location = useLocation();
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  
  const { user } = useAuth(); 

  const contractData = {
    name: user?.name || 'Usuario',
    startDate: '01/01/2024',
    position: 'Desarrollador de Software',
    company: 'Tech Solutions Inc.',
    salary: '5500'
  };

  const menuItems = useMemo(() => {
    if (!user) {
      return [];
    }

    switch (user.role_id) { 
      case ROLES.HIRING_GROUP:
        return hiringGroupItems;
      case ROLES.COMPANY:
        return companyItems;
      case ROLES.CANDIDATE:

        if (user.is_hired) {
            const hiredOptions = [
                { key: '/contratado/recibos', icon: <FileTextOutlined />, label: <Link to="/contratado/recibos">Mis Recibos</Link> },
                { key: 'constancia', icon: <FilePdfOutlined />, label: 'Solicitar Constancia', onClick: () => setIsCertificateModalOpen(true) },
            ];
            return [...baseCandidateItems, ...hiredOptions];
        }
        return baseCandidateItems;
      default:
        return [];
    }
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

       <WorkCertificateModal 
        open={isCertificateModalOpen}
        onCancel={() => setIsCertificateModalOpen(false)}
        userData={contractData}
      />
    </>
  );
};

export default MainLayout;