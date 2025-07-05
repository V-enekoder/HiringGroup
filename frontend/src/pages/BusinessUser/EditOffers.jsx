//PAGINA QUE PERMITE EDITAR LAS OFERTAS
import React, { useState, useMemo } from 'react';
import { Flex, Typography, Button, Select, Input, Tag, Switch, Modal, message } from 'antd';
import { PlusOutlined, ClearOutlined, SearchOutlined, EditOutlined, DeleteOutlined, DollarOutlined, SolutionOutlined } from '@ant-design/icons';
import EditableField from '../../components/EditableField';
import '../styles/pag.css';

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
    // --- Estados del componente ---
    const [offers, setOffers] = useState(initialOffers); // Almacena la lista completa de ofertas
    const [filtroEstatus, setFiltroEstatus] = useState(null); // Estado para el filtro de estatus
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null); // Guarda la oferta que se está editando

    // Memoriza las ofertas filtradas para optimizar el rendimiento. Solo se recalcula si cambian las dependencias.
    const ofertasFiltradas = useMemo(() => {
        return offers.filter(offer => {
            const matchEstatus = !filtroEstatus || offer.estatus === filtroEstatus;
            const matchSearch = !searchTerm ||
                offer.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.profesion.toLowerCase().includes(searchTerm.toLowerCase());
            return matchEstatus && matchSearch;
        });
    }, [offers, filtroEstatus, searchTerm]);


    // --- Funciones para manejar las ofertas ---
    const limpiarFiltros = () => {
        setFiltroEstatus(null);
        setSearchTerm('');
    };

    const addOffer = () => {
        const newOffer = { id: Date.now(), profesion: 'Nueva Profesión', cargo: 'Nuevo Cargo Vacante', descripcion: 'Añade aquí la descripción del puesto.', salario: 'Rango salarial', estatus: 'activa' };
        setOffers(prevOffers => [newOffer, ...prevOffers]);
        message.success('Nueva oferta creada. ¡Edítala para añadir los detalles!');
    };

    const removeOffer = (id) => {
        Modal.confirm({ title: '¿Estás seguro de que quieres eliminar esta oferta?', content: 'Esta acción no se puede deshacer.', okText: 'Sí, eliminar', okType: 'danger', cancelText: 'No, cancelar', onOk() { setOffers(prevOffers => prevOffers.filter(o => o.id !== id)); message.warning('Oferta eliminada correctamente.'); }, });
    };

    // --- Funciones para controlar el Modal de Edición ---
    const handleEditClick = (offer) => {
        setOfertaSeleccionada({ ...offer }); // Clona la oferta para evitar mutaciones directas
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setOfertaSeleccionada(null);
    };

    const handleModalSave = () => {
        // Actualiza la lista principal con los datos de la oferta editada
        setOffers(prevOffers => prevOffers.map(o => o.id === ofertaSeleccionada.id ? ofertaSeleccionada : o));
        message.success('¡Oferta actualizada con éxito!');
        handleModalCancel();
    };
    
    // Actualiza el estado temporal de la oferta mientras se edita en el modal
    const handleFieldChangeInModal = (field, value) => {
        setOfertaSeleccionada(prev => ({...prev, [field]: value}));
    };
    
    const handleStatusChangeInModal = (checked) => {
        const newStatus = checked ? 'activa' : 'inactiva';
        setOfertaSeleccionada(prev => ({...prev, estatus: newStatus}));
    };

    return (
        <div className='contenedorMain2'>
            {/* Encabezado y botón para crear nueva oferta */}
            <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                    <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Mis Ofertas de Empleo</Title>
                <Button icon={<PlusOutlined />} onClick={addOffer}>
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
                {ofertasFiltradas.length > 0 ? (
                    // Itera sobre las ofertas filtradas para renderizarlas
                    ofertasFiltradas.map((offer) => (
                        <div key={offer.id} className='receipt-card' style={{height: '230px'}}>
                            <Flex vertical justify="space-between" style={{height: '100%'}}>
                                <div>
                                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                                        <Tag color={offer.estatus === 'activa' ? 'green' : 'volcano'}>{offer.estatus.toUpperCase()}</Tag>
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeOffer(offer.id)} />
                                    </Flex>
                                    <Title level={5} style={{ margin: 0, color: '#376b83' }}>{offer.cargo}</Title>
                                    <Text type="secondary" style={{display: 'block', marginTop: '4px'}}><SolutionOutlined style={{ marginRight: 8 }} />{offer.profesion}</Text>
                                    <Text style={{display: 'block', marginTop: '4px'}}><DollarOutlined style={{ marginRight: 8 }} />{offer.salario}</Text>
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
            {ofertaSeleccionada && (
                <Modal title={<Title level={4}>Editar Oferta de Empleo</Title>} open={isModalVisible} onOk={handleModalSave} onCancel={handleModalCancel} okText="Guardar Cambios" cancelText="Cancelar" width={700} destroyOnClose>
                    <Flex vertical gap="1.5rem" style={{marginTop: '24px'}}>
                        <Flex align="center" justify="space-between">
                            <Text strong>Estado de la oferta:</Text>
                            <Flex align="center" gap="small">
                                <Tag color={ofertaSeleccionada.estatus === 'activa' ? 'green' : 'volcano'}>{ofertaSeleccionada.estatus.toUpperCase()}</Tag>
                                <Switch checked={ofertaSeleccionada.estatus === 'activa'} onChange={handleStatusChangeInModal} />
                            </Flex>
                        </Flex>
                        {/* Componentes reutilizables para los campos editables */}
                        <EditableField label="Profesión" value={ofertaSeleccionada.profesion} onChange={(v) => handleFieldChangeInModal('profesion', v)} />
                        <EditableField label="Cargo" value={ofertaSeleccionada.cargo} onChange={(v) => handleFieldChangeInModal('cargo', v)} />
                        <EditableField label="Salario" value={ofertaSeleccionada.salario} onChange={(v) => handleFieldChangeInModal('salario', v)} />
                        <EditableField label="Descripción" value={ofertaSeleccionada.descripcion} onChange={(v) => handleFieldChangeInModal('descripcion', v)} isTextArea={true} />
                    </Flex>
                </Modal>
            )}
        </div>
    );
};

export default EditOffers;