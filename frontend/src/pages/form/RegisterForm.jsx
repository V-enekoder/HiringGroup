import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Steps, Row, Col, Space, message, DatePicker, Select, Divider, App } from 'antd';
import { UserOutlined, SolutionOutlined, EnvironmentOutlined, MobileOutlined, MailOutlined, LockOutlined, BankOutlined, CreditCardOutlined, HomeOutlined, ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import '../styles/form.css';
import { authService, emergencyContactService, professionService, curriculumService, laboralExperienceService, bankService } from '../../services/api';


const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const RegisterForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [createdProfileId, setCreatedProfileId] = useState(null);
    const [banks, setBanks] = useState([]);
    const navigate = useNavigate();

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [form4] = Form.useForm();
    const [form5] = Form.useForm();
    const forms = [form1, form2, form3, form4, form5];

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const { message } = App.useApp()

     useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await bankService.getAllBanks();
                setBanks(response.data); 
            } catch (error) {
                console.error("Error al cargar la lista de bancos:", error);
                message.error("No se pudo cargar la lista de bancos. Inténtalo de nuevo más tarde.");
            }
        };

        fetchBanks();
    }, []);

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
                    <Form.Item label="Apellido" name="last_name" rules={[
                        { required: true, message: 'El apellido es obligatorio' },
                        { min: 2, message: 'Debe tener al menos 2 caracteres' }
                    ]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. Chitty' />
                    </Form.Item>
                    <Form.Item label="Documento Identidad" name="document" rules={[
                        { required: true, message: 'El documento es obligatorio' },
                        { pattern: /^\d{6,12}$/, message: 'Debe ser un número entre 6 y 12 dígitos' }
                    ]}>
                        <Input prefix={<SolutionOutlined />} placeholder='ejem. 30810725' />
                    </Form.Item>
                    <Form.Item label="Número de Teléfono" name="phone_number" rules={[
                        { required: true, message: 'El teléfono es obligatorio' },
                        { pattern: /^\d{11}$/, message: 'Debe ser un número de 11 dígitos' }
                    ]}>
                        <Input prefix={<MobileOutlined />} placeholder='ejem. 04249650528' />
                    </Form.Item>
                    <Form.Item label="Direccion" name="address" rules={[
                        { required: true, message: 'La dirección es obligatoria' },
                    ]}>
                        <Input prefix={<EnvironmentOutlined />} placeholder='ejem. Puerto Ordaz Villa Alianza casa N' />
                    </Form.Item>
                    <Form.Item label="Tipo de Sangre" name="blood_type" rules={[{ required: true, message: 'Selecciona tu tipo de sangre' }]}>
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
                    <Form.Item label="Correo Electrónico" name="email" rules={[
                        { required: true, message: 'El correo es obligatorio' },
                        { type: 'email', message: 'Formato de correo inválido' }
                    ]}>
                        <Input prefix={<MailOutlined />} placeholder='ejem. chitty@ejemplo.com' />
                    </Form.Item>
                    <Form.Item label="Contraseña" name="password" rules={[
                        { required: true, message: 'La contraseña es obligatoria' },
                        { min: 8, message: 'Debe tener mínimo 8 caracteres' }
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
                    <Form.Item label="Banco" name="bankId" rules={[{ required: true, message: 'El banco es obligatorio' }]}>
                       <Select placeholder="Selecciona tu banco" loading={banks.length === 0}>
                            {banks.map(bank => <Option key={bank.id} value={bank.id}>{bank.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Número de Cuenta Bancaria" name="bankAccount" rules={[
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
                    <Form.Item label="Nombre" name="emergency_name" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. Rosa' />
                    </Form.Item>
                    <Form.Item label="Apellido" name="emergency_lastName" rules={[{ required: true, message: 'El apellido es obligatorio' }]}>
                        <Input prefix={<UserOutlined />} placeholder='ejem. Mendez' />
                    </Form.Item>
                    <Form.Item label="Número de Teléfono" name="emergency_phoneNumber" rules={[
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
                    <Form.Item label="Profesión" name="profession_name" rules={[{ required: true, message: 'La profesión es obligatoria' }]}>
                        <Input placeholder='ejem. Ingeniero en Informática' />
                    </Form.Item>
                    <Form.Item label="Universidad de Egreso" name="university_of_graduation" rules={[{ required: true, message: 'La universidad es obligatoria' }]}>
                        <Input placeholder='ejem. UNEG' />
                    </Form.Item>

                    <Divider orientation="left">Experiencias Laborales</Divider>

                    <Form.List name="experiences">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'company']} rules={[{ required: true, message: 'Empresa' }]}>
                                            <Input placeholder="Empresa" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'job_title']} rules={[{ required: true, message: 'Cargo' }]}>
                                            <Input placeholder="Cargo" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'start_date']} rules={[{ required: true, message: 'Inicio' }]}>
                                            <DatePicker placeholder="Inicio" format="YYYY-MM-DD" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'end_date']}>
                                            <DatePicker placeholder="Fin (Opcional)" format="YYYY-MM-DD" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}> Añadir Experiencia </Button>
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
            const currentForm = forms[currentStep];
            const values = await currentForm.validateFields();
            const newFormData = { ...formData, ...values };
            setFormData(newFormData);

            if (currentStep < steps.length - 1) {
                if (currentStep === 2) {
                    const payload = {
                        name: newFormData.name, email: newFormData.email, password: newFormData.password, role_id: 4,
                        last_name: newFormData.last_name, document: newFormData.document, phone_number: newFormData.phone_number,
                        address: newFormData.address, blood_type: newFormData.blood_type, bankId: newFormData.bankId,
                        bankAccount: newFormData.bankAccount,
                    };
                    const response = await authService.registerUserAndProfile(payload);
                    const newProfileId = response.data.profile_id;
                    if (!newProfileId) throw new Error("La API no devolvió un 'profile_id' válido.");
                    setCreatedProfileId(newProfileId);
                    message.success('¡Usuario creado! Continúa con tu perfil.');
                }
                if (currentStep === 3) {
                    if (!createdProfileId) throw new Error("No se pudo obtener el ID del candidato.");
                    const payload = {
                        candidate_id: createdProfileId, name: newFormData.emergency_name,
                        last_name: newFormData.emergency_lastName, phone_number: newFormData.emergency_phoneNumber,
                    };
                    await emergencyContactService.createContact(payload);
                    message.success('Contacto de emergencia guardado.');
                }
                setCurrentStep(currentStep + 1);

            } else {
                console.log("Finalizando registro. Datos profesionales a enviar:", newFormData);

                if (!createdProfileId) {
                    throw new Error("No se encontró el ID del perfil para asociar la información profesional.");
                }

                const professionPayload = { name: newFormData.profession_name };
                const professionResponse = await professionService.createProfession(professionPayload);
                const newProfessionId = professionResponse.data.id;
                console.log("Profesión creada con ID:", newProfessionId);

                const curriculumPayload = {
                    candidate_id: createdProfileId,
                    profession_id: newProfessionId,
                    university_of_graduation: newFormData.university_of_graduation,
                };
                const curriculumResponse = await curriculumService.createCurriculum(curriculumPayload);
                const newCurriculumId = curriculumResponse.data.id;
                console.log("Currículum creado con ID:", newCurriculumId);

                if (newFormData.experiences && newFormData.experiences.length > 0) {
                    console.log("Enviando experiencias laborales...");
                    for (const exp of newFormData.experiences) {
                        const experiencePayload = {
                            curriculum_id: newCurriculumId,
                            company: exp.company,
                            job_title: exp.job_title,
                            start_date: exp.start_date.format('YYYY-MM-DD'),
                            end_date: exp.end_date ? exp.end_date.format('YYYY-MM-DD') : null,
                        };
                        await laboralExperienceService.createExperience(experiencePayload);
                        console.log(`Experiencia en "${exp.company}" guardada.`);
                    }
                }

                message.success(`¡Registro completado! Serás redirigido al login.`);
                setTimeout(() => navigate('/login'), 2000);
            }

        } catch (error) {
            console.error('Error en el paso de registro:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Ocurrió un error inesperado.';
            message.error(errorMessage);
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
