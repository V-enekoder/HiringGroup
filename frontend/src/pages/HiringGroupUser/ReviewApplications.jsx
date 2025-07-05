import React, { useState, useMemo } from 'react';
import { Flex, Typography, Button, Select, Input, List, Modal, Form, InputNumber, message, Tag, Avatar, Descriptions } from 'antd';
import { UserOutlined, SearchOutlined, ClearOutlined, SolutionOutlined, DollarOutlined, TeamOutlined, IdcardOutlined, BankOutlined, PhoneOutlined } from '@ant-design/icons';
import '../styles/pag.css';

const { Title, Text } = Typography;

const initialCompanies = [{ id: 1, name: 'Tech Solutions Inc.' }, { id: 2, name: 'Innovate Marketing' }];
const initialOffers = [
    { id: 101, companyId: 1, cargo: 'Frontend Developer (Senior)', estatus: 'activa', profesion: 'Ing. de Software', salario: 5500 },
    { id: 102, companyId: 2, cargo: 'Diseñador de Producto', estatus: 'activa', profesion: 'Diseño UX/UI', salario: 4800 },
    { id: 103, companyId: 1, cargo: 'Backend Developer (Node.js)', estatus: 'inactiva', profesion: 'Ing. de Software', salario: 6000 },
];
const initialCandidates = [
    { id: 201, name: 'Ana Martínez', bloodType: 'A+', emergencyContact: 'Carlos Martínez', emergencyPhone: '555-1111', bank: 'Banesco', accountNumber: '0134...' },
    { id: 202, name: 'Juan Pérez', bloodType: 'O-', emergencyContact: 'María González', emergencyPhone: '555-2222', bank: 'Mercantil', accountNumber: '0105...' },
];
const initialApplications = [
    { offerId: 101, candidateId: 201 },
    { offerId: 101, candidateId: 202 },
    { offerId: 102, candidateId: 202 },
];

