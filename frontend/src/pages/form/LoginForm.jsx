import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Avatar } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth, ROLES } from '../../context/AuthContext'; 
import '../styles/form.css';

const { Title, Text } = Typography;

// Simulación de una base de datos de usuarios para la demo.
const mockUserDatabase = [
    { id: 1, name: 'Super Admin', correo: 'admin', password: '123', role_id: ROLES.ADMIN },
    { id: 2, name: 'Hiring Group User', correo: 'hiring', password: '123', role_id: ROLES.HIRING_GROUP },
    { id: 3, name: 'Tech Solutions',correo: 'empresa', password: '123', role_id: ROLES.COMPANY },
    { id: 4, name: 'Candidato de Prueba', correo: 'candidato', password: '123', role_id: ROLES.CANDIDATE, is_hired: false },
    { id: 5, name: 'Empleado Contratado', correo: 'contratado', password: '123', role_id: ROLES.CANDIDATE, is_hired: true },
];

// Mapea cada rol a su ruta de redirección tras el login.
const rolePaths = {
    [ROLES.ADMIN]: '/',
    [ROLES.HIRING_GROUP]: '/hiring-group/empresas',
    [ROLES.COMPANY]: '/usuarioEmpresa/editarOfertas',
    [ROLES.CANDIDATE]: '/candidate/curriculum',
};

export const LoginForm = () => {
    // --- Estados y Hooks ---
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Obtiene la función de login del contexto de autenticación.
    const navigate = useNavigate(); // Hook para la navegación programática.
    const [form] = Form.useForm();

    // Función que se ejecuta al enviar el formulario con éxito.
    const onFinish = async (values) => {
        setLoading(true); 
        await new Promise(resolve => setTimeout(resolve, 500)); 

        const foundUser = mockUserDatabase.find(
            user => user.username.toLowerCase() === values.username.toLowerCase() && user.password === values.password
        );
        
        // Si el usuario existe, se inicia sesión y se le redirige.
        if (foundUser) {
            login(foundUser); // Actualiza el estado global de autenticación.
            message.success(`¡Bienvenido, ${foundUser.name}!`);
            navigate(rolePaths[foundUser.role_id] || '/'); // Redirige al usuario según su rol.
        } else {
            // Si no se encuentra, muestra un mensaje de error.
            message.error('Usuario o contraseña incorrectos.');
        }

        setLoading(false); // Desactiva el estado de carga.
    };

    return (
        <div className="login-container">
            <Card className="login-card"> 
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar size={64} icon={<UserOutlined />} className="login-avatar" />
                    <Title level={2} style={{marginTop: 16}}>Iniciar Sesión</Title>
                    <Text type="secondary">Ingresa tus credenciales para continuar</Text>
                </div>

                <Form form={form} name="loginForm" layout="vertical" onFinish={onFinish}  >
                    <Form.Item label="Correo" name="correo"  rules={[{ required: true, message: 'Por favor, ingresa tu correo'}]}>
                        <Input  prefix={<UserOutlined />}  placeholder="tucorreo@gmail.com"  size="large" />
                    </Form.Item>

                    <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Por favor, ingrese su contraseña' }]} >
                        <Input.Password  prefix={<LockOutlined />}  placeholder="Contraseña (prueba: 123)"  size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button  type="primary" htmlType="submit" block size="large"  loading={loading} >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">¿No tienes una cuenta? </Text>
                        <Link to="/register">Regístrate ahora</Link>
                    </div>
                </Form>
            </Card>
            
            {/* Botón flotante para volver a la página de inicio (landing) */}
            <Link to="/" className="fixed-action-button">
                <Button type="primary" shape="circle" icon={<HomeOutlined />} size="large" />
            </Link>
        </div>
    );
};