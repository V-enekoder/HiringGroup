//PAGINA QUE PERMITE EDITAR LAS OFERTAS
import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Typography, Button, Select, Form, Input, Tag, Switch, Modal, message } from 'antd';
import { PlusOutlined, ClearOutlined, SearchOutlined, EditOutlined, DeleteOutlined, DollarOutlined, SolutionOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import EditableField from '../../components/EditableField';
import '../styles/pag.css';
import { jobOffersService, professionService, zoneService } from '../../services/api';

const { Title, Text } = Typography;

// Datos de ejemplo para las ofertas
const initialOffers = [
    { id: 1, profesion: 'Ingeniería de Software', cargo: 'Frontend Developer (Senior)', descripcion: 'Buscamos un desarrollador Frontend...', salario: '50,000 - 65,000 USD/año', estatus: 'activa' },
    { id: 2, profesion: 'Diseño UX/UI', cargo: 'Diseñador de Producto', descripcion: 'Se requiere diseñador de producto...', salario: '45,000 - 55,000 USD/año', estatus: 'activa' },
    { id: 3, profesion: 'Ingeniería de Software', cargo: 'Backend Developer (Node.js)', descripcion: 'Responsable de la lógica del servidor...', salario: '52,000 - 68,000 USD/año', estatus: 'inactiva' },
    { id: 4, profesion: 'Recursos Humanos', cargo: 'Reclutador IT', descripcion: 'Encargado de encontrar y atraer talento...', salario: '35,000 - 45,000 USD/año', estatus: 'activa' }
];

// Opciones para el selector de filtro
const estatusOptions = [
    { value: 'activa', label: 'Activas' },
    { value: 'inactiva', label: 'Inactivas' }
];

const EditOffers = () => {
    const { user } = useAuth()
    const companyId = user?.profile_id

    // --- Estados del componente ---
    const [offers, setOffers] = useState([]); // Almacena la lista completa de ofertas
    const [professions, setProfessions] = useState([])
    const [zones, setZones] = useState([])
    const [editingOffer, setEditingOffer] = useState(null)
    const [filtroEstatus, setFiltroEstatus] = useState(null); // Estado para el filtro de estatus
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null); // Guarda la oferta que se está editando
    const [form] = Form.useForm()

    useEffect(() => {
        if(!companyId) return

        console.log("El id de la empresa es: ", companyId)
        const getOffers = async () => {
            try{
                const response = await jobOffersService.getOffersbyCompany(companyId)
                const data = response.data

                setOffers(data)
            }catch(error){
                console.error('Error al cargar ofertas:', error)
                message.error('Error al cargar las ofertas de la empresa desde el servidor.')
            }
            
        }

        const getProfessions = async () => {
            try{
                const response = await professionService.getAllProfessions()
                const data = response.data

                setProfessions(data)
            }catch(error){
                console.error('Error al cargar profesiones:', error)
                message.error('Error al cargar las profesiones desde el servidor.')
            }
        }

        const getZones = async () => {
            try{
                const response = await zoneService.getAllZones()
                const data = response.data

                setZones(data)
            }catch(error){
                console.error('Error al cargar zonas:', error)
                message.error('Error al cargar las zonas desde el servidor.')
            }
        }

        getOffers()
        getProfessions()
        getZones()
    }, [companyId])

    // Memoriza las ofertas filtradas para optimizar el rendimiento. Solo se recalcula si cambian las dependencias.
    /*const ofertasFiltradas = useMemo(() => {
        return offers.filter(offer => {
            const matchEstatus = !filtroEstatus || offer.estatus === filtroEstatus;
            const matchSearch = !searchTerm ||
                offer.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.profesion.toLowerCase().includes(searchTerm.toLowerCase());
            return matchEstatus && matchSearch;
        });
    }, [offers, filtroEstatus, searchTerm]);*/


    // --- Funciones para manejar las ofertas ---
    const limpiarFiltros = () => {
        setFiltroEstatus(null);
        setSearchTerm('');
    };

    const handleCreate = () => {
        setEditingOffer(null)
        form.resetFields()
        setIsModalVisible(true)
    };

    const handleDelete = async (id) => {
        try{
            await jobOffersService.deleteJobOffer(id)

            setOffers(prev => prev.filter(c => c.id !== id));
            message.success('Oferta eliminada correctamente.');
        }catch(error){
            console.log('Error de validación:', error)
        }
        
    };

    // --- Funciones para controlar el Modal de Edición ---
    const handleEditClick = (offer) => {
        setEditingOffer(offer)
        setOfertaSeleccionada(offer)
        form.setFieldsValue(offer)
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setOfertaSeleccionada(null);
    };

    const handleModalSave = async () => {
        try {
            const values = await form.validateFields();
            values.salary = parseFloat(values.salary);
            
            if (editingOffer) {
                const response = await jobOffersService.updateJobOffer(editingOffer.id, values);
                const updatedOffer = response.data;

                setOffers(prev => prev.map(c => c.id === editingOffer.id ?  updatedOffer : c));
                message.success('Oferta actualizada con éxito.');

            } else {
                values.companyId = companyId;
                const response = await jobOffersService.createNewOffer(values);
                const newOffer = response.data;

                setOffers(prev => [newOffer, ...prev]);
                message.success('Nueva Oferta creada con éxito.');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.log('Error de validación:', error);
        }
    };
    
    // Actualiza el estado temporal de la oferta mientras se edita en el modal
    const handleFieldChangeInModal = (field, value) => {
        setOfertaSeleccionada(prev => ({...prev, [field]: value}));
    };
    
    const handleStatusChangeInModal = (checked) => {
        const newStatus = checked ? true : false;
        setOfertaSeleccionada(prev => ({...prev, active: newStatus}));
    };

    const professionOptions = professions.map(p => ({
        label: p.name,     // lo que se ve en el Select
        value: p.id        // lo que se guarda en el form
    }));

    const zoneOptions = zones.map(z => ({
        label: z.name,     // lo que se ve en el Select
        value: z.id        // lo que se guarda en el form
    }));

    return (
        <div className='contenedorMain2'>
            {/* Encabezado y botón para crear nueva oferta */}
            <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                    <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Mis Ofertas de Empleo</Title>
                <Button icon={<PlusOutlined />} onClick={handleCreate}>
                    Crear Nueva Oferta
                </Button>
            </Flex>
            {/* Barra de filtros */}
            <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                <Flex gap="middle"  align="center">
                    <Text strong style={{ whiteSpace: 'nowrap' }}>Filtrar por:</Text>
                    <Select placeholder="Estado" options={estatusOptions} value={filtroEstatus} onChange={setFiltroEstatus} style={{ minWidth: 150 }} allowClear />
                    <Input placeholder="Buscar por cargo o profesión..." prefix={<SearchOutlined />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flexGrow: 1, minWidth: 200 }} allowClear />
                    <Button icon={<ClearOutlined />} onClick={limpiarFiltros}>Limpiar</Button>
                </Flex>
            </div>

            {/* Grid que muestra las tarjetas de las ofertas */}
            <div className='receipts-grid'>
                {offers.length > 0 ? (
                    // Itera sobre las ofertas filtradas para renderizarlas
                    offers.map((offer) => (
                        <div key={offer.id} className='receipt-card' style={{height: '100%'}}>
                            <Flex vertical justify="space-between" style={{height: '100%'}}>
                                <div>
                                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                                        <Tag color={offer.active ? 'green' : 'volcano'}>
                                            {offer.active ? 'ACTIVO' : 'INACTIVO'}
                                        </Tag>
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(offer.id)} />
                                    </Flex>
                                    <Title level={5} style={{ margin: 0, color: '#376b83' }}>{offer.openPosition}</Title>
                                    <Text type="secondary" style={{display: 'block', marginTop: '4px'}}>{offer.description}</Text>
                                    <Text type="secondary" style={{display: 'block', marginTop: '4px'}}><SolutionOutlined style={{ marginRight: 8 }} />{offer.professionName}</Text>
                                    <Text style={{display: 'block', marginTop: '4px'}}><DollarOutlined style={{ marginRight: 8 }} />{offer.salary}</Text>
                                </div>
                                <Button type="default" icon={<EditOutlined />} style={{width: '100%', marginTop: '16px'}} onClick={() => handleEditClick(offer)}>
                                    Ver / Editar Detalles
                                </Button>
                            </Flex>
                        </div>
                    ))
                ) : (
                    // Mensaje por si no hay ofertas que coincidan con los filtros
                    <div className='no-receipts-found'>
                        <Text type="secondary">No se encontraron ofertas con los filtros seleccionados.</Text>
                    </div>
                )}
            </div>

            {/* Modal que se muestra solo cuando hay una oferta seleccionada para editar */}
            <Modal 
                title={editingOffer ? 'Editar Oferta de Empleo' : 'Crear Nueva Oferta de Empleo'} 
                open={isModalVisible} 
                onOk={handleModalSave} 
                onCancel={handleModalCancel} 
                okText="Guardar" 
                cancelText="Cancelar" 
                width={700} 
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="offerForm" style={{ marginTop: '24px' }}>
                    <Title level={5}>Datos de la Oferta</Title>
                    {editingOffer && ofertaSeleccionada && (
                    <Form.Item name="active" label="Estado del Cargo" rules={[{ required: true }]} >
                        <Tag color={ofertaSeleccionada.active ? 'green' : 'volcano'}>
                            {ofertaSeleccionada.active ? 'ACTIVO' : 'INACTIVO'}
                        </Tag>
                        <Switch checked={ofertaSeleccionada.active} onChange={handleStatusChangeInModal} />
                    </Form.Item>
                )}
                    <Form.Item name="professionId" label="Profesión" rules={[{ required: true, message: 'Seleccione una Profesión' }]}>
                        <Select
                            placeholder="Selecciona una profesión"
                            options={professionOptions}
                            loading={professions.length === 0}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name="zoneId" label="Estado" rules={[{ required: true, message: 'Seleccione un Estado' }]}>
                        <Select
                            placeholder="Selecciona un estado"
                            options={zoneOptions}
                            loading={zones.length === 0}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name="openPosition" label="Cargo" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="salary" label="Salario" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Descripción del Puesto" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditOffers;