import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Typography, Button, Select, Table, message, Tag, Popconfirm, Statistic } from 'antd';
import { SolutionOutlined, CalendarOutlined, BankOutlined, DollarOutlined, CalculatorOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import '../styles/pag.css';
import { companyService, paymentService } from '../../services/api';

const { Title, Text } = Typography;

// --- Opciones para los filtros de fecha ---
const meses = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('es-ES', { month: 'long' }) }));
const anios = [ { value: 2025, label: '2025' }, { value: 2024, label: '2024' } ];


const PayrollManagement = () => {
    // --- ESTADOS ---
    const [companies, setCompanies] = useState([])
    const [payments, setPayments] = useState([])
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [payrollData, setPayrollData] = useState([]);
    const [isPayrollGenerated, setIsPayrollGenerated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCompanies = async () => {
            try{
                const response = await companyService.getAllCompanies()
                const data = response.data

                setCompanies(data)
            }catch(error){
                console.error('Error al cargar empresas:', error)
                message.error('Error al cargar las empresas desde el servidor.')
            }
        }

        getCompanies()
    }, [])

    // --- LÓGICA DE NÓMINA ---
    const handleGeneratePayroll = async () => {
        if (!selectedCompany || !selectedMonth || !selectedYear) {
            message.error('Por favor, selecciona empresa, mes y año.');
            return;
        }
        setLoading(true);

        try{
            const response = await paymentService.getPaymentByCompanyId(selectedCompany)
            const data = response.data
            console.log("Payments", data)

            setPayments(data)

            const newPayrollData = data.filter(payment => {
                const [anio, mes] = payment.date.split('-').map(Number);
                console.log("Año", anio, selectedYear, "Mes", mes, selectedMonth)
                return anio === selectedYear && mes === selectedMonth;
            });

            setTimeout(() => { 
                setPayrollData(newPayrollData);
                setIsPayrollGenerated(true);
                setLoading(false);
            }, 500);
        }catch(error){
            console.error('Error al cargar pagos:', error)
            message.error('Error al cargar los pagos desde el servidor.')
        }
    };

    const handleNewPayroll = () => {
            console.log("Payments", payments)
            const newPayrollData = payments.filter(payment => {
                const [anio, mes] = payment.date.split('-').map(Number);
                console.log("Año", anio, selectedYear, "Mes", mes, selectedMonth)
                return anio === selectedYear && mes === selectedMonth;  
            });

            setTimeout(() => { 
                setPayrollData(newPayrollData);
                setIsPayrollGenerated(true);
                setLoading(false);
            }, 500);
        }
    
    const handleRunPayroll = () => {
        message.info('Procesando corrida de nómina...');
        
        setTimeout(() => {
            const updatedPayroll = payrollData.map(p => ({ ...p, status: 'Pagado' }));
            setPayrollData(updatedPayroll);
            message.success(`Nómina para ${meses.find(m=>m.value===selectedMonth).label} ${selectedYear} ejecutada con éxito.`);
        }, 1500);
    };
    
    const isPayrollPaid = payrollData.every(p => p.status === 'Pagado');

    const columns = [
        { title: 'Nombre', dataIndex: 'candidateName', key: 'candidateName' },
        { title: 'Salario Bruto', dataIndex: 'amount', key: 'amount', render: (val) => `${val.toFixed(2)} USD` },
        { title: 'IVSS (1%)', dataIndex: 'socialSecurityFee', key: 'socialSecurityFee', render: (val) => val.toFixed(2) },
        { title: 'INCES (0.5%)', dataIndex: 'incesFee', key: 'incesFee', render: (val) => val.toFixed(2) },
        { title: 'Pago Neto', dataIndex: 'netAmount', key: 'netAmount', render: (val) => <Text strong>{val.toFixed(2)} USD</Text> },
        { title: 'Comisión HG (2%)', dataIndex: 'hiringGroupFee', key: 'hiringGroupFee', render: (val) => val.toFixed(2) },
    ];
    
    const totalNetPayment = useMemo(() => payrollData.reduce((sum, item) => sum + item.netAmount, 0), [payrollData]);
    const totalHgCommission = useMemo(() => payrollData.reduce((sum, item) => sum + item.hiringGroupFee, 0), [payrollData]);

    const companyOptions = companies.map(c => ({
        label: c.companyName,     // lo que se ve en el Select
        value: c.company_id        // lo que se guarda en el form
    }));

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Gestión de Nómina</Title>

            <div className='contenedorTarjeta'>
                <Flex gap="middle" wrap="wrap" align="center">
                    <Select placeholder="Seleccionar Empresa" options={companyOptions} loading={companies.length === 0} style={{ flexGrow: 1 }} onChange={setSelectedCompany} value={selectedCompany} allowClear/>
                    <Select placeholder="Mes" options={meses} style={{ flexGrow: 1 }} onChange={setSelectedMonth} allowClear/>
                    <Select placeholder="Año" options={anios} style={{ flexGrow: 1 }} onChange={setSelectedYear} allowClear/>
                    <Button  icon={<SolutionOutlined />} onClick={handleGeneratePayroll} loading={loading}>
                        Generar Reporte
                    </Button>
                </Flex>
            </div>
            
            {isPayrollGenerated && (
                <div className='contenedorTarjeta'>
                    <Flex justify="space-between" align="center" style={{marginBottom: '24px'}}>
                        <Title level={4} style={{margin: 0}}>Nómina de {companies.find(c=>c.company_id === selectedCompany).companyName} - {meses.find(m=>m.value===selectedMonth).label} {selectedYear}</Title>
                        <Popconfirm
                            title="¿Ejecutar la corrida de nómina?"
                            description="Esta acción es irreversible y procesará todos los pagos."
                            onConfirm={handleRunPayroll}
                            okText="Sí, ejecutar"
                            cancelText="Cancelar"
                            disabled={isPayrollPaid}
                        >
                            <Button type="primary" danger icon={<CalculatorOutlined />} disabled={isPayrollPaid}>
                                {isPayrollPaid ? 'Nómina Pagada' : 'Ejecutar Corrida de Nómina'}
                            </Button>
                        </Popconfirm>
                    </Flex>
                    <Table columns={columns} dataSource={payrollData} pagination={false} bordered />
                    <Flex justify="end" style={{marginTop: '24px'}} gap="large">
                        <Statistic title="Total Neto a Pagar (Empleados)" value={totalNetPayment} precision={2} prefix="$" />
                        <Statistic title="Total a Facturar (Comisión HG)" value={totalHgCommission} precision={2} prefix="$" />
                    </Flex>
                </div>
            )}
        </div>
    );
};

export default PayrollManagement;