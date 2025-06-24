import {Table, Space, Tag, Modal, Form, message} from "antd";
import Card from "./layout/Card/Card";
import "../assets/less/styles/less/MangementControler.less";
import Button from "./layout/Button/Button";
import {useEffect, useState} from "react";
import Input from "./layout/Input/Input";
import Select from "./layout/Select/Select";
import HttpProvider from "../HttpProvider";
import {route} from "../route";
import fetch from "node-fetch";
import {UPDATE_USER_INFO} from "../actions/actionTypes";
import {isEmpty} from "lodash";

function MangementControler() {
    const [dataSource, setDataSource] = useState([]);
    const fetchData = () => {
        HttpProvider.get(route.profile.auth).then(results => {
            setDataSource(results);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const roles = [
        {
            label: 'Admin',
            value: 'Admin'
        },
        {
            label: 'Reviewer',
            value: 'Reviewer'
        },
        {
            label: 'Author',
            value: 'Author'
        },
        {
            label: 'Blocked',
            value: 'Blocked'
        }
    ]

    const blockedUser = (id, role, fullName, email, password, Specillization) => {
        const user = {
            role: 'Blocked',
            fullName: fullName,
            email: email,
            password: password,
            Specillization: Specillization
        };

        HttpProvider.put(route.profile.user(id),user).then((response) => {
            if (!isEmpty(response)) {
                const updatedDataSource = dataSource.map((user) =>
                    user.id === id ? { ...user, role: 'Blocked' } : user
                );
                setDataSource(updatedDataSource);
                fetchData();
            } else {
                message.error("Failed to update blocked");
            }
        })
    }

    const updateUserRole = (id, newRole, fullName, email, password, Specillization) => {
        // Создаем объект с обновленными данными пользователя
        const updatedUser = {
            role: newRole,
            fullName: fullName,
            email: email,
            password: password,
            Specillization: Specillization
        };

        // Отправляем запрос на сервер для обновления данных пользователя
        HttpProvider.put(route.profile.user(id), updatedUser).then((response) => {
            if (!isEmpty(response)) {
                // Обновляем список пользователей в state
                const updatedDataSource = dataSource.map((user) =>
                    user.id === id ? { ...user, role: newRole } : user
                );
                setDataSource(updatedDataSource);
                fetchData();
                message.success("User role updated successfully");
            } else {
                message.error("Failed to update user role");
            }
        });
    };

    const deleteUser = (id) => {
        fetch(route.profile.user(id), {
            method: 'DELETE',
            credentials: 'include',
        }).then(
            res => {
                if(res.ok){
                    const updatedDataSource = dataSource.map(consult => consult.id !== id);
                    setDataSource(updatedDataSource);
                    fetchData();
                }
            }
        )
            .catch((error) => {
                console.error(error);
                message.error("Registration failed");
            });
    }

    const handleAddUser = () => {
        form.validateFields().then((values) => {
            const newUser = {
                fullName: values.fullName,
                role: values.role,
                email: values.email,
                password: values.password,
                Specillization: values.Specillization
            };

            HttpProvider.post(route.profile.auth,newUser).then((response) => {
                if (response.ok) {
                    setDataSource([...dataSource, response]);
                }
            })
            setDataSource([...dataSource, newUser]);
            fetchData();
            form.resetFields();
            setIsModalVisible(false);
        });
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => (
                <Space>
                    <img alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", background: "#ccc" }} />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => (
                <Select
                    value={role}
                    style={{ width: 120 }}
                    options={roles}
                    onChange={(newRole) => updateUserRole(record.id, newRole, record.fullName, record.email, record.password, record.specillization)}
                />
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (role, record) => (
                <Tag color={record.role !== "Blocked" ? "green" : "red"} style={{ padding: "4px 10px", borderRadius: "20px" }}>
                    {record.role !== "Blocked" ? "Active" : "Blocked"}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <Button type="danger" onClick={() => blockedUser(record.id, record.role, record.fullName, record.email, record.password, record.specillization)}>
                        Block
                    </Button>
                    <Button type="danger" onClick={() => deleteUser(record.id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Card type="main">
            <div className="management-header">
                <Input placeholder="Search users..." style={{ width: 200, marginRight: "auto", border: "1px solid #ccc" }}/>
                <Button type="dark-blue" onClick={() => setIsModalVisible(true)}>Add new User</Button>
            </div>

            <Table
                className="management-table"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ x: 'max-content' }} // ключевой момент для адаптивности
            />

            <Modal
                title="Add New User"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddUser}
                okText="Add"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="fullName" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
                        <Input style={{border:"1px solid #000"}}/>
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select role' }]}>
                        <Select
                            options={roles}
                        />
                    </Form.Item>
                    <Form.Item name="Specillization" label="Specillization" rules={[{required: true, message: 'Please select Specialization'}]}>
                        <Input placeholder={"Specialization"}/>
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{required: true, message: 'Please enter email'}]}>
                        <Input type="email" placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
                        <Input placeholder="Password" type="password"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}

export default MangementControler;
