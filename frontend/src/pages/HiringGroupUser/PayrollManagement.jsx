import React, { useState, useMemo } from 'react';
import { Flex, Typography, Button, Select, Table, message, Tag, Popconfirm, Statistic } from 'antd';
import { SolutionOutlined, CalendarOutlined, BankOutlined, DollarOutlined, CalculatorOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import '../styles/pag.css';

const { Title, Text } = Typography;

// --- DATOS DE EJEMPLO ALINEADOS CON LA BD ---
// Asumimos que ya existen contratos y pagos (o la ausencia de ellos)
const db = {
    companies: [{ id: 1, name: 'Tech Solutions Inc.' }, { id: 2, name: 'Innovate Marketing' }],
    candidates: [
        { id: 201, name: 'Ana Martínez', document: '12345678' },
        { id: 202, name: 'Juan Pérez', document: '87654321' },
    ],
    contracts: [
        { id: 301, candidate_id: 201, company_id: 1, salary: 5500 },
        { id: 302, candidate_id: 202, company_id: 1, salary: 4800 },
        { id: 303, candidate_id: 202, company_id: 2, salary: 6000 }, 
    ],
    payments: [
        { contract_id: 301, year: 2025, month: 6, net_payment: 5417.5 }, 
    ]
};

// --- Opciones para los filtros de fecha ---
const meses = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('es-ES', { month: 'long' }) }));
const anios = [ { value: 2025, label: '2025' }, { value: 2024, label: '2024' } ];


const PayrollManagement = () => {
    // --- ESTADOS ---
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [payrollData, setPayrollData] = useState([]);
    const [isPayrollGenerated, setIsPayrollGenerated] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- LÓGICA DE NÓMINA ---
    const handleGeneratePayroll = () => {
        if (!selectedCompany || !selectedMonth || !selectedYear) {
            message.error('Por favor, selecciona empresa, mes y año.');
            return;
        }
        setLoading(true);

        const companyContracts = db.contracts.filter(c => c.company_id === selectedCompany);
        
        const newPayrollData = companyContracts.map(contract => {
            const candidate = db.candidates.find(c => c.id === contract.candidate_id);
            const isPaid = db.payments.some(p => p.contract_id === contract.id && p.year === selectedYear && p.month === selectedMonth);
            
            const ivssDeduction = contract.salary * 0.01;
            const incesDeduction = contract.salary * 0.005;
            const totalDeductions = ivssDeduction + incesDeduction;
            const netPayment = contract.salary - totalDeductions;
            const hgCommission = contract.salary * 0.02;

            return {
                key: contract.id,
                name: candidate.name,
                document: candidate.document,
                grossSalary: contract.salary,
                ivssDeduction,
                incesDeduction,
                totalDeductions,
                netPayment,
                hgCommission,
                status: isPaid ? 'Pagado' : 'Pendiente'
            };
        });

        setTimeout(() => { 
            setPayrollData(newPayrollData);
            setIsPayrollGenerated(true);
            setLoading(false);
        }, 500);
    };
    
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
        { title: 'Empleado', dataIndex: 'name', key: 'name' },
        { title: 'Cédula', dataIndex: 'document', key: 'document' },
        { title: 'Salario Bruto', dataIndex: 'grossSalary', key: 'grossSalary', render: (val) => `${val.toFixed(2)} USD` },
        { title: 'IVSS (1%)', dataIndex: 'ivssDeduction', key: 'ivssDeduction', render: (val) => val.toFixed(2) },
        { title: 'INCES (0.5%)', dataIndex: 'incesDeduction', key: 'incesDeduction', render: (val) => val.toFixed(2) },
        { title: 'Pago Neto', dataIndex: 'netPayment', key: 'netPayment', render: (val) => <Text strong>{val.toFixed(2)} USD</Text> },
        { title: 'Comisión HG (2%)', dataIndex: 'hgCommission', key: 'hgCommission', render: (val) => val.toFixed(2) },
        { title: 'Estado', dataIndex: 'status', key: 'status', render: (status) => <Tag icon={status === 'Pagado' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} color={status === 'Pagado' ? 'success' : 'processing'}>{status}</Tag> },
    ];
    
    const totalNetPayment = useMemo(() => payrollData.reduce((sum, item) => sum + item.netPayment, 0), [payrollData]);
    const totalHgCommission = useMemo(() => payrollData.reduce((sum, item) => sum + item.hgCommission, 0), [payrollData]);


    return (
        <div className='contenedorMain2'>
                <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Gestión de Nómina</Title>

            <div className='contenedorTarjeta'>
                <Flex gap="middle" wrap="wrap" align="center">
                    <Select placeholder="Seleccionar Empresa" options={db.companies.map(c => ({ value: c.id, label: c.name }))} style={{ flexGrow: 1 }} onChange={setSelectedCompany} />
                    <Select placeholder="Mes" options={meses} style={{ flexGrow: 1 }} onChange={setSelectedMonth} />
                    <Select placeholder="Año" options={anios} style={{ flexGrow: 1 }} onChange={setSelectedYear} />
                    <Button  icon={<SolutionOutlined />} onClick={handleGeneratePayroll} loading={loading}>
                        Generar Reporte
                    </Button>
                </Flex>
            </div>
            
            {isPayrollGenerated && (
                <div className='contenedorTarjeta'>
                    <Flex justify="space-between" align="center" style={{marginBottom: '24px'}}>
                        <Title level={4} style={{margin: 0}}>Nómina de {db.companies.find(c=>c.id === selectedCompany).name} - {meses.find(m=>m.value===selectedMonth).label} {selectedYear}</Title>
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