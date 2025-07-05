// COMPONENTE QUE MUESTRA LA LISTA DE EMPLEOS DISPONIBLES

import React from 'react';
import { List, Typography, Button, Flex, Space, theme } from 'antd';
import { EnvironmentOutlined, DollarCircleOutlined, UserOutlined } from '@ant-design/icons';
import './styles.css'
const { Title, Text, Paragraph } = Typography;


const ListOffers = ({ offers, onShowDetails }) => {
  const { token } = theme.useToken();

  return (
    <List
      itemLayout="vertical"
      dataSource={offers}
      locale={{ emptyText: 'No hay ofertas que coincidan con los filtros seleccionados.' }}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          className="offer-item-hoverable" 
          style={{
            backgroundColor:'#dcecf1',
            padding: '24px',
            marginBottom: '16px',
            borderRadius: token.borderRadius, 
          }}
        >
          <Flex justify="space-between" align="flex-start" gap="large">
            <Flex vertical>
              <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
                {item.profession} - {item.company}
              </Title>
              <Paragraph type="secondary" ellipsis={{ rows: 2, expandable: false }} style={{ marginBottom: 16 }}>
                {item.description}
              </Paragraph>
              <Space size="large" wrap>
                <Space>
                  <EnvironmentOutlined style={{ color: token.colorTextSecondary }} />
                  <Text type="secondary">{item.zone}</Text>
                </Space>
                <Space>
                  <UserOutlined style={{ color: token.colorTextSecondary }} />
                  <Text type="secondary">{item.position}</Text>
                </Space>
                <Space>
                  <DollarCircleOutlined style={{ color: token.colorTextSecondary }} />
                  <Text type="secondary">${item.salary}K</Text>
                </Space>
              </Space>
            </Flex>
            
            <Button color="default" variant="filled" onClick={() => onShowDetails(item)}>
              Ver Detalles
            </Button> 

          </Flex>
        </List.Item>
      )}
    />
  );
};

export default ListOffers;