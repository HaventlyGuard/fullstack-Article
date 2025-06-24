import Card from "../../components/layout/Card/Card";
import {Form, Upload, message, Layout} from "antd";
import Input from "../../components/layout/Input/Input";
import Select from "../../components/layout/Select/Select";
import {InboxOutlined} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import Button from "../../components/layout/Button/Button";
import {useState} from "react";
import HttpProvider from "../../HttpProvider";
import {route} from "../../route";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";

function Create({...props}){
    const [form] = Form.useForm();
    const router = useRouter();
    const [fileData, setFileData] = useState(null);
    const user = useSelector((state) => state.user);
    const [file, setFile] = useState(null);

    const categoryis = [
        { label: "Technology", key: "Technology" },
        { label: "Science", key: "Science" },
        { label: "Culture", key: "Culture" }
    ];

    const tagsOptions = [
        { label: "AI", value: "ai" },
        { label: "React", value: "react" },
        { label: "Security", value: "security" },
        { label: "Education", value: "education" }
    ];

    const handleFileUpload = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(",")[1];
                setFileData({
                    name: file.name,
                    type: file.type,
                    content: base64
                });
                resolve(false);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (values) => {
        if (!fileData) {
            message.error("Please upload a file.");
            return;
        }

        const payload = {
            title: values.title,
            category: values.category,
            textContent: values.textContent,
            tags: values.tags,
            authors: [user.data.id],
            file: fileData
        };

        try {
            // HttpProvider.sendFormData(route.articles.create, payload)
            const response = await fetch(route.articles.create, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                form.resetFields();
                rediectProfile();
                setFileData(null);
            } else {
                throw new Error("Submission failed");
            }
        } catch (error) {
            message.error(error);
        }
    };

    function rediectProfile(){
        message.success("Article submitted successfully");
        router.push({pathname: "/user/2", query: "created"});
    }

    const { Dragger } = Upload;

    return(
        <Layout style={{minHeight: "100vh" }}>
            <Card type="main">
                <h2>Submit Article for Review</h2>
                <span>Please fill in the details below to submit your article for review</span>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="title" label="Article Title" rules={[{ required: true }]}>
                        <Input placeholder="Enter article title" />
                    </Form.Item>

                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select
                            options={categoryis.map(({ label, key }) => ({ label, value: key }))}
                            placeholder="Select a category"
                        />
                    </Form.Item>

                    <Form.Item name="tags" label="Tags">
                        <Select
                            mode="multiple"
                            allowClear
                            options={tagsOptions}
                            placeholder="Select tags"
                        />
                    </Form.Item>

                    <Form.Item name="textContent" label="Article Content" rules={[{ required: true }]}>
                        <TextArea placeholder="Enter article content" rows={6} />
                    </Form.Item>

                    <Form.Item label="Upload File" required>
                        <Dragger
                            name="file"
                            accept="*"
                            beforeUpload={handleFileUpload}
                            showUploadList={true}
                            maxCount={1}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single upload only. Do not upload sensitive data.
                            </p>
                        </Dragger>
                    </Form.Item>

                    <Form.Item>
                        <Button type="dark-blue" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    )
}

export default Create;