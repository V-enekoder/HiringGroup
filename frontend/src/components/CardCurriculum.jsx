

// COMPONENTE CARD CURRICULUM QUE SE MUESTRA EN EL BUSCADOR LABORAL

import { Button, Flex, Card, Space, Avatar, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import './styles.css'
import { Link } from 'react-router-dom';
const { Text } = Typography;

const CardCurriculum = () => {


    return (
        <Card
            className="offer-item-hoverable"
            title="Resumen Curricular"
            actions={[
                <Link to='/candidato/curriculum'>
                    <Button style={{ width: '70%' }} block icon={<EditOutlined />} key="edit">
                        Modificar CV
                    </Button>
                </Link>
            ]}
        >
            <Flex vertical align="center" gap="middle">
                <Card.Meta
                    avatar={<Avatar size={64} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                />

                <Space direction="vertical" align="start" style={{ width: '100%' }}>
                    <Text><strong>Nombre:</strong> Manuel</Text>
                    <Text><strong>Profesión:</strong> Ingeniero de Software</Text>
                    <Text><strong>Skills:</strong> React, Node.js, Ant Design</Text>
                </Space>
            </Flex>
        </Card>
    )

}

export default CardCurriculum;