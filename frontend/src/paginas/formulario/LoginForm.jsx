// src/paginas/formulario/LoginForm.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, } from '@ant-design/icons';

const { Title, Text } = Typography;

export const LoginForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Datos recibidos del formulario:', values);
        alert(`¡Bienvenido, ${values.user}!`);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e3f5f4' }}>

                <Card style={{ width: 400, borderRadius: 20 }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Title level={2}>Iniciar Sesión</Title>
                        <Text type="secondary">Ingresa tus credenciales para continuar</Text>
                    </div>

                    <Form
                        form={form}
                        name="loginForm"
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            label="Usuario"
                            name="user"
                            rules={[{ required: true, message: 'Por favor, ingresa tu usuario' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Tu nombre de usuario" />
                        </Form.Item>

                        <Form.Item
                            label="Contraseña"
                            name="password"
                            rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Ingresar
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">¿No tienes una cuenta? </Text>
                            <Link to="/register">Regístrate ahora</Link>
                        </div>
                    </Form>
                </Card>

            </div>
            <Link to="/" className="fixed-action-button">
                <Button
                    type="primary"
                    shape="circle"
                    icon={<HomeOutlined />}
                    size="large"
                />
            </Link>
        </div>
    );
};