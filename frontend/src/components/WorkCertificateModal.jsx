// MODAL QUE MUESTRA LA CARTA DE CONSTANCIA DE TRABAJO 

import React from 'react';
import { Modal, Button, Typography, Space, message } from 'antd';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';

const { Title, Paragraph } = Typography;

const WorkCertificateModal = ({ open, onCancel, userData }) => {
    
    const certificateText = `A QUIEN PUEDA INTERESAR

Por medio de la presente la empresa HIRING GROUP hace constar que el ciudadano(a) ${userData.name}, labora con nosotros desde el ${userData.startDate}, cumpliendo funciones en el cargo de ${userData.position} en la empresa ${userData.company}, devengando un salario mensual de ${userData.salary} USD.

Constancia que se pide por la parte interesada en la ciudad de Puerto Ordaz en fecha ${new Date().toLocaleDateString('es-ES')}.
    `;

    const handleCopy = () => {
        navigator.clipboard.writeText(certificateText.trim());
        message.success('¡Texto copiado al portapapeles!');
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        const textParagraphs = [
            'A QUIEN PUEDA INTERESAR',
            '',
            `Por medio de la presente la empresa HIRING GROUP hace constar que el ciudadano(a) ${userData.name}, labora con nosotros desde el ${userData.startDate}, cumpliendo funciones en el cargo de ${userData.position} en la empresa ${userData.company}, devengando un salario mensual de ${userData.salary} USD.`,
            '',
            `Constancia que se pide por la parte interesada en la ciudad de Puerto Ordaz en fecha ${new Date().toLocaleDateString('es-ES')}.`
        ];
        
        const lines = textParagraphs.flatMap(p => doc.splitTextToSize(p, 180));
        
        const options = {
            lineHeightFactor: 1.5
        };

        doc.text(lines, 15, 20, options); 
        
        doc.save(`Constancia_Trabajo_${userData.name.replace(' ', '_')}.pdf`);
        message.success('Descargando PDF...');
    };

    return (
        <Modal
            title={<Title level={4}>Constancia de Trabajo</Title>}
            open={open}
            onCancel={onCancel}
            footer={
                <Space>
                    <Button icon={<CopyOutlined />} onClick={handleCopy}>Copiar Texto</Button>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
                </Space>
            }
            width={600}
        >
            <Paragraph 
                style={{ 
                    whiteSpace: 'pre-wrap', 
                    padding: '16px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    lineHeight: '1.5' 
                }}
            >
                {certificateText}
            </Paragraph>
        </Modal>
    );
};

export default WorkCertificateModal;