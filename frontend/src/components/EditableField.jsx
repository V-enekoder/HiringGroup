
// COMPONENTE QUE PERMITE ESCRIBIR Y EDITAR UN INPUT

import React, { useState } from 'react';
import { Layout, Flex, Space, Typography, Input } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;


const EditableField = ({ label, value, onChange, isTextArea = false }) => {
    const [editing, setEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        onChange(currentValue);
        setEditing(false);    
    };

    const handleEdit = () => {
        setCurrentValue(value); 
        setEditing(true);
    };

 return (
        <Flex align="center" gap="small" style={{ width: '100%' }}>
            {label && <Text strong style={{ whiteSpace: 'nowrap' }}>{label}:</Text>}
            {editing ? (
                // --- VISTA DE EDICIÓN ---
                <Flex align="center"  style={{ flexGrow: 1 }}>
                    {isTextArea ? (
                        <TextArea
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            variant="filled"
                            onPressEnter={handleSave}
                            onBlur={handleSave}
                            autoFocus
                        />
                    ) : (
                        <Input
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onPressEnter={handleSave}
                            onBlur={handleSave} 
                            variant="borderless"
                            autoFocus 
                        />
                    )}
                    <CheckOutlined
                        onClick={handleSave}
                        style={{ cursor: 'pointer', color: '#52c41a' }}
                    />
                </Flex>
            ) : (
                // --- VISTA NORMAL (TEXTO) ---
                <Flex align="center"  style={{ flexGrow: 1 }}>
                    <Text style={{ 
                        flexGrow: 1, 
                        padding: '3px 0', 
                        display: 'inline-block', 
                    }}>
                        {value || <span style={{color: '#ccc'}}>Vacío</span>} 
                    </Text>
                    <EditOutlined
                        onClick={handleEdit}
                        style={{ cursor: 'pointer', color: '#376b83' }}
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default EditableField;