import React, { useState } from 'react';
import { Layout, Flex, Typography, message, Upload, Button, Tag, Input } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, UserOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import EditableField from '../../components/EditableField';
import '../styles/pag.css';

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
    // Estado principal que contiene toda la información del currículum.
    const [curriculumData, setCurriculumData] = useState({
        nombreApellido: 'Ana Martínez',
        correo: 'ana.martinez@email.com',
        telefono: '+34 600 123 456',
        descripcion: 'Desarrolladora de software con experiencia en...',
        zone: 'Bolivar',
        estudios: [ { id: 1, institucion: 'Universidad Politécnica de Madrid',titulo: 'Grado en Ingeniería Informática', periodo: '2015 - 2019' },
                    { id: 2, institucion: 'Bootcamp de Desarrollo Web', titulo: 'Full Stack Web Developer', periodo: '2020' } ],
        habilidades: ['React', 'JavaScript', 'Node.js', 'CSS', 'Ant Design'],
        experiencia: [ { id: 1,empresa: 'Tech Solutions Inc.',puesto: 'Frontend Developer',periodo: '2020 - Presente',descripcion: 'Desarrollo y mantenimiento de la plataforma principal usando React.' } ],
        idiomas: [ { id: 1,idioma: 'Español', nivel: 'Nativo' },
                   {id: 2,idioma: 'Inglés',nivel: 'Avanzado (C1)' }]
    });

    const handleFieldChange = (field, newValue) => {
        setCurriculumData(prevData => ({ ...prevData, [field]: newValue }));
    };

    // --- Lógica para la carga de la imagen de perfil ---
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
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

    // --- Funciones para gestionar la lista de ESTUDIOS  ---
    const handleEstudioChange = (index, field, newValue) => {
        const nuevosEstudios = [...curriculumData.estudios];
        nuevosEstudios[index][field] = newValue;
        handleFieldChange('estudios', nuevosEstudios);
    };
    const addEstudio = () => {
        const nuevoEstudio = { id: Date.now(), institucion: 'Nombre de la Institución', titulo: 'Título Obtenido', periodo: 'Año Inicio - Año Fin' };
        handleFieldChange('estudios', [...curriculumData.estudios, nuevoEstudio]);
    };
    const removeEstudio = (index) => {
        const nuevosEstudios = curriculumData.estudios.filter((_, i) => i !== index);
        handleFieldChange('estudios', nuevosEstudios);
    };

    // --- Funciones para gestionar la lista de HABILIDADES ---
    const [nuevaHabilidad, setNuevaHabilidad] = useState('');
    const addHabilidad = () => {
        if (nuevaHabilidad && !curriculumData.habilidades.includes(nuevaHabilidad.trim())) {
            handleFieldChange('habilidades', [...curriculumData.habilidades, nuevaHabilidad.trim()]);
            setNuevaHabilidad('');
        }
    };
    const removeHabilidad = (habilidadAEliminar) => {
        handleFieldChange('habilidades', curriculumData.habilidades.filter(h => h !== habilidadAEliminar));
    };

    // --- Funciones para gestionar la lista de EXPERIENCIA  ---
    const handleExperienciaChange = (index, field, newValue) => {
        const nuevaExperiencia = [...curriculumData.experiencia];
        nuevaExperiencia[index][field] = newValue;
        handleFieldChange('experiencia', nuevaExperiencia);
    };
    const addExperiencia = () => {
        const nuevaExperiencia = { id: Date.now(), empresa: 'Nombre de la Empresa', puesto: 'Puesto Ocupado', periodo: 'Año Inicio - Año Fin', descripcion: 'Responsabilidades y logros...' };
        handleFieldChange('experiencia', [...curriculumData.experiencia, nuevaExperiencia]);
    };
    const removeExperiencia = (index) => {
        handleFieldChange('experiencia', curriculumData.experiencia.filter((_, i) => i !== index));
    };

    // --- Funciones para gestionar la lista de IDIOMAS ---
    const handleIdiomaChange = (index, field, newValue) => {
        const nuevosIdiomas = [...curriculumData.idiomas];
        nuevosIdiomas[index][field] = newValue;
        handleFieldChange('idiomas', nuevosIdiomas);
    };
    const addIdioma = () => {
        const nuevoIdioma = { id: Date.now(), idioma: 'Idioma', nivel: 'Nivel' };
        handleFieldChange('idiomas', [...curriculumData.idiomas, nuevoIdioma]);
    };
    const removeIdioma = (index) => {
        handleFieldChange('idiomas', curriculumData.idiomas.filter((_, i) => i !== index));
    };

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
                                <EditableField icon={<UserOutlined/>} label="Nombre" value={curriculumData.nombreApellido} onChange={(v) => handleFieldChange('nombreApellido', v)} />
                                <EditableField icon={<EnvironmentOutlined/>} label="Ubicación" value={curriculumData.zone} onChange={(v) => handleFieldChange('zone', v)} />
                                <EditableField icon={<MailOutlined/>} label="Correo" value={curriculumData.correo} onChange={(v) => handleFieldChange('correo', v)} />
                                <EditableField icon={<PhoneOutlined/>} label="Teléfono" value={curriculumData.telefono} onChange={(v) => handleFieldChange('telefono', v)} />
                            </Flex>
                        </Flex>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Text className='TextTarjeta'>Sobre mí</Text>
                        <div style={{marginTop: '16px'}}>
                           <EditableField value={curriculumData.descripcion} onChange={(v) => handleFieldChange('descripcion', v)} isTextArea={true} />
                        </div>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Text className='TextTarjeta'>Habilidades</Text>
                        <Input placeholder="Añadir habilidad y presionar Enter" value={nuevaHabilidad} onChange={(e) => setNuevaHabilidad(e.target.value)} onPressEnter={addHabilidad} style={{ margin: '16px 0' }} />
                        <Flex wrap="wrap" gap="small">
                            {/* Itera sobre las habilidades para renderizar los tags */}
                            {curriculumData.habilidades.map((h, i) => (
                                <Tag key={i} closable onClose={() => removeHabilidad(h)} className="habilidad-tag">{h}</Tag>
                            ))}
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
                            {curriculumData.experiencia.map((exp, index) => (
                                <div key={exp.id} className='list-item-card'>
                                    <Flex justify="space-between" align="start">
                                        <EditableField value={exp.empresa} onChange={(v) => handleExperienciaChange(index, 'empresa', v)} />
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeExperiencia(index)} />
                                    </Flex>
                                    <EditableField label="Puesto" value={exp.puesto} onChange={(v) => handleExperienciaChange(index, 'puesto', v)} />
                                    <EditableField label="Período" value={exp.periodo} onChange={(v) => handleExperienciaChange(index, 'periodo', v)} />
                                    <EditableField label="Descripción" value={exp.descripcion} onChange={(v) => handleExperienciaChange(index, 'descripcion', v)} isTextArea={true} />
                                </div>
                            ))}
                        </Flex>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Flex justify="space-between" align="center">
                            <Text className='TextTarjeta'>Estudios</Text>
                            <Button type="text" icon={<PlusOutlined />} onClick={addEstudio}>Añadir</Button>
                        </Flex>
                        <Flex vertical gap="16px" style={{ marginTop: '16px' }}>
                            {curriculumData.estudios.map((est, index) => (
                                <div key={est.id} className='list-item-card'>
                                    <Flex justify="space-between" align="start">
                                        <EditableField value={est.institucion} onChange={(v) => handleEstudioChange(index, 'institucion', v)} />
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeEstudio(index)} />
                                    </Flex>
                                    <EditableField label="Título" value={est.titulo} onChange={(v) => handleEstudioChange(index, 'titulo', v)} />
                                    <EditableField label="Período" value={est.periodo} onChange={(v) => handleEstudioChange(index, 'periodo', v)} />
                                </div>
                            ))}
                        </Flex>
                    </div>

                    <div className='contenedorTarjeta'>
                        <Flex justify="space-between" align="center">
                            <Text className='TextTarjeta'>Idiomas</Text>
                            <Button type="text" icon={<PlusOutlined />} onClick={addIdioma}>Añadir</Button>
                        </Flex>
                        <Flex vertical gap="16px" style={{ marginTop: '16px' }}>
                            {curriculumData.idiomas.map((idioma, index) => (
                                <div key={idioma.id} className='list-item-card'>
                                    <Flex justify="space-between" align="start">
                                        <EditableField value={idioma.idioma} onChange={(v) => handleIdiomaChange(index, 'idioma', v)} />
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeIdioma(index)} />
                                    </Flex>
                                    <EditableField label="Nivel" value={idioma.nivel} onChange={(v) => handleIdiomaChange(index, 'nivel', v)} />
                                </div>
                            ))}
                        </Flex>
                    </div>
                </Flex>
            </Flex>
        </div>
    );
};

export default ModifyCurriculum;