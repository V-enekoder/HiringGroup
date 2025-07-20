import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Typography, Button, Select, Tag } from 'antd';
import { ClearOutlined, BankOutlined, ClockCircleOutlined, DollarCircleOutlined} from '@ant-design/icons';
import '../styles/pag.css'; 
import { useAuth } from '../../context/AuthContext';
import { companyService, postulationService } from '../../services/api';

const { Title, Text } = Typography;

const HistoryOffers = () => {
    const { user } = useAuth()
    const candidateId = user?.profile_id
    const [companies, setCompanies] = useState([])
    const [postulations, setPostulations] = useState([])
    // --- Estados para controlar los filtros ---
    const [filtroEmpresa, setFiltroEmpresa] = useState(null);
    const [filtroEstatus, setFiltroEstatus] = useState(null);

    useEffect(() => {
        if(!candidateId) return

        const getCompanies = async () => {
            try{
                const response = await companyService.getAllCompanies()
                const data = response.data

                setCompanies(data)
            }catch(error){
                console.error('Error al cargar empresas:', error)
                message.error('Error al cargar las empresas desde el servidor.')
            }
        }

        const getPostulationsByCandidate = async () => {
            try{
                const response = await postulationService.getPostulationsByCandidate(candidateId)
                const data = response.data

                setPostulations(data)
            }catch(error){
                console.error('Error al cargar postulaciones:', error)
                message.error('Error al cargar las postulaciones desde el servidor.')
            }
        }
        getCompanies()
        getPostulationsByCandidate()
    }, [candidateId])

    // Memoriza el resultado del filtrado para mejorar el rendimiento
    const postulacionesFiltradas = useMemo(() => {
        const sorted = [...postulations].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (!filtroEmpresa && !filtroEstatus) {
            return sorted;
        }
        
        // Aplica los filtros seleccionados
        return sorted.filter(postulacion => {
            const matchEmpresa = !filtroEmpresa || postulacion.jobOfferCompanyName === filtroEmpresa;
            const matchEstatus = !filtroEstatus || postulacion.active === filtroEstatus;
            return matchEmpresa && matchEstatus;
        });
    }, [filtroEmpresa, filtroEstatus, postulations]); // Se recalcula solo si los filtros cambian

    const limpiarFiltros = () => {
        setFiltroEmpresa(null);
        setFiltroEstatus(null);
    };
    
    // Función para asignar un color al tag según el estado
    const getStatusColor = (status) => {
        switch (status) {
            case true: return 'success';
            case false: return 'processing';
            default: return 'default';
        }
    };

    const estatusDisponibles = [...new Set(postulations.map(a => a.hasContract))].map(e => ({
        value: e,
        label: e ? 'Aceptada' : 'En Revision'
    }));

    const companyOptions = companies.map(c => ({
        label: c.companyName,     // lo que se ve en el Select
        value: c.companyName        // lo que se guarda en el form
    }));

    if (!postulacionesFiltradas) {
        return <div>Cargando información...</div>;
    }

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Mis Postulaciones</Title>
            
            {/* Barra de filtros de la página */}
            <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                <Flex gap="middle" wrap="wrap" align="center">
                    <Text strong>Filtrar por:</Text>
                    <Select
                        placeholder="Empresa"
                        options={companyOptions}
                        loading={companies.length === 0}
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
                                            {item.jobOfferPosition}
                                        </Title>
                                        <Tag icon={<ClockCircleOutlined />} color={getStatusColor(item.hasContract)}>
                                            {item.hasContract ? 'Aceptada' : 'En Revision'}
                                        </Tag>
                                    </Flex>
                                    <Text type="secondary" style={{display: 'block', marginTop: '8px'}}>
                                        <BankOutlined style={{ marginRight: 8 }} />
                                        {item.jobOfferCompanyName}
                                    </Text>
                                    <Text type="secondary" style={{display: 'block', marginTop: '4px'}}>
                                        Salario: {item.jobOfferSalary}
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