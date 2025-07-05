import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Steps, Row, Col, Space, message, DatePicker, Select, Divider } from 'antd';
import { UserOutlined, SolutionOutlined, MobileOutlined, MailOutlined, LockOutlined, BankOutlined, CreditCardOutlined, HomeOutlined, ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import '../styles/form.css';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const RegisterForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [form4] = Form.useForm();
    const [form5] = Form.useForm();

    const forms = [form1, form2, form3, form4, form5];

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const steps = [
        {
            title: 'Personales',
            content: (
                <Form form={form1} layout="vertical" initialValues={formData}>
                    <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Datos Personales</Title>
                    <Form.Item label="Nombre" name="name" rules={[
                        { required: true, message: 'El nombre es obligatorio' },
                        { min: 2, message: 'Debe tener al menos 2 caracteres' }
                    ]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. Lilith' />
                    </Form.Item>
                    <Form.Item label="Apellido" name="lastname" rules={[
                        { required: true, message: 'El apellido es obligatorio' },
                        { min: 2, message: 'Debe tener al menos 2 caracteres' }
                    ]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. Chitty' />
                    </Form.Item>
                    <Form.Item label="Documento Identidad" name="documentId" rules={[
                        { required: true, message: 'El documento es obligatorio' },
                        { pattern: /^\d{6,12}$/, message: 'Debe ser un número entre 6 y 12 dígitos' }
                    ]}>
                        <Input prefix={<SolutionOutlined />} placeholder='ejem. 30810725' />
                    </Form.Item>
                    <Form.Item label="Número de Teléfono" name="phone" rules={[
                        { required: true, message: 'El teléfono es obligatorio' },
                        { pattern: /^\d{11}$/, message: 'Debe ser un número de 11 dígitos' }
                    ]}>
                        <Input prefix={<MobileOutlined />} placeholder='ejem. 04249650528' />
                    </Form.Item>
                    <Form.Item label="Tipo de Sangre" name="bloodType" rules={[{ required: true, message: 'Selecciona tu tipo de sangre' }]}>
                        <Select placeholder="Selecciona">
                            {bloodTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            )
        },
        {
            title: 'Cuenta',
            content: (
                <Form form={form2} layout="vertical" initialValues={formData}>
                    <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Datos de la Cuenta</Title>
                    <Form.Item label="Usuario" name="user" rules={[
                        { required: true, message: 'El usuario es obligatorio' },
                        { min: 4, message: 'Debe tener al menos 4 caracteres' }
                    ]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. ChittyLilit' />
                    </Form.Item>
                    <Form.Item label="Correo Electrónico" name="email" rules={[
                        { required: true, message: 'El correo es obligatorio' },
                        { type: 'email', message: 'Formato de correo inválido' }
                    ]}>
                        <Input prefix={<MailOutlined />} placeholder='ejem. chitty@ejemplo.com' />
                    </Form.Item>
                    <Form.Item label="Contraseña" name="password" rules={[
                        { required: true, message: 'La contraseña es obligatoria' },
                        { min: 6, message: 'Debe tener mínimo 6 caracteres' }
                    ]}>
                        <Input.Password prefix={<LockOutlined />} placeholder='ejem. Chi123.12' />
                    </Form.Item>
                </Form>
            )
        },
        {
            title: 'Bancarios',
            content: (
                <Form form={form3} layout="vertical" initialValues={formData}>
                    <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Datos Bancarios</Title>
                    <Form.Item label="Nombre del Banco" name="bank" rules={[
                        { required: true, message: 'El banco es obligatorio' },
                        { min: 3, message: 'Debe tener al menos 3 caracteres' }
                    ]}>
                        <Input prefix={<BankOutlined />} placeholder='Banesco' />
                    </Form.Item>
                    <Form.Item label="Número de Cuenta Bancaria" name="numbank" rules={[
                        { required: true, message: 'El número de cuenta es obligatorio' },
                        { pattern: /^\d{20}$/, message: 'Debe ser un número de 20 dígitos' }
                    ]}>
                        <Input prefix={<CreditCardOutlined />} placeholder='ejem. 01340123456789012345' />
                    </Form.Item>
                </Form>
            )
        },
        {
            title: 'Emergencia',
            content: (
                <Form form={form4} layout="vertical" initialValues={formData}>
                    <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Contacto de Emergencia</Title>
                    <Form.Item label="Nombre Completo" name="nameEmergency" rules={[
                        { required: true, message: 'El nombre es obligatorio' },
                        { min: 3, message: 'Debe tener al menos 3 caracteres' }
                    ]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. Rosa Mendez' />
                    </Form.Item>
                    <Form.Item label="Número de Teléfono" name="numberEmergency" rules={[
                        { required: true, message: 'El teléfono es obligatorio' },
                        { pattern: /^\d{11}$/, message: 'Debe ser un número de 11 dígitos' }
                    ]}>
                        <Input prefix={<MobileOutlined />} placeholder='04126989547' />
                    </Form.Item>
                </Form>
            )
        },
        {
            title: 'Profesional',
            content: (
                <Form form={form5} layout="vertical" initialValues={formData}>
                    <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Información Profesional</Title>
                    <Form.Item label="Profesión" name="profession" rules={[
                        { required: true, message: 'La profesión es obligatoria' },
                        { min: 2, message: 'Debe tener al menos 2 caracteres' }
                    ]}>
                        <Input placeholder='ejem. Ingeniero en Informática' />
                    </Form.Item>
                    <Form.Item label="Universidad de Egreso" name="university" rules={[
                        { required: true, message: 'La universidad es obligatoria' },
                        { min: 2, message: 'Debe tener al menos 2 caracteres' }
                    ]}>
                        <Input placeholder='ejem. UNEG' />
                    </Form.Item>
                    <Divider orientation="left">Experiencias Laborales</Divider>
                    <Form.List name="experiences">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'company']} rules={[{ required: true, message: 'Nombre de la empresa' }]}>
                                            <Input placeholder="Empresa" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'position']} rules={[{ required: true, message: 'Cargo' }]}>
                                            <Input placeholder="Cargo" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'startDate']} rules={[{ required: true, message: 'Fecha de inicio' }]}>
                                            <DatePicker placeholder="Inicio" format="YYYY-MM-DD" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'endDate']} rules={[{ required: true, message: 'Fecha de fin' }]}>
                                            <DatePicker placeholder="Fin" format="YYYY-MM-DD" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}> Añadir Experiencia </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            )
        }
    ];

    const handleNext = async () => {
        setLoading(true);
        try {
            const values = await forms[currentStep].validateFields();
            const newFormData = { ...formData, ...values };
            setFormData(newFormData);

            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                console.log('Formulario completo:', newFormData);
                await new Promise(resolve => setTimeout(resolve, 1500));
                message.success(`¡Registro completado, ${newFormData.name}! Serás redirigido al login.`);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.log('Errores de validación:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%' }} gutter={[48, 24]}>
                <Col xs={24} md={8} className="register-instructions-col">
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Title level={1} style={{ marginBottom: 0 }}>Crear Cuenta</Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}> Sigue los pasos para completar tu registro. </Text>
                        <Button type="primary" onClick={handleNext} block size="large" loading={loading}>
                            {currentStep < steps.length - 1 ? 'Siguiente' : 'Finalizar Registro'}
                        </Button>
                        {currentStep > 0 && (
                            <Button onClick={() => setCurrentStep(currentStep - 1)} block size="large" icon={<ArrowLeftOutlined />}> Volver </Button>
                        )}
                    </Space>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="register-form-card">
                        <Steps current={currentStep} size="small">
                            {steps.map((_, index) => <Step key={index} />)}
                        </Steps>
                        <div className="form-content" key={currentStep}>
                            {steps[currentStep].content}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Link to="/" className="fixed-action-button">
                <Button type="primary" shape="circle" icon={<HomeOutlined />} size="large" />
            </Link>
        </div>
    );
};

export default RegisterForm;
