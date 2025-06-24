import Card from "../../components/layout/Card/Card";
import {Form, Upload, message, Rate, Layout} from "antd";
import Input from "../../components/layout/Input/Input";
import Select from "../../components/layout/Select/Select";
import {InboxOutlined} from "@ant-design/icons";
import Button from "../../components/layout/Button/Button";
import {useEffect, useState} from "react";
import HttpProvider from "../../HttpProvider";
import {route} from "../../route";
import {useRouter} from "next/router";
import TextArea from "antd/lib/input/TextArea";
import {isEmpty} from "lodash";

function Create({...props}){
    const [form] = Form.useForm();
    const router = useRouter();
    const [fileData, setFileData] = useState(null);
    console.log(props)
    useEffect(() => {
        console.log(props.review)
       form.setFieldsValue(props.review)
    },[props.review])

    const categoryis = [
        { label: "Accept", key: "Accept" },
        { label: "Processing", key: "Processing" },
    ];

    const tagsOptions = [
        { label: "AI", value: "ai" },
        { label: "React", value: "react" },
        { label: "Security", value: "security" },
        { label: "Education", value: "education" }
    ];

    const handleSubmit = async (values) => {
        const requiredFields = ["recomendation", "comment", "rating"];
        const totalFields = requiredFields.length;
        let filledFields = 0;

        requiredFields.forEach(field => {
            if (values[field] !== undefined && values[field] !== null && values[field] !== "") {
                filledFields++;
            }
        });

        const completePercent = Math.round((filledFields / totalFields) * 100);

        const ids = props.update ? "reviewId" : "articleId";
        const payload = {
            recomendation : values.recomendation,
            comment: values.comment,
            rating : values.rating,
            [ids]: props.update ? props.review.reviewId : Object.keys(router.query).toString(),
            completePercent: completePercent,
        };

        console.log(payload);
        const url = props.update ? route.review.update(props.review.reviewId) : route.review.create;

        props.update ?
            (HttpProvider.put(url, payload).then((res) => {
                if(!isEmpty(res)){
                    form.resetFields();
                    rediectProfile();
                    setFileData(null);
                }
                else{
                    message.error("Failed to reviewed article");
                }
            }))
            :
            (HttpProvider.post(url, payload).then((res) => {
                if(!isEmpty(res)){
                    form.resetFields();
                    rediectProfile();
                    setFileData(null);
                }
                else{
                    message.error("Failed to reviewed article");
                }
            }))

    };

    function rediectProfile(){
        message.success("Article submitted successfully");
        router.push({pathname: "/user/2", query: "created"});
    }

    const { Dragger } = Upload;

    return(
        <Layout style={{minHeight: "100vh" }}>
            <Card type="main">
                <h2>Review Submision</h2>
                <span>Machine Learning Application in Healthcare</span>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Card type="card">
                        <h2>Review Summery</h2>
                        <Form.Item name="rating" label="Overal rating">
                            <Rate style={{color:"#000"}}></Rate>
                        </Form.Item>
                        <Form.Item name="recomendation" label="Recomendation">
                            <Select
                                options={categoryis.map(({ label, key }) => ({ label, value: key }))}
                                placeholder="Select a recommendation"
                            />
                        </Form.Item>
                    </Card>
                    <Card type="card">
                        <h2>Additional comments</h2>
                        <Form.Item name="comment" label="Description" >
                            <TextArea></TextArea>
                        </Form.Item>
                    </Card>

                    <Form.Item>
                        <Button type="dark-blue" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    )
}

export default Create;