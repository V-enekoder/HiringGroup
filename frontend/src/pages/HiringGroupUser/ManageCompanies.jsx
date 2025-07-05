import React, { useState, useMemo } from 'react';
import { Flex, Typography, Button, Table, Input, Modal, Form, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, SearchOutlined } from '@ant-design/icons';
import '../styles/pag.css';

const { Title, Text } = Typography;

const initialCompanies = [
    {
        id: 1,
        name: 'Tech Solutions Inc.',
        sector: 'Tecnología',
        direcccion: 'Tecnología',
        contactEmail: 'c.rodriguez@techsolutions.com',
        loginUser: 'techsolutions_user'
    },
    {
        id: 2,
        name: 'Innovate Marketing',
        sector: 'Publicidad',
        direcccion: 'Tecnología',
        contactEmail: 'laura.g@innovatemarketing.net',
        loginUser: 'innovate_user'
    },
    {
        id: 3,
        name: 'Salud Integral C.A.',
        sector: 'Salud',
        direcccion: 'Tecnología',
        contactEmail: 'r.pena@saludintegral.org',
        loginUser: 'saludintegral_user'
    }
];

const ManageCompanies = () => {
    const [companies, setCompanies] = useState(initialCompanies);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [form] = Form.useForm();

    // Filtra las empresas basado en el término de búsqueda
    const filteredCompanies = useMemo(() => {
        if (!searchTerm) return companies;
        return companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [companies, searchTerm]);

    // --- MANEJADORES DE ACCIONES ---
    const handleCreate = () => {
        setEditingCompany(null);
        form.resetFields();
        form.setFieldsValue({ provisionalPassword: `prov_${Math.random().toString(36).slice(-8)}` });
        setIsModalVisible(true);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        form.setFieldsValue(company);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        setCompanies(prev => prev.filter(c => c.id !== id));
        message.success('Empresa eliminada correctamente.');
    };
    
    const handleResetPassword = (id) => {
        message.info(`(Simulado) Se ha enviado un correo de reseteo de contraseña para la empresa con ID: ${id}`);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCompany) {
                setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...values } : c));
                message.success('Empresa actualizada con éxito.');
            } else {
                const newCompany = { id: Date.now(), ...values };
                setCompanies(prev => [newCompany, ...prev]);
                message.success('Nueva empresa creada con éxito.');
            }
            setIsModalVisible(false);
        } catch (error) {
            console.log('Error de validación:', error);
        }
    };
    
    const columns = [
        { title: 'Nombre de la Empresa', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Sector', dataIndex: 'sector', sorter: (a, b) => a.sector.localeCompare(b.sector) },
        { title: 'Persona de Contacto', dataIndex: 'contactPerson' },
        { title: 'Email', dataIndex: 'contactEmail' },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="¿Resetear contraseña?"
                        description="Se enviará una nueva contraseña provisional. ¿Continuar?"
                        onConfirm={() => handleResetPassword(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="text" icon={<LockOutlined />} />
                    </Popconfirm>
                    <Popconfirm
                        title="¿Eliminar esta empresa?"
                        description="Esta acción es permanente. ¿Estás seguro?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí, eliminar"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className='contenedorMain2'>
            <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                    <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Gestión de Empresas Clientes</Title>
                <Button  icon={<PlusOutlined />} onClick={handleCreate}>
                    Crear Nueva Empresa
                </Button>
            </Flex>

            <div className='contenedorTarjeta'>
                <Input
                    placeholder="Buscar empresa por nombre, sector o contacto..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '16px' }}
                    allowClear
                />
                <Table columns={columns} dataSource={filteredCompanies} rowKey="id" />
            </div>

            <Modal
                title={editingCompany ? 'Editar Empresa' : 'Crear Nueva Empresa'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Guardar"
                cancelText="Cancelar"
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="companyForm" style={{ marginTop: '24px' }}>
                    <Title level={5}>Datos de la Empresa</Title>
                    <Form.Item name="name" label="Nombre de la Empresa" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="sector" label="Sector" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="Dirección" label="Direccion" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    
                    <Title level={5} style={{marginTop: '16px'}}>Datos de Contacto</Title>
                    <Form.Item name="contactEmail" label="Email de Contacto" rules={[{ required: true, type: 'email', message: 'Por favor, ingresa un email válido' }]}>
                        <Input />
                    </Form.Item>

                    <Title level={5} style={{marginTop: '16px'}}>Credenciales de Acceso</Title>
                    <Form.Item name="loginUser" label="Usuario de Acceso" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    {!editingCompany && (
                        <Form.Item name="provisionalPassword" label="Contraseña Provisional">
                            <Input readOnly />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default ManageCompanies;