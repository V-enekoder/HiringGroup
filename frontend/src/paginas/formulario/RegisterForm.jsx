
// src/paginas/formulario/RegistroForm.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Steps, Select, } from 'antd';
import { UserOutlined, SolutionOutlined, MobileOutlined, MailOutlined, LockOutlined, BankOutlined, CreditCardOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({});
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();

  const handleNext = async () => {
    try {
      let values;
      if (currentStep === 0) {
        values = await form1.validateFields();
      } else if (currentStep === 1) {
        values = await form2.validateFields();
      } else if (currentStep === 2) {
        values = await form2.validateFields()
      } else if (currentStep === 3) {
        values = await form2.validateFields()
      }

      const newFormData = { ...formData, ...values };
      setFormData(newFormData);

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        console.log('Formulario completado:', newFormData);
        alert(`¡Registro completado, ${newFormData.name}!`);
      }
    } catch (error) {
      console.log('Error de validación:', error);
    }
  };

  // Contenido de cada paso del formulario registro
  const steps = [
    {
      // Formulario DATOS PERSONALES
      content: (
        <div>
          <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}> Datos Personales</Title>
          <Form form={form1} name="personalData" layout="vertical" initialValues={formData}>

            <Form.Item label="Nombre" name="name" rules={[{ required: true, min: 2, type: 'string', message: 'Ingresa tu nombre' }]}>
              <Input prefix={<UserOutlined />} placeholder='ejem. Lilith' />
            </Form.Item>
            <Form.Item label="Apellido" name="lastname" rules={[{ required: true, min: 2, type: 'string', message: 'Ingresa tu apellido' }]}>
              <Input prefix={<UserOutlined />} placeholder='ejem. Chitty' />
            </Form.Item>
            <Form.Item label="Grupo Sanguineo" name="blood" rules={[{ required: true, message: 'Campo requerido' }]}>
              <Select placeholder="ejem. A+" options={[{ value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
              ]}></Select>
            </Form.Item>
            <Form.Item label="Documento Identidad" name="documentId" rules={[{ required: true, pattern: /^\d+$/, message: 'Campo requerido' }]}>
              <Input prefix={<SolutionOutlined />} type='integer' placeholder='ejem. 30810725' />
            </Form.Item>
            <Form.Item label="Número de Teléfono" name="phone" rules={[{ required: true, pattern: /^\d{11}$/, message: 'Campo requerido' }]}>
              <Input prefix={<MobileOutlined />} placeholder='ejem. 04249650528' />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {

      // Formulario DATOS DE LA CUENTA
      content: (
        <div>
          <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}> Datos de la Cuenta</Title>
          <Form form={form2} name="ccountData" layout="vertical" initialValues={formData}>

            <Form.Item label="Usuario" name="user" rules={[{ required: true, message: 'Ingresa un usuario válido' }]}>
              <Input prefix={<UserOutlined />} placeholder='ejem. ChittyLilit' />
            </Form.Item>
            <Form.Item label="Correo Electrónico" name="email" rules={[{ required: true, type: 'email', message: 'Ingresa un correo válido' }]}>
              <Input prefix={<MailOutlined />} placeholder='ejem. chitty@ejemplo.com' />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true, min: 6, message: 'Mínimo 6 caracteres' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder='ejem. Chi123.12' />
            </Form.Item>
          </Form>
        </div>
      ),
    },

    {
      // Formulario DATOS BANCARIOS
      content: (
        <div>
          <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}> Datos Bancarios</Title>
          <Form form={form3} name="bankingData" layout="vertical" initialValues={formData}>

            <Form.Item label="Nombre del Banco" name="bank" rules={[{ required: true, message: 'Ingresa un nombre válido' }]}>
              <Input prefix={<BankOutlined />} placeholder='Banesco' />
            </Form.Item>
            <Form.Item label="Número de Cuenta Banaria" name="numbank" rules={[{ required: true, message: 'Ingresa un número de cuenta válido' }]}>
              <Input prefix={<CreditCardOutlined />} placeholder='ejem. 0134 0123 4567 8901 2345' />
            </Form.Item>
          </Form>
        </div>
      ),
    },

    {
      // Formulario DATOS DE CONTACTO DE EMERGENCIA
      content: (
        <div>
          <Title level={4} style={{ marginBottom: '1.5rem', textAlign: 'center' }}> Datos de Contacto de Emergencia</Title>
          <Form form={form4} name="emergencyData" layout="vertical" initialValues={formData}>
            <Form.Item label="Nombre" name="nameEmergency" rules={[{ required: true, message: 'Ingresa un nombre válido' }]}>
              <Input prefix={<UserOutlined />} placeholder='ejem. Rosa' />
            </Form.Item>
            <Form.Item label="Apellido" name="lastEmergency" rules={[{ required: true, message: 'Ingresa un apellido válido' }]}>
              <Input prefix={<UserOutlined />} placeholder='ejem. Mendez' />
            </Form.Item>
            <Form.Item label="Número de Teléfono" name="numberEmergency" rules={[{ required: true, pattern: /^\d{11}$/, message: 'Ingresa un número válido' }]}>
              <Input prefix={<MobileOutlined />} placeholder='04126989547' type='tel' />
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '5rem', backgroundColor: '#e3f5f4' }}>

        {/* Columna Izquierda: Instrucciones y Botón */}
        <div style={{ maxWidth: '300px', textAlign: 'center' }}>
          <Title level={1}>Crear Cuenta</Title>
          <Text strong >Sigue los pasos para completar tu registro.</Text>

          {/*Siguiente*/}
          <Button type="primary" onClick={handleNext} style={{ width: '100%', marginTop: '1.5rem' }}>
            {currentStep < steps.length - 1 ? 'Siguiente' : 'Finalizar Registro'}
          </Button>
        </div>

        <Card style={{ width: 550 }}>
          <Steps current={currentStep}>
            {steps.map((item, index) => <Step key={index} />)}
          </Steps>

          <div style={{ marginTop: '2rem' }}>
            {steps[currentStep].content}
          </div>
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

export default RegisterForm;
