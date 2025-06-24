import { Form, Layout, message} from "antd";
import HttpProvider from "../../HttpProvider";
import {route} from "../../route";
import Input from "../layout/Input/Input";
import Select from "../layout/Select/Select";
import Button from "../layout/Button/Button";
import "../../assets/less/styles/less/layout/Authentication.less"
import {useState} from "react";
import {useDispatch} from "react-redux";
import {UPDATE_USER_INFO} from "../../actions/actionTypes";
import {isEmpty} from "lodash";

function Authentication({...props}) {
    const [form] = Form.useForm();
    const [formUp] = Form.useForm();
    const dispatch = useDispatch()
    const [typeEntrance, setTypeEntrance] = useState(false);

    const normalizeValues = (values) => {
        const result = {};
        Object.entries(values).forEach(([key, value]) => {
            result[key] = value === undefined || value === null ? "" : value;
        });
        return result;
    };

    const onFinishUp = (values) => {
        const normalized = normalizeValues(values);

        fetch('http://localhost:5190/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(normalized),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    dispatch({ type: UPDATE_USER_INFO, payload: data });
                    message.success("Registration successful");
                } else {
                    message.error("Registration failed");
                }
            })
            .catch((error) => {
                console.error(error);
                message.error("Registration failed");
            });
    };

    // Обработчик для авторизации (Sign in)
    const onFinishIn = (values) => {
        const normalized = normalizeValues(values);

        fetch('http://localhost:5190/api/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(normalized),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json(); // Пытаемся распарсить данные
            })
            .then((data) => {
                if (data) {
                    dispatch({ type: UPDATE_USER_INFO, payload: data });
                    message.success("Login successful");
                } else {
                    message.error("Login failed");
                }
            })
            .catch((error) => {
                console.error(error);
                message.error("Login failed");
            });
    };
    return(
        <div>
            <div className="diference_type">
                <Button type="sign-in" onClick={() => setTypeEntrance(true)}>Sign in</Button>
                <Button type="sign-up" onClick={() => setTypeEntrance(false)}>Sign up</Button>
            </div>
            {typeEntrance ?
                <Form form={form} onFinish={onFinishIn}>
                    <Form.Item name="email">
                        <Input placeholder="Email" rules={[{ required: true, message: "Email is required" }]}/>
                    </Form.Item>
                    <Form.Item name="password">
                        <Input placeholder="Password" type="password" rules={[{ required: true, message: "Password is required" }]}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="dark-blue" htmlType="submit" style={{width:"100%"}} onClick={() => props.setOpenDraweUser(false)}>Submit</Button>
                    </Form.Item>
                </Form>
                :
            <Form form={formUp} onFinish={onFinishUp}>
                <Form.Item name="fullName">
                    <Input placeholder="User name" rules={[{ required: true, message: "User name is required" }]}/>
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: "Email is required" }]}>
                    <Input type="email" placeholder="Email" />
                </Form.Item>
                <Form.Item name="Specillization" rules={[{ required: true, message: "Specialization is required" }]}>
                    <Input placeholder="specillization" />
                </Form.Item>
                <Form.Item
                    name="role"
                    initialValue="author"
                    rules={[{ required: true, message: "Role is required" }]}
                >
                    <Select
                        options={[
                            { label: "Author", value: "Author" },
                            { label: "Reviewer", value: "Reviewer" },
                        ]}
                    />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
                    <Input placeholder="Password" type="password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="dark-blue" htmlType="submit" style={{width:"100%"}} onClick={() => props.setOpenDraweUser(false)}>Submit</Button>
                </Form.Item>
            </Form>
            }
        </div>
    )
}

export default Authentication;