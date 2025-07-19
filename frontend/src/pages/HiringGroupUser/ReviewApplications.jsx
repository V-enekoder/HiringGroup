import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Typography, Space, Button, Select, Input, Divider, List, Modal, Form, InputNumber, message, Tag, Avatar, Descriptions } from 'antd';
import { UserOutlined, SearchOutlined, SolutionOutlined, DollarOutlined, TeamOutlined, IdcardOutlined, ClearOutlined, PhoneOutlined, MailOutlined, ToolOutlined, BookOutlined }  from '@ant-design/icons';
import '../styles/pag.css';
import { jobOffersService, postulationService, companyService, candidateService, curriculumService, contractingPeriodService, emergencyContactService, contractService } from '../../services/api';

const { Title, Text, Paragraph } = Typography;

const ReviewApplications = () => {
    // --- ESTADOS ---
    const [offers, setOffers] = useState([]);
    const [postulationsByOffer, setPostulationsByOffer] = useState({});
    const [companies, setCompanies] = useState([]);
    const [candidates, setCandidates] = useState([])
    const [curriculum, setCurriculum] = useState(null)
    const [contractingPeriods, setContractingPeriods] = useState([])
    const [emergencyContact, setEmergencyContact] = useState(null)
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
    
    const [form] = Form.useForm()

    useEffect(() => {
        const getActiveJobOffers = async () => {
            try{
                const response = await jobOffersService.getActiveOffers()
                const data = response.data
                
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

        const getAllContractingPeriods = async () => {
            try{
                const response = await contractingPeriodService.getAllContractingPeriods()
                const data = response.data
                setContractingPeriods(data)
            }catch(error){
                console.error('Error al cargar periodos de contratación:', error);
                message.error('Error al cargar los periodos desde el servidor.');
            }
        }

        getActiveJobOffers()
        getAllPostulations()
        getAllCompanies()
        getAllContractingPeriods()
    }, [])

    useEffect(() => {
        const getPostulationsPerOffer = async () => {
            const result = {};

            for (const offer of offers) {
                try {
                    const response = await postulationService.getPostulationsByJobOffer(offer.id);
                    result[offer.id] = response.data;
                } catch (error) {
                    console.error(`Error al cargar postulaciones para la oferta ${offer.id}:`, error);
                }
            }

            setPostulationsByOffer(result);
        };

        if (offers.length > 0) {
            getPostulationsPerOffer();
        }
    }, [offers]);

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
    const handleOpenApplicantsModal = async (offer) => {
        setSelectedOffer(offer);
        setIsApplicantsModalVisible(true);

        try {
            const postulations = postulationsByOffer[offer.id] || [];

            const candidatePromises = postulations.map(p =>
                candidateService.getCandidateProfile(p.candidateId).then(res => res.data)
            );

            const candidateData = await Promise.all(candidatePromises);
            setCandidates(candidateData);

        } catch (error) {
            console.error("Error al cargar candidatos:", error);
            message.error("No se pudieron cargar los candidatos.");
        }
    };

    const handleCloseApplicantsModal = () => {
        setIsApplicantsModalVisible(false);
        setSelectedOffer(null);
    };

    const handleOpenHireModal = async (offer, candidate) => {
        console.log("Oferta: ", offer)
        console.log("Candidato: ", candidate)
        setSelectedHire({ offer, candidate });
        form.setFieldsValue({ salary: offer.salary });
        setIsApplicantsModalVisible(false); // Cerramos el primer modal
        setIsHireModalVisible(true);       // Abrimos el segundo

        try{
            const response = await emergencyContactService.getEmergencyContactbyCandidateId(candidate.candidate_id)
            const data = response.data
            console.log("Contacto: ", data)
            setEmergencyContact(data)
        }catch(error){
            console.error("Error al cargar contacto de emergencia:", error);
            message.error("No se pudieron cargar contanco.");
        }
    };

    const handleCloseHireModal = () => {
        setIsHireModalVisible(false);
        setSelectedHire(null);
        form.resetFields();
    };
    
    const handleFinalizeHire = async () => {
        try {
            const values = await form.validateFields();
            const offerPostulations = postulationsByOffer[selectedHire.offer.id];
            const matchedPostulation = offerPostulations.find(
                (p) => p.candidateId === selectedHire.candidate.candidate_id
            );
            const postulationId = matchedPostulation?.id;
            const dataToSend = {
                periodId: values.periodId,
                postulationId: postulationId
            };

            await contractService.createNewContract(dataToSend)
            message.success(`${selectedHire.candidate.name} ha sido contratado exitosamente!`);

            setOffers(prev => prev.filter(c => c.id !== selectedHire.offer.id));

            const updatedPostulations = { ...postulationsByOffer };
            updatedPostulations[selectedHire.offer.id] = offerPostulations.filter(
                (p) => p.candidateId !== selectedHire.candidate.candidate_id
            );
            setPostulationsByOffer(updatedPostulations);

            handleCloseHireModal();
        } catch (error) {
            console.log('Error en la finalización:', error);
        }
    };

    const handleOpenCvModal = async (candidate) => {
        setSelectedCandidateForCv(candidate);
        setIsCvModalVisible(true);

        try{
            const response = await curriculumService.getCurriculumByCandidateId(candidate.candidate_id)
            const data = response.data

            setCurriculum(data)
        }catch(error){
            console.error("Error al cargar curriculum:", error)
            message.error("No se pudo cargar el curriculum.")
        }
    };

    const handleCloseCvModal = () => {
        setIsCvModalVisible(false);
        setTimeout(() => setSelectedCandidateForCv(null), 300);
    };

    const periodOptions = contractingPeriods.map(c => ({
        label: c.name,     // lo que se ve en el Select
        value: c.id        // lo que se guarda en el form
    }));

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
                        const applicantCount = postulationsByOffer[offer.id]?.length || 0;
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
                    title={`Postulantes para: ${selectedOffer.openPosition}`}
                    open={isApplicantsModalVisible}
                    onCancel={handleCloseApplicantsModal}
                    footer={[ <Button key="back" onClick={handleCloseApplicantsModal}>Cerrar</Button> ]}
                    width={600}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={candidates}
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
            {selectedHire && emergencyContact && (
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
                        <Form.Item name="periodId" label="Tiempo de Contratación" rules={[{required: true}]}>
                            <Select
                                placeholder="Seleccione un tiempo de contratación"
                                options={periodOptions}
                                loading={contractingPeriods.length === 0}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item name="salary" label="Salario Mensual a Devengar (USD)" rules={[{required: true}]}>
                            <InputNumber prefix={<DollarOutlined />} style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                    
                    <Title level={5} style={{marginTop: '24px'}}>Verificar Datos del Candidato</Title>
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Tipo de Sangre">{selectedHire.candidate.bloodType || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Contacto de Emergencia">{emergencyContact.name || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Teléfono de Emergencia">{emergencyContact.phone_number || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Banco">{selectedHire.candidate.bank_name || 'No especificado'}</Descriptions.Item>
                        <Descriptions.Item label="Nro. de Cuenta">{selectedHire.candidate.bankAccount || 'No especificado'}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
         {/* ---MODAL 3 VISTA DE CURRÍCULUM --- */}
            {selectedCandidateForCv && curriculum && (
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
                                <Text type="secondary" style={{ fontSize: '16px' }}>{curriculum.profession_name}</Text>
                                <Space style={{ marginTop: '8px' }}>
                                    <Text><MailOutlined style={{ marginRight: 4 }}/> {selectedCandidateForCv.email}</Text>
                                    <Text><PhoneOutlined style={{ marginRight: 4 }}/> {selectedCandidateForCv.phoneNumber}</Text>
                                </Space>
                            </Flex>
                        </Flex>
                        
                        <Divider />

                        {/* --- SECCIÓN: RESUMEN PROFESIONAL --- */}
                        <div>
                            <Title level={5}>Resumen Profesional</Title>
                            <Paragraph type="secondary">{curriculum.resume}</Paragraph>
                        </div>

                        {/* --- SECCIÓN: HABILIDADES --- */}
                        <div>
                            <Title level={5}><ToolOutlined style={{marginRight: 8}}/> Habilidades</Title>
                            <Flex gap="small" wrap="wrap">
                                <Text>{curriculum.skills}</Text>
                            </Flex>
                        </div>

                        {/* --- SECCIÓN: EXPERIENCIA LABORAL --- */}
                        <div>
                            <Title level={5}><IdcardOutlined style={{marginRight: 8}}/> Experiencia Laboral</Title>
                            {curriculum.laboral_experiences.map(exp => (
                                <div key={exp.id} style={{ marginBottom: 16 }}>
                                    <Text strong>{exp.job_title}</Text>
                                    <Text type="secondary" style={{display: 'block'}}>{exp.company} | {exp.start_date}</Text>
                                </div>
                            ))}
                        </div>

                        {/* --- SECCIÓN: EDUCACIÓN --- */}
                        <div>
                            <Title level={5}><BookOutlined style={{marginRight: 8}}/> Educación</Title>
                                <div>
                                    <Text type="secondary" style={{display: 'block'}}>{curriculum.university_of_graduation} </Text>
                                </div>
                        </div>
                    </Flex>
                </Modal>
            )}


        </div>
    );
};

export default ReviewApplications;