const ReviewApplications = () => {
    // --- ESTADOS ---
    const [offers, setOffers] = useState(initialOffers);
    const [filterCompany, setFilterCompany] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para los modales
    const [isApplicantsModalVisible, setIsApplicantsModalVisible] = useState(false);
    const [isHireModalVisible, setIsHireModalVisible] = useState(false);
    
    // Datos seleccionados
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedHire, setSelectedHire] = useState(null);
    
    const [form] = Form.useForm();

    const filteredOffers = useMemo(() => {
        return offers.filter(offer => {
            const company = initialCompanies.find(c => c.id === offer.companyId);
            const matchStatus = offer.estatus === 'activa';
            const matchCompany = !filterCompany || offer.companyId === filterCompany;
            const matchSearch = !searchTerm || offer.cargo.toLowerCase().includes(searchTerm.toLowerCase()) || company.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchStatus && matchCompany;
        });
    }, [offers, filterCompany, searchTerm]);
    
    const limpiarFiltros = () => {
        setFiltroEstatus(null);
        setSearchTerm('');
    };
    // --- MANEJADORES DE MODALES ---
    const handleOpenApplicantsModal = (offer) => {
        setSelectedOffer(offer);
        setIsApplicantsModalVisible(true);
    };

    const handleCloseApplicantsModal = () => {
        setIsApplicantsModalVisible(false);
        setSelectedOffer(null);
    };

    const handleOpenHireModal = (offer, candidate) => {
        setSelectedHire({ offer, candidate });
        form.setFieldsValue({ salary: offer.salario });
        setIsApplicantsModalVisible(false); // Cerramos el primer modal
        setIsHireModalVisible(true);       // Abrimos el segundo
    };

    const handleCloseHireModal = () => {
        setIsHireModalVisible(false);
        setSelectedHire(null);
        form.resetFields();
    };
    
    const handleFinalizeHire = async () => {
        try {
            const values = await form.validateFields();
            console.log('CONTRATACIÓN FINALIZADA:', { candidateId: selectedHire.candidate.id, offerId: selectedHire.offer.id, contractDetails: values });
            setOffers(prev => prev.map(o => o.id === selectedHire.offer.id ? { ...o, estatus: 'inactiva' } : o));
            message.success(`${selectedHire.candidate.name} ha sido contratado exitosamente!`);
            handleCloseHireModal();
        } catch (error) {
            console.log('Error en la finalización:', error);
        }
    };

    return (
        <div className='contenedorMain2'>
                <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Revisión de Postulaciones</Title>

            <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                <Flex gap="middle"  align="center">
                    <Text strong style={{ whiteSpace: 'nowrap' }}>Filtrar por:</Text>
                    <Select placeholder="Filtrar por empresa" options={initialCompanies.map(c => ({ value: c.id, label: c.name }))} value={filterCompany} onChange={setFilterCompany} style={{ flexGrow: 1, minWidth: 200 }} allowClear />
                    <Input placeholder="Buscar por cargo..." prefix={<SearchOutlined />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flexGrow: 2, minWidth: 250 }} allowClear />
                    <Button icon={<ClearOutlined />} onClick={limpiarFiltros}>Limpiar Filtros</Button>
                </Flex>
            </div>

            {/* --- CUADRÍCULA DE OFERTAS (VISTA DE TARJETAS) --- */}
            <div className='receipts-grid'>
                {filteredOffers.length > 0 ? (
                    filteredOffers.map(offer => {
                        const company = initialCompanies.find(c => c.id === offer.companyId);
                        const applicantCount = initialApplications.filter(app => app.offerId === offer.id).length;
                        return (
                            <div key={offer.id} className='receipt-card' style={{height:'100%'}}>
                                <Flex vertical justify="space-between" style={{height: '100%'}}>
                                    <div>
                                        <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                                            <Tag icon={<TeamOutlined />} color={applicantCount > 0 ? "blue" : "default"}>
                                                {applicantCount} Postulantes
                                            </Tag>
                                            <Text strong>{company.name}</Text>
                                        </Flex>
                                        <Title level={5} style={{ margin: '0 0 8px 0', color: '#376b83' }}>
                                            {offer.cargo}
                                        </Title>
                                        <Text type="secondary" style={{display: 'block'}}>
                                            <SolutionOutlined style={{ marginRight: 8 }} />
                                            {offer.profesion}
                                        </Text>
                                        <Text style={{display: 'block', marginTop: '4px'}}>
                                            <DollarOutlined style={{ marginRight: 8 }} />
                                            {offer.salario} USD/mes
                                        </Text>
                                    </div>
                                    <Button 
                                        type="dashed"
                                        icon={<UserOutlined />} 
                                        style={{width: '100%', marginTop: '16px'}}
                                        onClick={() => handleOpenApplicantsModal(offer)}
                                        disabled={applicantCount === 0}
                                    >
                                        Ver Postulantes
                                    </Button>
                                </Flex>
                            </div>
                        );
                    })
                ) : (
                    <div className='no-receipts-found'>
                        <Text type="secondary">No hay ofertas activas que coincidan.</Text>
                    </div>
                )}
            </div>
            
            {/* --- MODAL 1: LISTA DE POSTULANTES --- */}
            {selectedOffer && (
                <Modal
                    title={`Postulantes para: ${selectedOffer.cargo}`}
                    open={isApplicantsModalVisible}
                    onCancel={handleCloseApplicantsModal}
                    footer={[ <Button key="back" onClick={handleCloseApplicantsModal}>Cerrar</Button> ]}
                    width={600}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={initialApplications.filter(app => app.offerId === selectedOffer.id).map(app => initialCandidates.find(c => c.id === app.candidateId))}
                        renderItem={candidate => (
                            <List.Item
                                actions={[ 
                                    <Button type="link">Ver CV</Button>,
                                    <Button type="dashed" onClick={() => handleOpenHireModal(selectedOffer, candidate)}>Contratar</Button> 
                                ]}
                            >
                                <Flex align="center" gap="middle" style={{ flexGrow: 1 }}>
                                    <Avatar icon={<UserOutlined />} />
                                    <Text>{candidate.name}</Text>
                                </Flex>
                            </List.Item>
                        )}
                    />
                </Modal>
            )}

            {/* --- MODAL 2: PROCESO DE CONTRATACIÓN --- */}
            {selectedHire && (
                <Modal
                    title={`Contratar a ${selectedHire.candidate.name}`}
                    open={isHireModalVisible}
                    onCancel={handleCloseHireModal}
                    onOk={handleFinalizeHire}
                    okText="Finalizar Contratación"
                    cancelText="Cancelar"
                    width={700}
                >
                    <Form form={form} layout="vertical" style={{marginTop: '24px'}}>
                        <Title level={5}>Definir Condiciones del Contrato</Title>
                        <Form.Item name="contractDuration" label="Tiempo de Contratación" rules={[{required: true}]}>
                            <Select options={[{value: '1m', label: '1 Mes'}, {value: '6m', label: '6 Meses'}, {value: '1y', label: '1 Año'}, {value: 'indefinite', 'label': 'Indefinido'}]} />
                        </Form.Item>
                        <Form.Item name="salary" label="Salario Mensual a Devengar (USD)" rules={[{required: true}]}>
                            <InputNumber prefix={<DollarOutlined />} style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                    
                    <Title level={5} style={{marginTop: '24px'}}>Verificar Datos del Candidato</Title>
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Tipo de Sangre">{selectedHire.candidate.bloodType || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Contacto de Emergencia">{selectedHire.candidate.emergencyContact || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Teléfono de Emergencia">{selectedHire.candidate.emergencyPhone || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Banco">{selectedHire.candidate.bank || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Nro. de Cuenta">{selectedHire.candidate.accountNumber || 'No especificado'}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
        </div>
    );
};

export default ReviewApplications;