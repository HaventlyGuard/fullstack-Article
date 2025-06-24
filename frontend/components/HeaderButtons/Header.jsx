import React, {useEffect, useState} from 'react';
import Bell from './Bell';
import Avatarka from './Avatarka';
import "../../assets/less/styles/less/layout/Header.less";
import Link from "next/link";
import Button from "../layout/Button/Button";
import {Avatar} from "antd";
import Cookies from 'js-cookie';
import {UserOutlined} from "@ant-design/icons";
import {isEmpty} from "lodash";
import {useDispatch} from "react-redux";

function Header({ ...props }) {
    const dispatch = useDispatch();
    const [isUserValid, setIsUserValid] = useState(false);

    const handleLogout = () => {
        dispatch({ type: "LOGOUT_USER", payload: {} });
        Cookies.remove('notJWT');
        setIsUserValid(false);  // Обновляем состояние сразу при логауте
    };

    useEffect(() => {
        const checkAuth = () => {
            const jwt = Cookies.get('notJWT');
            setIsUserValid(!!jwt && props.user && typeof props.user === 'object' && Object.keys(props.user).length > 0);
        };

        checkAuth();

    }, [props.user]);


    return (
        <div className={`header-container${props.className ? ' ' + props.className : ''}`}>
            <div className='header-line'>
                <Button type="menu" onClick={() => props.setOpenDrawer(prev => !prev)}/>
                <a href="/" className="header-title">Reviewer System</a>
            </div>
            <div className="header-main">
                {isUserValid && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Bell countAlerts={2} alerts={[{ message: 'Test1' }, { message: 'Test2' }]} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                            <Avatarka imageUrl={props.user} />
                            <a href={`/user/${props.user.id}`} className="header-name">{props.user.fullName}</a>
                        </div>
                        <Button onClick={() => { props.setOpenDraweUser(prev => !prev); handleLogout(); }} type="exit">Exit</Button>
                    </div>
                )}

                {!isUserValid && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {!isUserValid && (<Avatar
                            style={{ cursor: "pointer" }}
                            size={42}
                            icon={<UserOutlined />}
                            onClick={() => props.setOpenDraweUser(prev => !prev)}
                        />)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;