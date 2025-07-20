import React, { useState, useEffect } from 'react';
import { Layout, Flex, Typography, message, Upload, Button, Tag, Input, Form, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, UserOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import EditableField from '../../components/EditableField';
import '../styles/pag.css';
import { useAuth } from '../../context/AuthContext';
import { candidateService, curriculumService, laboralExperienceService, professionService } from '../../services/api';

const { Title, Text } = Typography;

// --- Helpers para la carga y validación de la imagen ---
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) message.error('¡Solo puedes subir archivos JPG/PNG!');
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('¡La imagen debe ser más pequeña que 2MB!');
    
    return isJpgOrPng && isLt2M;
};


const ModifyCurriculum = () => {
    const { user } = useAuth()
    const candidateId = user?.profile_id
    const [candidate, setCandidate] = useState(null)
    const [curriculum, setCurriculum] = useState(null)
    const [professions, setProfessions] = useState([])
    // --- Lógica para la carga de la imagen de perfil ---
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [form] = Form.useForm()
    
    const getCurriculumByCandidateId = async () => {
        try{
            const response = await curriculumService.getCurriculumByCandidateId(candidateId)
            const data = response.data
            
            setCurriculum(data)
        }catch(error){
            console.error('Error al cargar candidato:', error)
            message.error('Error al cargar el candidato desde el servidor.')
        }
    }

    useEffect(() => {
        if(!candidateId) return
        const getCandidateById = async () => {
            try{
                const response = await candidateService.getCandidateProfile(candidateId)
                const data = response.data
                
                setCandidate(data)
            }catch(error){
                console.error('Error al cargar candidato:', error)
                message.error('Error al cargar el candidato desde el servidor.')
            }
        }

        const getProfessions = async () => {
            try{
                const response = await professionService.getAllProfessions()
                const data = response.data

                setProfessions(data)
            }catch(error){
                console.error('Error al cargar profesiones:', error)
                message.error('Error al cargar las profesiones desde el servidor.')
            }
        }

        getCandidateById()
        getCurriculumByCandidateId()
        getProfessions()
    }, [candidateId])

    if (!candidate || !curriculum) {
        return <div>Cargando información...</div>;
    }

    const handleCurriculumChange = async (field, newValue) => {
        try{
            const profession = professions.find(p => p.name === curriculum.profession_name)
            const value = {
                ...curriculum,
                profession_id: profession.id,
                [field]: newValue
            }

            console.log("Nuevo coso ", value)
            await curriculumService.updateCurriculumInfo(curriculum.id, value)

            setCurriculum(prev => ({
                ...prev,
                [field]: newValue
            }));

            message.success('Información actualizada correctamente.');
        }catch(error){
            console.error('Error al actualizar curriculum:', error)
            message.error('Error al actualizar el curriculum desde el servidor.')
        }
    };

    const handleCandidateChange = async (field, newValue) => {
        try{
            const value = {
                [field]: newValue
            }
            await candidateService.updatePersonalInfo(candidateId, value)

            setCandidate(prev => ({
                ...prev,
                [field]: newValue
            }));
            
            message.success('Información actualizada correctamente.');
        }catch(error){
            console.error('Error al actualizar candidato:', error)
            message.error('Error al actualizar el candidato desde el servidor.')
        }
    }

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, url => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    // --- Funciones para gestionar la lista de EXPERIENCIA  ---
    const handleExperienciaChange = async (index, field, newValue) => {
        try{
            const value = {
                ...curriculum.laboral_experiences[index],
                [field]: newValue
            }
            await laboralExperienceService.updateLaboralExperience(curriculum.laboral_experiences[index].id, value)

            message.success('Información actualizada correctamente.');

            await getCurriculumByCandidateId();
        }catch(error){
            console.error('Error al actualizar experiencia:', error)
            message.error('Error al actualizar la experiencia desde el servidor.')
        }
    };
    const addExperiencia = () => {
        setIsModalVisible(true)
    };

    const removeExperiencia = async (laboralExperienceId) => {
        try{
            await laboralExperienceService.deleteLaboralExperience(laboralExperienceId)

            message.success('Experiencia laboral eliminada correctamente.');

            await getCurriculumByCandidateId();
        }catch(error){
            console.log('Error de validación:', error);
        }
    };

    const handleModalOk = async () => {
        try{
            const values = await form.validateFields();
            await laboralExperienceService.createNewLaboralExperience({
            ...values,
            curriculum_id: curriculum.id,
        })

            message.success('Experiencia laboral creada con éxito.');
            setIsModalVisible(false);
            form.resetFields();

            await getCurriculumByCandidateId();
        }catch(error){
            console.log('Error de validación:', error);
        }
    }

    // JSX para el botón de carga de la imagen.
    const uploadButton = ( <button style={{ border: 0, background: 'none' }} type="button"> {loading ? <LoadingOutlined /> : <PlusOutlined />} <div style={{ marginTop: 8 }}>Upload</div> </button> );

    return (
        <div className='contenedorMain2'>
            <Title level={2} style={{ color: '#2b404e', margin: 0 }}>Currículum</Title>
            
            {/* Layout principal de dos columnas */}
            <Flex gap="24px" align="start">
                {/* --- COLUMNA IZQUIERDA (35%) --- */}
                <Flex vertical gap="24px" style={{ width: '35%' }}>
                    <div className='contenedorTarjeta'>
                        <Text className='TextTarjeta'>Datos Personales</Text>
                        <Flex vertical align="center" gap="20px" style={{ marginTop: '16px' }}>
                            <Upload name="avatar" listType="picture-circle" className="avatar-uploader" showUploadList={false} action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" beforeUpload={beforeUpload} onChange={handleChange}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : uploadButton}
                            </Upload>
                            <Flex vertical gap="16px" style={{ width: '100%' }}>
                                <EditableField icon={<UserOutlined/>} label="Nombre" value={candidate.name} onChange={(v) => handleCandidateChange('name', v)} />
                                <EditableField icon={<UserOutlined/>} label="Apellido" value={candidate.lastName} onChange={(v) => handleCandidateChange('lastName', v)} />
                                <EditableField icon={<EnvironmentOutlined/>} label="Ubicación" value={candidate.address} onChange={(v) => handleCandidateChange('address', v)} />
                                <EditableField icon={<MailOutlined/>} label="Correo" value={candidate.email} onChange={(v) => handleCandidateChange('email', v)} />
                                <EditableField icon={<PhoneOutlined/>} label="Teléfono" value={candidate.phoneNumber} onChange={(v) => handleCandidateChange('phoneNumber', v)} />
                            </Flex>
                        </Flex>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Text className='TextTarjeta'>Sobre mí</Text>
                        <div style={{marginTop: '16px'}}>
                           <EditableField value={curriculum.resume} onChange={(v) => handleCurriculumChange('resume', v)} isTextArea={true} />
                        </div>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Text className='TextTarjeta'>Habilidades</Text>
                        <Flex wrap="wrap" gap="small">
                            {/* Itera sobre las habilidades para renderizar los tags */}
                            <EditableField icon={<UserOutlined/>} label="Habilidades" value={curriculum.skills} onChange={(v) => handleCurriculumChange('skills', v)} />
                        </Flex>
                    </div>
                </Flex>

                {/* --- COLUMNA DERECHA (65%) --- */}
                <Flex vertical gap="24px" style={{ width: '65%' }}>
                    <div className='contenedorTarjeta'>
                        <Flex justify="space-between" align="center">
                            <Text className='TextTarjeta'>Experiencia Laboral</Text>
                            <Button type="text" icon={<PlusOutlined />} onClick={addExperiencia}>Añadir</Button>
                        </Flex>
                        <Flex vertical gap="16px" style={{ marginTop: '16px' }}>
                            {/* Itera sobre la lista de experiencias para renderizarlas */}
                            {curriculum.laboral_experiences.map((exp, index) => (
                                <div key={exp.id} className='list-item-card'>
                                    <Flex justify="space-between" align="start">
                                        <EditableField value={exp.company} onChange={(v) => handleExperienciaChange(index, 'company', v)} />
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeExperiencia(exp.id)} />
                                    </Flex>
                                    <EditableField label="Puesto" value={exp.job_title} onChange={(v) => handleExperienciaChange(index, 'job_title', v)} />
                                    <EditableField label="Fecha de Inicio" value={exp.start_date} onChange={(v) => handleExperienciaChange(index, 'start_date', v)} />
                                    <EditableField label="Fecha de Fin" value={exp.end_date} onChange={(v) => handleExperienciaChange(index, 'end_date', v)} />
                                    <EditableField label="Descripción" value={exp.description} onChange={(v) => handleExperienciaChange(index, 'description', v)} isTextArea={true} />
                                </div>
                            ))}
                        </Flex>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Flex justify="space-between" align="center">
                            <Text className='TextTarjeta'>Estudios</Text>
                        </Flex>
                        <Flex vertical gap="16px" style={{ marginTop: '16px' }}>
                            <EditableField icon={<UserOutlined/>} label="Estudios" value={curriculum.university_of_graduation} onChange={(v) => handleCurriculumChange('university_of_graduation', v)} />
                        </Flex>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Flex justify="space-between" align="center">
                            <Text className='TextTarjeta'>Idiomas</Text>
                        </Flex>
                        <Flex vertical gap="16px" style={{ marginTop: '16px' }}>
                            <EditableField icon={<UserOutlined/>} label="Idiomas" value={curriculum.spoken_languages} onChange={(v) => handleCurriculumChange('spoken_languages', v)} />
                        </Flex>
                    </div>
                </Flex>
            </Flex>

            <Modal
                title={'Agregar Nueva Experiencia Laboral'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Guardar"
                cancelText="Cancelar"
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="laboralExperienceForm" style={{ marginTop: '24px' }}>
                    <Title level={5}>Nueva Experiencia Laboral</Title>
                    <Form.Item name="company" label="Nombre de la Empresa" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="job_title" label="Puesto" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="start_date" label="Fecha de inicio (YYYY-MM-DD)" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="end_date" label="Fecha de fin (YYYY-MM-DD)" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Descripcion" rules={[{ required: true, message: 'Este campo es requerido' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModifyCurriculum;