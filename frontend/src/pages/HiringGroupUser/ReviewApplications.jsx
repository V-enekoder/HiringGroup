import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Typography, Space, Button, Select, Input, Divider, List, Modal, Form, InputNumber, message, Tag, Avatar, Descriptions } from 'antd';
import { UserOutlined, SearchOutlined, SolutionOutlined, DollarOutlined, TeamOutlined, IdcardOutlined, ClearOutlined, PhoneOutlined, MailOutlined, ToolOutlined, BookOutlined }  from '@ant-design/icons';
import '../styles/pag.css';
import { jobOffersService, postulationService, companyService } from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const initialOffers = [
    { id: 101, companyId: 1, cargo: 'Frontend Developer (Senior)', estatus: 'activa', profesion: 'Ing. de Software', salario: 5500 },
    { id: 102, companyId: 2, cargo: 'Diseñador de Producto', estatus: 'activa', profesion: 'Diseño UX/UI', salario: 4800 },
    { id: 103, companyId: 1, cargo: 'Backend Developer (Node.js)', estatus: 'inactiva', profesion: 'Ing. de Software', salario: 6000 },
];
const initialCandidates = [
    { 
        id: 201, 
        name: 'Ana Martínez', 
        email: 'ana.martinez@email.com',
        phone: '555-123-4567',
        profession: 'Ingeniera de Software Senior',
        summary: 'Desarrolladora de software con más de 5 años de experiencia en el ecosistema de React, especializada en la creación de interfaces de usuario escalables y de alto rendimiento.',
        skills: ['React', 'TypeScript', 'Node.js', 'Ant Design', 'GraphQL', 'CI/CD'],
        experience: [
            { id: 1, company: 'Tech Solutions Inc.', role: 'Frontend Developer', period: '2020 - Presente' },
            { id: 2, company: 'Web Innovators', role: 'Jr. Developer', period: '2018 - 2020' },
        ],
        education: [
            { id: 1, institution: 'Universidad Central', degree: 'Ingeniería en Informática', period: '2014 - 2018' }
        ]
    },
    { 
        id: 202, 
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        phone: '555-987-6543',
        profession: 'Diseñador de Producto',
        summary: 'Diseñador UX/UI apasionado por crear productos digitales intuitivos y centrados en el usuario. Experto en metodologías ágiles y design thinking.',
        skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
        experience: [
            { id: 1, company: 'Innovate Marketing', role: 'UX/UI Designer', period: '2019 - Presente' },
        ],
        education: [
            { id: 1, institution: 'Instituto de Diseño', degree: 'Diseño Gráfico', period: '2015 - 2019' }
        ]
    },
];
const initialApplications = [
    { offerId: 101, candidateId: 201 },
    { offerId: 101, candidateId: 202 },
    { offerId: 102, candidateId: 202 },
];

const ReviewApplications = () => {
    // --- ESTADOS ---
    const [offers, setOffers] = useState([]);
    const [postulations, setPostulations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filterCompany, setFilterCompany] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para los modales
    const [isApplicantsModalVisible, setIsApplicantsModalVisible] = useState(false);
    const [isHireModalVisible, setIsHireModalVisible] = useState(false);
    const [isCvModalVisible, setIsCvModalVisible] = useState(false); 
    
    // Datos seleccionados
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedHire, setSelectedHire] = useState(null);
    const [selectedCandidateForCv, setSelectedCandidateForCv] = useState(null); 
    
    const [form] = Form.useForm();

    useEffect(() => {
        const getActiveJobOffers = async () => {
            try{
                const response = await jobOffersService.getActiveOffers()
                const data = response.data
                console.log("Ofertas: ", data)
                setOffers(data)
            }catch(error){
                console.error('Error al cargar ofertas de empleo:', error)
                message.error('Error al cargar las ofertas de empleo desde el servidor.')
            }
        }

        const getAllPostulations = async () => {
            try{
                const response = await postulationService.getAllPostulations()
                const data = response.data
                setPostulations(data)
            }catch(error){
                console.error('Error al cargar las postulaciones de empleo:', error)
                message.error('Error al cargar postulaciones desde el servidor.')
            }
        }

        const getAllCompanies = async () => {
            try{
                const response = await companyService.getAllCompanies()
                const data = response.data
                setCompanies(data)
            }catch(error){
                console.error('Error al cargar empresas:', error);
                message.error('Error al cargar las empresas desde el servidor.');
            }
        }

        getActiveJobOffers()
        getAllPostulations()
        getAllCompanies()
    }, [])

    /*const filteredOffers = useMemo(() => {
        return offers.filter(offer => {
            const company = initialCompanies.find(c => c.id === offer.companyId);
            const matchStatus = offer.estatus === 'activa';
            const matchCompany = !filterCompany || offer.companyId === filterCompany;
            const matchSearch = !searchTerm || offer.cargo.toLowerCase().includes(searchTerm.toLowerCase()) || company.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchStatus && matchCompany;
        });
    }, [offers, filterCompany, searchTerm]);*/
    
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

     const handleOpenCvModal = (candidate) => {
        setSelectedCandidateForCv(candidate);
        setIsCvModalVisible(true);
    };

    const handleCloseCvModal = () => {
        setIsCvModalVisible(false);
        setTimeout(() => setSelectedCandidateForCv(null), 300);
    };

    return (
        <div className='contenedorMain2'>
                <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Revisión de Postulaciones</Title>

            <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                <Flex gap="middle"  align="center">
                    <Text strong style={{ whiteSpace: 'nowrap' }}>Filtrar por:</Text>
                    <Select placeholder="Filtrar por empresa" options={companies.map(c => ({ value: c.id, label: c.companyName }))} value={filterCompany} onChange={setFilterCompany} style={{ flexGrow: 1, minWidth: 200 }} allowClear />
                    <Input placeholder="Buscar por cargo..." prefix={<SearchOutlined />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flexGrow: 2, minWidth: 250 }} allowClear />
                    <Button icon={<ClearOutlined />} onClick={limpiarFiltros}>Limpiar Filtros</Button>
                </Flex>
            </div>

            {/* --- CUADRÍCULA DE OFERTAS (VISTA DE TARJETAS) --- */}
            <div className='receipts-grid'>
                {offers.length > 0 ? (
                    offers.map(offer => {
                        const company = offer.companyName;
                        const applicantCount = initialApplications.filter(app => app.offerId === offer.id).length;
                        return (
                            <div key={offer.id} className='receipt-card' style={{height:'100%'}}>
                                <Flex vertical justify="space-between" style={{height: '100%'}}>
                                    <div>
                                        <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                                            <Tag icon={<TeamOutlined />} color={applicantCount > 0 ? "blue" : "default"}>
                                                {applicantCount} Postulantes
                                            </Tag>
                                            <Text strong>{company}</Text>
                                        </Flex>
                                        <Title level={5} style={{ margin: '0 0 8px 0', color: '#376b83' }}>
                                            {offer.openPosition}
                                        </Title>
                                        <Text type="secondary" style={{display: 'block'}}>
                                            <SolutionOutlined style={{ marginRight: 8 }} />
                                            {offer.professionName}
                                        </Text>
                                        <Text type="secondary" style={{display: 'block'}}>
                                            {offer.description}
                                        </Text>
                                        <Text style={{display: 'block', marginTop: '4px'}}>
                                            <DollarOutlined style={{ marginRight: 8 }} />
                                            {offer.salary} USD/mes
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
                                    <Button type="link" onClick={() => handleOpenCvModal(candidate)}>Ver CV</Button>,
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
         {/* ---MODAL 3 VISTA DE CURRÍCULUM --- */}
            {selectedCandidateForCv && (
                <Modal
                    // Quitamos el título por defecto para tener control total del encabezado
                    title={null} 
                    open={isCvModalVisible}
                    onCancel={handleCloseCvModal}
                    footer={[ <Button key="back" type="primary" onClick={handleCloseCvModal}>Cerrar</Button> ]}
                    width={800}
                    // bodyStyle es importante para quitar paddings extraños del modal por defecto
                    bodyStyle={{ padding: '40px' }}
                >
                    <Flex vertical gap="large">
                        {/* --- ENCABEZADO DEL CURRÍCULUM --- */}
                        <Flex gap="large" align="center">
                            <Avatar size={100} icon={<UserOutlined />} />
                            <Flex vertical>
                                <Title level={3} style={{ margin: 0 }}>{selectedCandidateForCv.name}</Title>
                                <Text type="secondary" style={{ fontSize: '16px' }}>{selectedCandidateForCv.profession}</Text>
                                <Space style={{ marginTop: '8px' }}>
                                    <Text><MailOutlined style={{ marginRight: 4 }}/> {selectedCandidateForCv.email}</Text>
                                    <Text><PhoneOutlined style={{ marginRight: 4 }}/> {selectedCandidateForCv.phone}</Text>
                                </Space>
                            </Flex>
                        </Flex>
                        
                        <Divider />

                        {/* --- SECCIÓN: RESUMEN PROFESIONAL --- */}
                        <div>
                            <Title level={5}>Resumen Profesional</Title>
                            <Paragraph type="secondary">{selectedCandidateForCv.summary}</Paragraph>
                        </div>

                        {/* --- SECCIÓN: HABILIDADES --- */}
                        <div>
                            <Title level={5}><ToolOutlined style={{marginRight: 8}}/> Habilidades</Title>
                            <Flex gap="small" wrap="wrap">
                                {selectedCandidateForCv.skills.map(skill => <Tag key={skill} bordered={false} style={{padding: '4px 10px', fontSize: '14px'}}>{skill}</Tag>)}
                            </Flex>
                        </div>

                        {/* --- SECCIÓN: EXPERIENCIA LABORAL --- */}
                        <div>
                            <Title level={5}><IdcardOutlined style={{marginRight: 8}}/> Experiencia Laboral</Title>
                            {selectedCandidateForCv.experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: 16 }}>
                                    <Text strong>{exp.role}</Text>
                                    <Text type="secondary" style={{display: 'block'}}>{exp.company} | {exp.period}</Text>
                                </div>
                            ))}
                        </div>

                        {/* --- SECCIÓN: EDUCACIÓN --- */}
                        <div>
                            <Title level={5}><BookOutlined style={{marginRight: 8}}/> Educación</Title>
                             {selectedCandidateForCv.education.map(edu => (
                                <div key={edu.id}>
                                    <Text strong>{edu.degree}</Text>
                                    <Text type="secondary" style={{display: 'block'}}>{edu.institution} | {edu.period}</Text>
                                </div>
                            ))}
                        </div>
                    </Flex>
                </Modal>
            )}


        </div>
    );
};

export default ReviewApplications;