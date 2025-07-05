import React, { useState, useMemo } from 'react';
import { Flex, Row, Col, Input, Button, Modal, Typography, Form, Select, Descriptions, message } from 'antd';
import { ClearOutlined, CompassOutlined, ClockCircleOutlined } from '@ant-design/icons';

import ListOffers from "../../components/ListOffers";
import CardCurriculum from '../../components/cardCurriculum';

import '../styles/pag.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Datos de ejemplo para las ofertas
const offerData = [
    { id: 1, company: 'Harvard University', profession: 'Ingeniero de Software', estado: 'Bolivar', description: 'Buscamos un talentoso ingeniero...', position: 'Jefe de Proyecto', salary: '100' },
    { id: 2, company: 'Google', profession: 'Diseñador UX/UI', estado: 'Carabobo', description: 'Oportunidad para un diseñador creativo...', position: 'Senior Designer', salary: '120' },
    { id: 3, company: 'Spotify', profession: 'Data Scientist', estado: 'Bolivar', description: 'Analiza grandes conjuntos de datos...', position: 'Mid-Level Scientist', salary: '110' },
    { id: 4, company: 'Microsoft', profession: 'Ingeniero de Software', estado: 'Delta Amacuro', description: 'Únete a nuestro equipo de cloud...', position: 'Cloud Engineer', salary: '130' },
];

// Opciones para el filtro de estados
const estados = [
    { value: 'Bolivar', label: 'Bolivar' },
    { value: 'Carabobo', label: 'Carabobo' },
    { value: 'Delta Amacuro', label: 'Delta Amacuro' },
];

const JobOffers = () => {
    // --- ESTADOS ---
    // Estados para controlar la visibilidad de los modales y los filtros.
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Memoriza las ofertas filtradas para optimizar el rendimiento.
    // Se recalcula solo cuando cambian los filtros o el término de búsqueda.
    const filteredOffers = useMemo(() => {
        let offers = offerData;

        if (filtroEstado) {
            offers = offers.filter(offer => offer.estado === filtroEstado);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            offers = offers.filter(offer =>
                offer.profession.toLowerCase().includes(lowercasedTerm) ||
                offer.company.toLowerCase().includes(lowercasedTerm) ||
                offer.position.toLowerCase().includes(lowercasedTerm)
            );
        }
        
        return offers;
    }, [searchTerm, filtroEstado]);

    // Abre el modal con los detalles de la oferta seleccionada.
    const showDetailsModal = (item) => {
        setSelectedOffer(item);
        setIsDetailsModalOpen(true);
    };

    const handleDetailsCancel = () => {
        setIsDetailsModalOpen(false);
    };

    // Simula la postulación y cierra el modal.
    const handleApply = () => {
        message.success(`Te has postulado exitosamente a: ${selectedOffer.profession}`);
        setIsDetailsModalOpen(false);
    };
    
    // Resetea los estados de los filtros a su valor inicial.
    const limpiarFiltros = () => {
        setFiltroEstado(null);
        setSearchTerm('');
    };

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Búsqueda de Ofertas</Title>

            {/* Estructura principal de la página: currículum a la izquierda, ofertas a la derecha. */}
            <Row justify="center" gutter={[32, 32]}>
                <Col xs={24} md={8} lg={7} xl={6}>
                    <CardCurriculum />
                </Col>

                <Col xs={24} md={16} lg={17} xl={18}>
                    <Flex vertical gap="large">
                        
                        {/* Contenedor para la barra de búsqueda y filtros principales. */}
                        <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                            <Flex gap="middle" align="center">
                                <Search style={{ flexGrow: 1 }} size='large' placeholder="Buscar cargo, profesión o empresa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} allowClear />
                                <Select placeholder="Estados" options={estados} value={filtroEstado} onChange={setFiltroEstado} size='large' style={{ minWidth: 200 }} allowClear />
                                <Button icon={<ClearOutlined />} onClick={limpiarFiltros} size='large'>Limpiar Filtros</Button>
                            </Flex>
                        </div>

                        <div>
                            {/* Componente que renderiza la lista de ofertas filtradas. */}
                            <ListOffers offers={filteredOffers} onShowDetails={showDetailsModal} />
                        </div>
                    </Flex>
                </Col>
            </Row>

            {/* Modal para ver los detalles, se muestra solo si hay una oferta seleccionada. */}
            {selectedOffer && (
                <Modal title={<Title level={3}>Detalles de la Oferta</Title>} open={isDetailsModalOpen} onCancel={handleDetailsCancel} footer={[ <Button key="back" onClick={handleDetailsCancel}>Cerrar</Button>, <Button key="submit" type="primary" onClick={handleApply}>Postularme</Button>, ]} width={700}>
                    <div>
                        <Text type="secondary">{selectedOffer.company}</Text>
                        <Title level={2} style={{ marginTop: 0, color: '#376b83' }}>{selectedOffer.profession}</Title>
                    </div>
                    <Descriptions bordered column={1} size="small" style={{ margin: '24px 0' }}>
                        <Descriptions.Item label="Cargo a Ocupar">{selectedOffer.position}</Descriptions.Item>
                        <Descriptions.Item label="Zona de Trabajo">{selectedOffer.estado}</Descriptions.Item>
                        <Descriptions.Item label="Salario Anual Estimado">${selectedOffer.salary}K</Descriptions.Item>
                    </Descriptions>
                    <div>
                        <Title level={5}>Descripción Completa del Puesto</Title>
                        <Paragraph>{selectedOffer.description}</Paragraph>
                    </div>
                </Modal>
            )}

            {/* Modal para filtros avanzados (actualmente no activado en la UI). */}
            <Modal title="Filtros Avanzados" open={isFilterModalOpen} onOk={() => setIsFilterModalOpen(false)} onCancel={() => setIsFilterModalOpen(false)} okText="Aplicar Filtros" cancelText="Cerrar">
                <Form layout="vertical" style={{ marginTop: '24px' }}>
                    <Form.Item label="Zona Geográfica"><Select mode="multiple" allowClear placeholder="Seleccionar zonas" prefix={<CompassOutlined />}><Select.Option value="caracas">Caracas</Select.Option><Select.Option value="valencia">Valencia</Select.Option><Select.Option value="maracay">Maracay</Select.Option></Select></Form.Item>
                    <Form.Item label="Tipo de Contrato"><Select allowClear placeholder="Seleccionar tipo de contrato" prefix={<ClockCircleOutlined />}><Select.Option value="full_time">Tiempo Completo</Select.Option><Select.Option value="part_time">Medio Tiempo</Select.Option><Select.Option value="freelance">Freelance</Select.Option></Select></Form.Item>
                    <Form.Item label="Rango Salarial"><Input.Group compact><Input style={{ width: 'calc(50% - 15px)' }} placeholder="Mínimo" /><Input className="site-input-split" style={{ width: '30px', borderLeft: 0, borderRight: 0, pointerEvents: 'none' }} placeholder="-" disabled /><Input style={{ width: 'calc(50% - 15px)' }} placeholder="Máximo" /></Input.Group></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default JobOffers;