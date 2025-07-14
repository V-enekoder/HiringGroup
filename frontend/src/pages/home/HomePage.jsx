import React from 'react';
import { Flex, Typography, Button, Row, Col, Card, Steps } from 'antd';
import { Link } from 'react-router-dom';
import { TeamOutlined, SolutionOutlined, DollarCircleOutlined, LoginOutlined, UserAddOutlined, ArrowRightOutlined } from '@ant-design/icons';
import '../styles/pag.css';
import '../styles/homePage.css'

const { Title, Paragraph, Text } = Typography;

export const HomePage = () => {
    return (
        <div className="home-container">

            {/* --- SECCIÓN HERO --- */}
            <div className="hero-section">
                {/* Aplicamos las clases de animación */}
                <Title level={3} className="fade-in-up" style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'normal', marginBottom: 0 }}>
                    Bienvenido a
                </Title>
                <Title  level={1} className="fade-in-up delay-1" style={{ color: 'white', fontSize: '70px', margin: '0 0 16px 0' }}>
                    Hiring Group
                </Title>

                <Paragraph className="fade-in-up delay-1" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', maxWidth: '700px', margin: '0 auto 32px auto' }}>
                    Tu socio estratégico en reclutamiento, contratación y gestión de nómina a nivel nacional. Simplificamos tus procesos para que te enfoques en crecer.
                </Paragraph>
                <Flex gap="middle" justify="center" className="fade-in-up delay-2">
                    <Link to="/login"><Button type="primary" size="large" icon={<LoginOutlined />}>Iniciar Sesión</Button></Link>
                    <Link to="/register"><Button size="large" ghost icon={<UserAddOutlined />}>Crear Cuenta</Button></Link>
                </Flex>
            </div>

            <div className="content-wrapper">
                {/* --- SECCIÓN DE SERVICIOS --- */}
                <div className='contenedorTarjeta' style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <Title level={2} className="fade-in-up delay-2" style={{ marginBottom: '16px' }}>Nuestros Servicios</Title>
                    <Paragraph type="secondary" className="fade-in-up delay-3" style={{ maxWidth: '600px', margin: '0 auto 48px auto' }}>
                        Ofrecemos soluciones integrales para la gestión del talento humano.
                    </Paragraph>
                    <Row gutter={[32, 32]} justify="center">
                        <Col xs={24} sm={12} md={8} className="fade-in-up delay-4">
                            <Card bordered={false} className="feature-card">
                                <SolutionOutlined className="feature-icon" />
                                <Title level={4}>Reclutamiento Especializado</Title>
                                <Text>Encontramos los perfiles ideales que tu empresa necesita para alcanzar sus objetivos.</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="fade-in-up delay-5">
                            <Card bordered={false} className="feature-card">
                                <TeamOutlined className="feature-icon" />
                                <Title level={4}>Contratación y Outsourcing</Title>
                                <Text>Gestionamos todo el proceso de contratación y administración del personal subcontratado.</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="fade-in-up delay-6">
                            <Card bordered={false} className="feature-card">
                                <DollarCircleOutlined className="feature-icon" />
                                <Title level={4}>Gestión de Nómina</Title>
                                <Text>Nos encargamos de los cálculos, pagos y reportes de nómina de forma precisa y puntual.</Text>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* --- SECCIÓN "CÓMO FUNCIONA" --- */}
                <div className='contenedorTarjeta fade-in-up' style={{ marginTop: '32px', padding: '48px 24px' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>Un Proceso Simple y Transparente</Title>
                    
                    {/* Contenedor para nuestra nueva lista de pasos */}
                    <Flex vertical gap="large">
                        
                        {/* Paso 1 */}
                        <div className="process-item-v2">
                            <Flex align="flex-start" gap="large">
                                <Text className="process-number">01</Text>
                                <Flex vertical>
                                    <Title level={4} className="process-title">Publica tu Vacante</Title>
                                    <Paragraph className="process-description">
                                        Las empresas clientes acceden a nuestra plataforma y cargan sus ofertas de empleo de forma rápida y sencilla, definiendo los perfiles que necesitan.
                                    </Paragraph>
                                </Flex>
                            </Flex>
                        </div>

                        {/* Paso 2 */}
                        <div className="process-item-v2">
                            <Flex align="flex-start" gap="large">
                                <Text className="process-number">02</Text>
                                <Flex vertical>
                                    <Title level={4} className="process-title">El Talento Aplica</Title>
                                    <Paragraph className="process-description">
                                        Los mejores candidatos del país encuentran tu oferta en nuestro portal y se postulan con un solo clic, adjuntando su currículum actualizado y datos personales.
                                    </Paragraph>
                                </Flex>
                            </Flex>
                        </div>

                        {/* Paso 3 */}
                        <div className="process-item-v2">
                            <Flex align="flex-start" gap="large">
                                <Text className="process-number">03</Text>
                                <Flex vertical>
                                    <Title level={4} className="process-title">Conectamos y Contratamos</Title>
                                    <Paragraph className="process-description">
                                        Nuestro equipo de expertos valida y filtra los perfiles más compatibles. Te presentamos a los finalistas, tú eliges al ideal y nosotros nos encargamos de la contratación.
                                    </Paragraph>
                                </Flex>
                            </Flex>
                        </div>

                        {/* Paso 4 */}
                        <div className="process-item-v2">
                            <Flex align="flex-start" gap="large">
                                <Text className="process-number">04</Text>
                                <Flex vertical>
                                    <Title level={4} className="process-title">Gestión Integral</Title>
                                    <Paragraph className="process-description">
                                        Olvídate de las complicaciones. Gestionamos el pago de nómina, los beneficios y toda la administración del nuevo talento, para que tú te enfoques en tu negocio.
                                    </Paragraph>
                                </Flex>
                            </Flex>
                        </div>

                    </Flex>
                </div>

                {/* --- SECCIÓN CTA DOBLE --- */}
                <Row gutter={[32, 32]} style={{ marginTop: '32px' }}>
                    <Col xs={24} md={12} className="fade-in-up">
                        <div className="cta-box cta-company">
                            <Title level={3}>Para Empresas</Title>
                            <Paragraph>¿Buscas optimizar tu proceso de reclutamiento y enfocarte en tu negocio principal? Deja la gestión de talento en nuestras manos.</Paragraph>
                            <Link to="/register">
                                <Button type="primary" size="large">Publicar una Vacante <ArrowRightOutlined /></Button>
                            </Link>
                        </div>
                    </Col>
                    <Col xs={24} md={12} className="fade-in-up delay-1">
                        <div className="cta-box cta-candidate">
                            <Title level={3}>Para Candidatos</Title>
                            <Paragraph>¿Listo para dar el siguiente paso en tu carrera? Accede a las mejores oportunidades laborales en empresas líderes del país.</Paragraph>
                            <Link to="/register">
                                <Button type="default" size="large">Buscar Empleo <ArrowRightOutlined /></Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>

            <Flex justify="center" align="center" className="home-footer fade-in-up">
                <Text type="secondary">© {new Date().getFullYear()} Hiring Group. Todos los derechos reservados.</Text>
            </Flex>
        </div>
    );
};

