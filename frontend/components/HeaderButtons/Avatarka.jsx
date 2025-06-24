import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function Avatarka({...props}) {
    const {
        children,
        onClick,
        className,
        imageUrl,
        backgroundColor: propBackgroundColor,
    } = props

    const [backgroundColor, setBackgroundColor] = useState(propBackgroundColor || '#87d068');

    useEffect(() => {
        if (!propBackgroundColor) {
            const newColor = generateRandomColor();
            setBackgroundColor(newColor);
            // нужно придумать как передать цвет на сервер
        }
    }, [propBackgroundColor]);

    return (
        <Avatar
            style={{ backgroundColor }}
            icon={<UserOutlined />}
        />
    );
}

export default Avatarka;