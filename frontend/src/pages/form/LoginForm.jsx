import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message,  App, Avatar } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import '../styles/form.css';
import { authService, candidateService } from '../../services/api';
const { Title, Text } = Typography;


const rolePaths = {
    'admin': '/hiring-group/empresas',
    'employeehg': '/hiring-group/empresas', 
    'company': '/usuario-Empresa/editar-Ofertas',
    'candidate': '/candidato/curriculum',
};

export const LoginForm = () => {
    // --- Estados y Hooks ---
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Obtiene la función de login del contexto de autenticación.
    const navigate = useNavigate(); // Hook para la navegación programática.
    const [form] = Form.useForm();
    const { message } = App.useApp(); 
    

    // --- API ---
     const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await authService.login(values);
            let userDataFromApi = response.data;

            if (!userDataFromApi || !userDataFromApi.role || userDataFromApi.role === "") {
                message.error('Respuesta inválida del servidor. No se encontró el rol.');
                return;
            }

            if (userDataFromApi.role.toLowerCase() === 'candidate') {
                console.log('Usuario es candidato. Obteniendo perfil completo...');
                
                const profileResponse = await candidateService.getCandidateProfile(userDataFromApi.profile_id);
                
                userDataFromApi = { 
                    ...userDataFromApi, 
                    ...profileResponse.data,
                    is_hired: profileResponse.data.Hired 
                };
            }
            
            console.log("Datos finales del usuario para guardar:", userDataFromApi);

            // Guardamos el usuario enriquecido en el contexto
            login(userDataFromApi);
            
            // La simulación del token y la redirección no cambian
            localStorage.setItem('authToken', `logged-in-as-${userDataFromApi.user_id}`);
            message.success(`¡Bienvenido, ${userDataFromApi.name}!`);
            navigate(rolePaths[userDataFromApi.role.toLowerCase()] || '/');

        } catch (error) {
            console.error('Error de login:', error);
            const errorMessage = error.response?.data?.error || 'Correo o contraseña incorrectos.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar size={64} icon={<UserOutlined />} className="login-avatar" />
                    <Title level={2} style={{ marginTop: 16 }}>Iniciar Sesión</Title>
                    <Text type="secondary">Ingresa tus credenciales para continuar</Text>
                </div>

                <Form form={form} name="loginForm" layout="vertical" onFinish={onFinish}  >
                    <Form.Item label="Correo" name="email" rules={[{ required: true, message: 'Por favor, ingresa tu correo' }]}>
                        <Input prefix={<UserOutlined />} placeholder="tucorreo@gmail.com" size="large" />
                    </Form.Item>

                    <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Por favor, ingrese su contraseña' }]} >
                        <Input.Password prefix={<LockOutlined />} placeholder="*********" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading} >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">¿No tienes una cuenta? </Text>
                        <Link to="/register">Regístrate ahora</Link>
                    </div>
                </Form>
            </Card>

            <Link to="/" className="fixed-action-button">
                <Button type="primary" shape="circle" icon={<HomeOutlined />} size="large" />
            </Link>
        </div>
    );
};