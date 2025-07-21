import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Row, Col, Input, Button, Modal, Typography, Form, Select, Descriptions, message } from 'antd';
import { ClearOutlined, CompassOutlined, ClockCircleOutlined } from '@ant-design/icons';

import ListOffers from "../../components/ListOffers";
import CardCurriculum from '../../components/cardCurriculum';

import '../styles/pag.css';
import { curriculumService, jobOffersService, postulationService, zoneService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const JobOffers = () => {
    const { user } = useAuth()
    const candidateId = user?.profile_id

    const [jobOffers, setJobOffers] = useState([])
    const [zones, setZones] = useState([])
    const [curriculum, setCurriculum] = useState(null)
    // --- ESTADOS ---
    // Estados para controlar la visibilidad de los modales y los filtros.
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!candidateId) return
        const getJobOffers = async () => {
            try {
                const response = await jobOffersService.getActiveOffers()
                const data = response.data

                setJobOffers(data)
            } catch (error) {
                console.error('Error al cargar ofertas de empleo:', error)
                message.error('Error al cargar las ofertas de empleo desde el servidor.')
            }
        }

        const getZones = async () => {
            try {
                const response = await zoneService.getAllZones()
                const data = response.data

                setZones(data)
            } catch (error) {
                console.error('Error al cargar zonas:', error)
                message.error('Error al cargar las zonas desde el servidor.')
            }
        }

        const getCurriculumByCandidateId = async () => {
            try {
                const response = await curriculumService.getCurriculumByCandidateId(candidateId)
                const data = response.data

                setCurriculum(data)
            } catch (error) {
                console.error('Error al cargar curriculum:', error)
                message.error('Error al cargar el curriculum desde el servidor.')
            }
        }

        getJobOffers()
        getZones()
        getCurriculumByCandidateId()
    }, [candidateId])

    // Memoriza las ofertas filtradas para optimizar el rendimiento.
    // Se recalcula solo cuando cambian los filtros o el término de búsqueda.
    const filteredOffers = useMemo(() => {
        let offers = jobOffers;

        if (filtroEstado) {
            offers = offers.filter(offer => offer.zoneName === filtroEstado);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            offers = offers.filter(offer =>
                offer.professionName.toLowerCase().includes(lowercasedTerm) ||
                offer.companyName.toLowerCase().includes(lowercasedTerm) ||
                offer.openPosition.toLowerCase().includes(lowercasedTerm)
            );
        }

        return offers;
    }, [searchTerm, filtroEstado, jobOffers]);

    // Abre el modal con los detalles de la oferta seleccionada.
    const showDetailsModal = (item) => {
        setSelectedOffer(item);
        setIsDetailsModalOpen(true);
    };

    const handleDetailsCancel = () => {
        setIsDetailsModalOpen(false);
    };

    // Simula la postulación y cierra el modal.
    const handleApply = async () => {

        if (user?.hired || user?.is_hired) {
            message.warning('Ya estás contratado. No puedes postularte a nuevas ofertas.');
            return;
        }

        try {
            console.log("candidato: ", candidateId, "oferta: ", selectedOffer.id)
            const dataToSend = {
                candidateId: candidateId,
                jobId: selectedOffer.id
            }
            await postulationService.creaneNewPostulation(dataToSend)

            message.success(`Te has postulado exitosamente a: ${selectedOffer.profession}`);
            setIsDetailsModalOpen(false);
        } catch (error) {
            console.error('Error al postularse al puesto:', error)
            message.error('Hubo un error al postularse. Intenta de nuevo más tarde.');
        }
    };

    // Resetea los estados de los filtros a su valor inicial.
    const limpiarFiltros = () => {
        setFiltroEstado(null);
        setSearchTerm('');
    };

    const zoneOptions = zones.map(z => ({
        label: z.name,     // lo que se ve en el Select
        value: z.name        // lo que se guarda en el form
    }));

    if (!curriculum) {
        return <div>Cargando información...</div>;
    }

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Búsqueda de Ofertas</Title>

            {/* Estructura principal de la página: currículum a la izquierda, ofertas a la derecha. */}
            <Row justify="center" gutter={[32, 32]}>
                <Col xs={24} md={8} lg={7} xl={6}>
                    <CardCurriculum info={curriculum} />
                </Col>

                <Col xs={24} md={16} lg={17} xl={18}>
                    <Flex vertical gap="large">

                        {/* Contenedor para la barra de búsqueda y filtros principales. */}
                        <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                            <Flex gap="middle" align="center">
                                <Search style={{ flexGrow: 1 }} size='large' placeholder="Buscar cargo, profesión o empresa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} allowClear />
                                <Select
                                    placeholder="Estados"
                                    options={zoneOptions}
                                    loading={zones.length === 0}
                                    value={filtroEstado}
                                    onChange={setFiltroEstado}
                                    size='large'
                                    style={{ minWidth: 200 }}
                                    allowClear
                                />
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
                <Modal title={<Title level={3}>Detalles de la Oferta</Title>} open={isDetailsModalOpen} onCancel={handleDetailsCancel} footer={[<Button key="back" onClick={handleDetailsCancel}>Cerrar</Button>, <Button key="submit" type="primary" onClick={handleApply} disabled={user?.hired || user?.is_hired}>Postularme</Button>,]} width={700}>
                    <div>
                        <Text type="secondary">{selectedOffer.companyName}</Text>
                        <Title level={2} style={{ marginTop: 0, color: '#376b83' }}>{selectedOffer.professionName}</Title>
                    </div>
                    <Descriptions bordered column={1} size="small" style={{ margin: '24px 0' }}>
                        <Descriptions.Item label="Cargo a Ocupar">{selectedOffer.openPosition}</Descriptions.Item>
                        <Descriptions.Item label="Zona de Trabajo">{selectedOffer.zoneName}</Descriptions.Item>
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