// src/pages/ReceiptsPayment.jsx

import React, { useState, useMemo } from 'react';
import { Flex, Typography, Button, Select } from 'antd';
import { FileTextOutlined, ClearOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import '../styles/pag.css';

const { Title, Text } = Typography;

// Datos de ejemplo para los recibos de pago.
const recibosData = [
    { id: 1, contractedId: 1, mes: 6, anio: 2024, monto: '3,500.00 USD', url: '/recibos/jun-2024.pdf' },
    { id: 2, contractedId: 1, mes: 5, anio: 2024, monto: '3,500.00 USD', url: '/recibos/may-2024.pdf' },
    { id: 3, contractedId: 1, mes: 4, anio: 2024, monto: '3,500.00 USD', url: '/recibos/abr-2024.pdf' },
    { id: 4, contractedId: 1, mes: 3, anio: 2024, monto: '3,500.00 USD', url: '/recibos/mar-2024.pdf' },
    { id: 5, contractedId: 1, mes: 2, anio: 2024, monto: '3,200.00 USD', url: '/recibos/feb-2024.pdf' },
    { id: 6, contractedId: 1, mes: 1, anio: 2024, monto: '3,200.00 USD', url: '/recibos/ene-2024.pdf' },
];

// Opciones para los selectores de filtro.
const meses = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
];
const aniosDisponibles = [...new Set(recibosData.map(r => r.anio))].map(a => ({ value: a, label: a.toString() }));


const ReceiptsPayment = () => {
    // Estados para controlar los valores seleccionados en los filtros.
    const [filtroMes, setFiltroMes] = useState(null);
    const [filtroAnio, setFiltroAnio] = useState(null);

    // Memoriza la lista de recibos filtrados para optimizar el rendimiento.
    // Solo se recalcula cuando cambian los filtros (filtroMes o filtroAnio).
    const recibosFiltrados = useMemo(() => {
        if (!filtroMes && !filtroAnio) {
            return recibosData; // Si no hay filtros, devuelve todos los datos.
        }
        return recibosData.filter(recibo => {
            const matchAnio = !filtroAnio || recibo.anio === filtroAnio;
            const matchMes = !filtroMes || recibo.mes === filtroMes;
            return matchAnio && matchMes;
        });
    }, [filtroMes, filtroAnio]);

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Mis Recibos de Pago</Title>

            {/* --- SECCIÓN DE FILTROS --- */}
            <div className='contenedorTarjeta' style={{ padding: '16px 24px' }}>
                <Flex gap="middle" wrap="wrap" align="center">
                    <Text strong>Filtrar por:</Text>
                    <Select placeholder="Mes" options={meses} value={filtroMes} onChange={setFiltroMes} style={{ flexGrow: 1, minWidth: 150 }} allowClear />
                    <Select placeholder="Año" options={aniosDisponibles} value={filtroAnio} onChange={setFiltroAnio} style={{ flexGrow: 1, minWidth: 120 }} allowClear />
                    <Button icon={<ClearOutlined />} onClick={() => { setFiltroMes(null); setFiltroAnio(null); }}>
                        Limpiar Filtros
                    </Button>
                </Flex>
            </div>

            {/* --- CUADRÍCULA DE RECIBOS --- */}
            <div className='receipts-grid'>
                {/* Renderiza los recibos si hay resultados, de lo contrario muestra un mensaje. */}
                {recibosFiltrados.length > 0 ? (
                    recibosFiltrados.map((item) => (
                        <div key={item.id} className='receipt-card'>
                            <Flex vertical gap="small">
                                <Title level={5} style={{ margin: 0, color: '#376b83' }}>
                                    <CalendarOutlined style={{ marginRight: 8 }} />
                                    {`${meses.find(m => m.value === item.mes)?.label} ${item.anio}`}
                                </Title>
                                <Text>
                                    <FileTextOutlined  style={{ marginRight: 8 }} />
                                    Contrato: {item.contractedId}
                                </Text>
                                <Text>
                                    <DollarOutlined style={{ marginRight: 8 }} />
                                    Monto: {item.monto}
                                </Text>
                            </Flex>
                        </div>
                    ))
                ) : (
                    <div className='no-receipts-found'>
                        <Text type="secondary">No se encontraron recibos con los filtros seleccionados.</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptsPayment;