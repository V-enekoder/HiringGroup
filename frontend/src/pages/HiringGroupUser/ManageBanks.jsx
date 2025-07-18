import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Typography, Button, Input, Modal, Form, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BankOutlined } from '@ant-design/icons';
import '../styles/pag.css'; // Reutilizando tus estilos
import { bankService } from '../../services/api';

const { Title, Text } = Typography;

// --- DATOS DE EJEMPLO (En una app real, vendrían de tu tabla `banks`) ---
const initialBanks = [
    { id: 1, name: 'Banesco' },
    { id: 2, name: 'Mercantil' },
    { id: 3, name: 'BBVA Provincial' },
    { id: 4, name: 'Banco de Venezuela' },
    { id: 5, name: 'Bancaribe' },
    { id: 6, name: 'Banco del Tesoro' },
    { id: 7, name: 'Banco Nacional de Crédito (BNC)'},
    { id: 8, name: 'Bicentenario Banco Universal'},
];

const ManageBanks = () => {
    // --- ESTADOS ---
    const [banks, setBanks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        const getAllBanks = async () => {
            try{
                const response = await bankService.getAllBanks()
                const data = response.data

                setBanks(data)
            }catch(error){
                console.error('Error al cargar bancos:', error)
                message.error('Error al cargar los bancos desde el servidor.')
            }
        }

        getAllBanks()
    }, [])

    // Memoriza la lista de bancos filtrados
    /*const filteredBanks = useMemo(() => {
        if (!searchTerm) return banks;
        return banks.filter(bank =>
            bank.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [banks, searchTerm]);*/

    // --- MANEJADORES DE ACCIONES (CRUD) ---
    const handleCreate = () => {
        setEditingBank(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (bank) => {
        setEditingBank(bank);
        form.setFieldsValue({ name: bank.name });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try{
            await bankService.deleteBank(id)
            
            setBanks(prev => prev.filter(b => b.id !== id));
            message.success('Banco eliminado correctamente.');
        }catch(error){
            console.log('Error de validación:', error)
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingBank) {
                await bankService.updateBank(editingBank.id, values);

                setBanks(prev => prev.map(b => b.id === editingBank.id ? { ...b, ...values } : b));
                message.success('Banco actualizado con éxito.');
            } else {
                const response = await bankService.createNewBank(values)
                const newBank = response.data

                setBanks(prev => [newBank, ...prev]);
                message.success('Nuevo banco añadido con éxito.');
            }
            setIsModalVisible(false);
        } catch (error) {
            console.log('Error de validación:', error);
        }
    };
    
    return (
        <div className='contenedorMain2'>
            <div className='contenedorTitulo'>
                <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Gestión de Bancos</Title>
            </div>

            {/* --- PANEL DE CONTROLES --- */}
            <div className='contenedorTarjeta'>
                <Flex gap="middle" justify="space-between" align="center" wrap="wrap">
                    <Input
                        placeholder="Buscar banco..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: '1 1 300px' }}
                        allowClear
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ backgroundColor: '#3f839b' }}>
                        Añadir Banco
                    </Button>
                </Flex>
            </div>

            {/* --- CUADRÍCULA DE BANCOS --- */}
            <div className='receipts-grid'>
                {banks.length > 0 ? (
                    banks.map((bank) => (
                        <div key={bank.id} className='receipt-card' style={{height:'90px'}}>
                            <Flex justify="space-between" align="start">
                                {/* Contenido principal de la tarjeta */}
                                <Flex align="center" gap="middle">
                                    <BankOutlined style={{ fontSize: '24px', color: '#376b83' }}/>
                                    <Title level={5} style={{ margin: 0 }}>{bank.name}</Title>
                                </Flex>

                                {/* Botones de acción */}
                                <Space>
                                    <Button type="text" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(bank)} />
                                    <Popconfirm title="¿Eliminar este banco?" onConfirm={() => handleDelete(bank.id)} okText="Sí" cancelText="No">
                                        <Button type="text" shape="circle" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            </Flex>
                        </div>
                    ))
                ) : (
                    <div className='no-receipts-found' style={{ gridColumn: '1 / -1' }}>
                        <Text type="secondary">No se encontraron bancos con los filtros seleccionados.</Text>
                    </div>
                )}
            </div>

            {/* --- MODAL PARA CREAR Y EDITAR --- */}
            <Modal
                title={editingBank ? 'Editar Banco' : 'Añadir Nuevo Banco'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Guardar"
                cancelText="Cancelar"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="bankForm" style={{ marginTop: '24px' }}>
                    <Form.Item name="name" label="Nombre del Banco" rules={[{ required: true, message: 'El nombre del banco es requerido' }]}>
                        <Input prefix={<BankOutlined />} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageBanks;