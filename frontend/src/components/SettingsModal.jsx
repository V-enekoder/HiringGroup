
import React from 'react';
import { Modal, Tabs, Form, Input, Button, message, App } from 'antd';
import { userService } from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 


const ChangePasswordForm = ({ userId, onFinished }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp(); 

    const onFinish = async (values) => {
        try {
            await userService.changePassword(userId, {
                old_password: values.currentPassword, 
                new_password: values.newPassword,
            });
            message.success('Contraseña cambiada exitosamente.');
            form.resetFields();
            onFinished();
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al cambiar la contraseña.');
        }
    };
    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ paddingTop: '16px' }}>
            <Form.Item name="currentPassword" label="Contraseña Actual" rules={[{ required: true }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item name="newPassword" label="Nueva Contraseña" rules={[{ required: true, min: 6 }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item name="confirmPassword" label="Confirmar Nueva Contraseña" dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error('Las contraseñas no coinciden.')); } })]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Guardar Cambios</Button>
            </Form.Item>
        </Form>
    );
};

const ChangeEmailForm = ({ userId, onFinished }) => {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
            await userService.updateUser(userId, {
                email: values.newEmail,
            });
            message.success('Email cambiado exitosamente.');
            form.resetFields();
            onFinished();
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al cambiar el email.');
        }
    };
    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ paddingTop: '16px' }}>
            <Form.Item name="newEmail" label="Nuevo Correo Electrónico" rules={[{ required: true, type: 'email' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="password" label="Contraseña para Confirmar" rules={[{ required: true }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Guardar Email</Button>
            </Form.Item>
        </Form>
    );
};

const SettingsModal = ({ open, onCancel }) => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <Modal
            title="Configuración de la Cuenta"
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: 'Cambiar Email',
                        key: '1',
                        children: <ChangeEmailForm userId={user.id} onFinished={onCancel} />,
                    },
                    {
                        label: 'Cambiar Contraseña',
                        key: '2',
                        children: <ChangePasswordForm userId={user.id} onFinished={onCancel} />,
                    },
                ]}
            />
        </Modal>
    );
};

export default SettingsModal;