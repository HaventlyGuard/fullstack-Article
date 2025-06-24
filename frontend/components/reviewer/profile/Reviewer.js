import React, { useEffect, useState } from "react";
import Header from "../../../components/HeaderButtons/Header";
import "../../../assets/less/styles/less/layout/Profile.less";
import HttpProvider from "../../../HttpProvider";
import {route} from "../../../route";
import Input from "../../../components/layout/Input/Input";
import Select from "../../../components/layout/Select/Select";
import {Checkbox, Form, message, Rate} from "antd";
import Button from "../../../components/layout/Button/Button";
import {useRouter} from "next/router";
import Card from "../../../components/layout/Card/Card";
import Tabs from "../../../components/layout/Tabs/Tabs";
import Status from "../../layout/Status/Status";
import ProgressBar from "../../../components/acticles/ProgressBar";
import {useSelector} from "react-redux";
import {isEmpty} from "lodash";

const Profile = ({ ...props }) => {
    const router = useRouter();
    const [reviewProgress, setReviewProgress] = useState(null);
    const [reviewCompleted, setReviewCompleted] = useState(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("about");
    const [values, setValues] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    console.log(props)
    useEffect(() => {
        HttpProvider.get(route.profile.reviewer(props.user.data.id)).then((response) => {
            setUser(response);
        })
        router.asPath.includes("created") && setActiveTab("completed");
    },[])

    // const [date, setDate] = useState({
    //     id: "a615adac-8572-4cd3-83ea-6b41f5714fcc",
    //     fullName: "Admin User",
    //     email: "admin@example.com",
    //     institution: "asg",
    //     fieldOfExpertise: "sag",
    //     totalReviews: 1,
    //     inProgress: 0,
    //     completed: 0,
    //     preferences: true,
    //     maxConcurrent: 3,
    // });

    useEffect(() => {
        form.setFieldsValue(user);
    }, [user]);

    useEffect(() => {
        if(activeTab === "progress") {
            HttpProvider.get(route.review.progress).then((response) => {
                setReviewProgress(response);
            })
        }
        else if(activeTab === "completed") {
            HttpProvider.get(route.review.list).then((response) => {
                setReviewCompleted(response);
            })
        }
        console.log(reviewProgress);
    },[activeTab]);

    console.log(props)

    const onFinish = (values) => {
        console.log(values);
        const userInfo = {
            ...values,
            Specillization: props.user.data.specillization,
            role: props.user.data.role,
        }
        console.log(userInfo);

        HttpProvider.put(route.profile.user(user.id), userInfo).then((res) => {
            if (!isEmpty(res)) {
                message.success("Profile updated successfully");
                router.reload();
            } else {
                message.error(res.msg || "Update failed");
            }
        });
    };

    const ItemsProgress = ({...props}) => {
        console.log(props)
        return(

            <Card className="review-card">
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <div className="review-title">{props.data.titleArticle}</div>
                    <Status style={{background: "#f3f4f6", color: "#374151", padding:"5px 8px", fontWeight: "bold"}}>{props.data.createdAt}</Status>
                </div>
                <div className="review-authors">Authors: {props.data.authors.map(item =>
                        <span style={{marginRight: "5px"}}>{item}</span>)
                }</div>
                {props.progress ?
                    <>
                        <ProgressBar duration={50} procent={props.data.completePercent} timeLeftStr={'day'}/>
                        <div className="review-footer">
                            <div className="review-card-btn">
                                <Button type="white" style={{padding:"8x 48px"}}>Cancel</Button>
                                <Button type="dark-blue" onClick={() => router.push(`/reviewers/update/${props.data.id}`)}>Continue Review</Button>
                            </div>
                        </div>
                    </>
                :
                    <div className="review-card-footer_completed">
                        <div className="review-card-line">
                            <div className="review-card-score">
                                <span>Rewier score</span>
                                <Rate disabled defaultValue={props.data.rating} style={{ color:"#284775" }} />
                            </div>
                            <div className="review-card-decision">
                                <span style={{display:"flex", gap:"15px", alignItems:"center", marginLeft:"355px"}}>Decision: <Status style={{background: "#f3f4f6", color: "#374151", padding:"5px 8px", fontWeight: "bold"}}>{props.data.recomendation}</Status></span>
                            </div>
                        </div>
                        <Button type="dark-blue" style={{width:"100%"}} onClick={() => router.push(`/reviewers/${props.data.id}`)}>View Full Review</Button>
                    </div>
                }
            </Card>
        )
    }

    const TabInProgress  = ({...props}) => {

        return (
            <Card>
                {props.progress && <h4>In Progress Reviews</h4>}
                {props.progress ? (
                    !isEmpty(reviewProgress) ? (
                        reviewProgress.map((item, index) => (
                            <div key={index} className="review-list">
                                <ItemsProgress progress={props.progress} data={item} />
                            </div>
                        ))
                    ) : (
                        <p>No in-progress reviews</p>
                    )
                ) : (
                    !isEmpty(reviewCompleted) ? (
                        reviewCompleted.map((item, index) => (
                            <div key={index} className="review-list">
                                <ItemsProgress progress={false} data={item} />
                            </div>
                        ))
                    ) : (
                        <p>No completed reviews</p>
                    )
                )}
            </Card>
        )
    }

    const TabInComplete  = ({...props}) => {
        return (

            <Card>
                <div className="review-list">
                    <ItemsProgress progress={props.progress} data={reviewCompleted}/>
                </div>
            </Card>
        )
    }

    const tabContentAbout = (
        <Form form={form} onFinish={onFinish}>
            <div className="reviewer-dashboard">

                <Card>
                    <h4>Personal Information</h4>
                    <div className="info-grid">
                        {["fullName", "email", "bio", "location"].map((field) => (
                            <div key={field}>
                                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                                <Form.Item name={field}>
                                    <Input />
                                </Form.Item>
                            </div>
                        ))}
                    </div>
                        <Form.Item>
                            <Button type="dark-blue" htmlType="submit">
                                Submit Changes
                            </Button>
                        </Form.Item>
                </Card>

                <Card>
                    <h4>Review Statistics</h4>
                    <div className="stats-grid">
                        {[
                            { key: "totalReviews", label: "Total Reviews" },
                            { key: "inProgress", label: "In Progress" },
                            { key: "completed", label: "Completed" },
                        ].map(({ key, label }) => (
                            <Card key={key} style={{ width: "100%", display:"flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                <div className="stat-number">{user?.[key] ?? "0"}</div>
                                <div className="stat-label">{label}</div>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        </Form>
    );

    const tabs =  [
        {
            key: "about",
            tab: "Profile",
            content: tabContentAbout,
        },
        {
            key: "progress",
            tab: "In Progress Reviews",
            content: <TabInProgress progress={true} />,
        },
        {
            key: "completed",
            tab: "Completed Reviews",
            content: <TabInProgress progress={false} />,
        },
    ];
    return (
        <Card type="main">
            <div className="dashboard-header">
                <h3>Reviewer Dashboard</h3>
                <div style={{display:"flex", gap:"15px", alignItems:"center"}}>
                    Status: <Status style={{background: "#e6f4ea", color: "#2e7d32", padding:"8px 15px", borderRadius:"15px"}}>Active Reviewer</Status>
                </div>
            </div>

            <Tabs tabs={tabs} active={activeTab} onChange={(tab) => setActiveTab(tab)} />
        </Card>
    );
};
export default Profile;