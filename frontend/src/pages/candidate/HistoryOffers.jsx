import React, { useState, useMemo } from 'react';
import { Flex, Typography, Button, Select, Tag } from 'antd';
import { ClearOutlined, CalendarOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import '../styles/pag.css'; 

const { Title, Text } = Typography;

const mockApplications = [
    { id: 1, offerId: 101, cargo: 'Frontend Developer (Senior)', empresa: 'Tech Solutions Inc.', fecha: '2025-07-15', estatus: 'En revisión' },
    { id: 2, offerId: 102, cargo: 'Diseñador de Producto', empresa: 'Innovate Marketing', fecha: '2025-07-10', estatus: 'Aceptada' },
    { id: 3, offerId: 104, cargo: 'Community Manager', empresa: 'Innovate Marketing', fecha: '2025-06-28', estatus: 'Rechazada' },
    { id: 4, offerId: 103, cargo: 'Backend Developer (Node.js)', empresa: 'Tech Solutions Inc.', fecha: '2025-06-15', estatus: 'En revisión' },
];

// Genera dinámicamente las opciones para los filtros a partir de los datos
const empresasDisponibles = [...new Set(mockApplications.map(a => a.empresa))].map(e => ({ value: e, label: e }));
const estatusDisponibles = [...new Set(mockApplications.map(a => a.estatus))].map(e => ({ value: e, label: e }));

const HistoryOffers = () => {
    // --- Estados para controlar los filtros ---
    const [filtroEmpresa, setFiltroEmpresa] = useState(null);
    const [filtroEstatus, setFiltroEstatus] = useState(null);

    // Memoriza el resultado del filtrado para mejorar el rendimiento
    const postulacionesFiltradas = useMemo(() => {
        const sorted = [...mockApplications].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        if (!filtroEmpresa && !filtroEstatus) {
            return sorted;
        }
        
        // Aplica los filtros seleccionados
        return sorted.filter(postulacion => {
            const matchEmpresa = !filtroEmpresa || postulacion.empresa === filtroEmpresa;
            const matchEstatus = !filtroEstatus || postulacion.estatus === filtroEstatus;
            return matchEmpresa && matchEstatus;
        });
    }, [filtroEmpresa, filtroEstatus]); // Se recalcula solo si los filtros cambian

    const limpiarFiltros = () => {
        setFiltroEmpresa(null);
        setFiltroEstatus(null);
    };
    
    // Función para asignar un color al tag según el estado
    const getStatusColor = (status) => {
        switch (status) {
            case 'Aceptada': return 'success';
            case 'Rechazada': return 'error';
            case 'En revisión': return 'processing';
            default: return 'default';
        }
    };

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Mis Postulaciones</Title>
            
            {/* Barra de filtros de la página */}
            <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                <Flex gap="middle" wrap="wrap" align="center">
                    <Text strong>Filtrar por:</Text>
                    <Select
                        placeholder="Empresa"
                        options={empresasDisponibles}
                        value={filtroEmpresa}
                        onChange={setFiltroEmpresa}
                        style={{ flexGrow: 1, minWidth: 200 }}
                        allowClear
                    />
                    <Select
                        placeholder="Estado de la postulación"
                        options={estatusDisponibles}
                        value={filtroEstatus}
                        onChange={setFiltroEstatus}
                        style={{ flexGrow: 1, minWidth: 200 }}
                        allowClear
                    />
                    <Button
                        icon={<ClearOutlined />}
                        onClick={limpiarFiltros}
                    >
                        Limpiar Filtros
                    </Button>
                </Flex>
            </div>

            {/* Grid que muestra las tarjetas de las postulaciones */}
            <div className='receipts-grid'>
                {postulacionesFiltradas.length > 0 ? (
                    // Itera sobre las postulaciones filtradas para renderizar cada una
                    postulacionesFiltradas.map((item) => (
                        <div key={item.id} className='receipt-card'>
                            <Flex vertical justify="space-between" style={{height: '100%'}}>
                                <div>
                                    <Flex justify="space-between" align="start">
                                        <Title level={5} style={{ margin: 0, color: '#376b83', paddingRight: '8px' }}>
                                            {item.cargo}
                                        </Title>
                                        <Tag icon={<ClockCircleOutlined />} color={getStatusColor(item.estatus)}>
                                            {item.estatus}
                                        </Tag>
                                    </Flex>
                                    <Text type="secondary" style={{display: 'block', marginTop: '8px'}}>
                                        <BankOutlined style={{ marginRight: 8 }} />
                                        {item.empresa}
                                    </Text>
                                    <Text type="secondary" style={{display: 'block', marginTop: '4px'}}>
                                        <CalendarOutlined style={{ marginRight: 8 }} />
                                        Postulado el: {new Date(item.fecha).toLocaleDateString('es-ES')}
                                    </Text>
                                </div>
                            </Flex>
                        </div>
                    ))
                ) : (
                    // Mensaje que aparece si no hay resultados
                    <div className='no-receipts-found'>
                        <Text type="secondary">No se encontraron postulaciones con los filtros seleccionados.</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryOffers;