import React, { useState } from 'react';
import { Avatar, Badge, Button, Dropdown, Space} from 'antd';
import { BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

function Bell ({...props }) {
    const {
        children,
        onClick,
        className,
        countAlerts,
        alerts,
    } = props

    const [isOpen, setIsOpen] = useState(false);
    const [countDisplay, setCountDisplay] = useState(countAlerts);

    const items = alerts?.map((alert, index) => ({
        key: index,
        label: alert.message,
        icon: alert.icon || <ExclamationCircleOutlined />,
    })) || [];

    return (
        <Dropdown
            menu={{ items }}
            placement="bottom"
            onOpenChange={(visible) => {
                setIsOpen(visible);
                setCountDisplay(0);
            }}
        >
            <Badge size="small" count={countDisplay}>
                <BellOutlined />
            </Badge>
        </Dropdown>
    )
}
export default Bell;