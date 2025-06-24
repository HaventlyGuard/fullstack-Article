import React, { useEffect, useState } from "react";
import Header from "../../components/HeaderButtons/Header";
import "../../assets/less/styles/less/layout/Profile.less";
import HttpProvider from "../../HttpProvider";
import {route} from "../../route";
import Input from "../../components/layout/Input/Input";
import Select from "../../components/layout/Select/Select";
import {Checkbox, Form, message, Rate} from "antd";
import Button from "../../components/layout/Button/Button";
import {useRouter} from "next/router";
import Card from "../../components/layout/Card/Card";
import Tabs from "../../components/layout/Tabs/Tabs";
import Status from "../layout/Status/Status";
import ProgressBar from "../../components/acticles/ProgressBar";
import ArticleCard from "../ArticleCard";
import Search from "../layout/Search/Search";
import {UPDATE_USER_INFO} from "../../actions/actionTypes";
import {isEmpty} from "lodash";

const Authors = ({ ...props }) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("about");
    const [values, setValues] = useState(false);
    const [loading, setLoading] = useState(false);

    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        HttpProvider.get(route.articles.list).then(results => {
            setArticles(results);
            filterArticles(results, query, selectedCategory);
        });
        HttpProvider.get(route.profile.reviewer(props.user.data.id)).then((response) => {
            if(!isEmpty(response)) {
                form.setFieldsValue(response)
            }
        })
        router.asPath.includes("created") && setActiveTab("articles");
    }, []);

    useEffect(() => {
        if(activeTab === "articles") {

            HttpProvider.get(route.articles.list).then(results => {
                if(results){
                    setArticles(results);
                    filterArticles(results, query, selectedCategory);
                }
                else{
                    setArticles([]);
                }
            });
        }
        else if(activeTab === "submitArticles") {
            setArticles(null);
            setFilteredArticles(null);
            HttpProvider.get(route.articles.submit).then(results => {
                if(results){
                    setArticles(results);
                    filterArticles(results, query, selectedCategory);
                }
                else{
                    setArticles([]);
                }
            });
        }
        else if(activeTab === "reviewArticles") {
            setArticles(null);
            setFilteredArticles(null);
            HttpProvider.get(route.articles.review).then(results => {
                if(results){
                    setArticles(results);
                    filterArticles(results, query, selectedCategory);
                }
                else{
                    setArticles([]);
                }
            });
        }
    },[activeTab])

    useEffect(() => {
        filterArticles(articles, query, selectedCategory);
    }, [query, selectedCategory]);

    const handleSearchChange = (e) => {
        setQuery(e.target.value.toLowerCase());
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const filterArticles = (data, text, category) => {
        const filtered = data.filter(article => {
            const matchesText = article.title.toLowerCase().includes(text);
            const matchesCategory = category === "All" || article.category === category;
            return matchesText && matchesCategory;
        });
        setFilteredArticles(filtered);
    };

    // const [date, setDate] = useState({
    //     id: "366c5600-2900-4e63-a883-c4760a66c1b1",
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
        form.setFieldsValue(props.user.data);
    }, [props.user.data]);

    const onFinish = (values) => {
        console.log(values);
        HttpProvider.put(route.profile.user(props.user.data.id), form).then((res) => {
            if (res.ok) {
                message.success("Profile updated successfully");
                router.reload();
            } else {
                message.error(res.msg || "Update failed");
            }
        });
    };

    if (loading) return <div>Loading...</div>;



    const ItemsProgress = ({...props}) => {
        return(
            <Card className="review-card">
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <div className="review-title">Machine Learning Applications in Healthcare</div>
                    <Status style={{background: "#f3f4f6", color: "#374151", padding:"5px 8px", fontWeight: "bold"}}>Due: May 15, 2025</Status>
                </div>
                <div className="review-authors">Authors: Sarah Johnson, Michael Chen</div>
                {props.progress ?
                    <>
                        <ProgressBar duration={50} procent={15} timeLeftStr={'day'}/>
                        <div className="review-footer">
                            <div className="review-card-btn">
                                <Button type="white" style={{padding:"8x 48px"}}>Cancel</Button>
                                <Button type="dark-blue">Continue Review</Button>
                            </div>
                        </div>
                    </>
                    :
                    <div className="review-card-footer_completed">
                        <div className="review-card-line">
                            <div className="review-card-score">
                                <span>Rewier score</span>
                                <Rate disabled defaultValue={2} style={{ color:"#284775" }} />
                            </div>
                            <div className="review-card-decision">
                                <span style={{display:"flex", gap:"15px", alignItems:"center", marginLeft:"355px"}}>Decision: <Status style={{background: "#f3f4f6", color: "#374151", padding:"5px 8px", fontWeight: "bold"}}>Accept as is</Status></span>
                            </div>
                        </div>
                        <Button type="dark-blue" style={{width:"100%"}} onClick={() => router.push(`/reviewers/${1}`)}>View Full Review</Button>
                    </div>
                }
            </Card>
        )
    }

    const MyArticles  = ({...props}) => {

        return (
            <Card>
                <h4>My articles</h4>
                <div style={{display: "flex", gap: "10px"}}>
                    <Search
                        onChange={handleSearchChange}
                        placeholder="Search articles"
                        style={{ width: "100%" }}
                    />
                    <Select
                        style={{ width: "150px" }}
                        defaultValue={{ label: "All", value: "All" }}
                        options={[
                            { label: "All", value: "All" },
                            { label: "Technology", value: "Technology" },
                            { label: "Wellness", value: "Wellness" },
                            { label: "General", value: "General" }
                        ]}
                        onChange={handleCategoryChange}
                    />
                    <Button type="dark-blue" style={{width:"180px"}} onClick={() => router.push("/articles/create/")}>Add articles</Button>
                </div>
                <div className="review-list">
                    {filteredArticles && filteredArticles.map((article, index) => (
                        <ArticleCard {...props} key={index} date={article} onViewDetails={() => router.push(`/articles/${article.id}`)}/>
                    ))}
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
                        {["fullName", "email", "institution", "fieldOfExpertise"].map((field) => (
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
                                <div className="stat-number">{props.user.data?.[key] ?? "0"}</div>
                                <div className="stat-label">{label}</div>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        </Form>
    );

    const tabs = [
        {
            key: "about",
            tab: "Profile",
            content: tabContentAbout,
        },
        {
            key: "articles",
            tab: "My articles",
            content: <MyArticles progress={true} />,
        },
        {
            key: "submitArticles",
            tab: "Completed Reviews",
            content: <MyArticles/>,
        },
        {
            key: "reviewArticles",
            disabled: false,
            tab: "Review Articles",
            content: <MyArticles/>,
        },
    ];

    return (
        <Card type="main">
            <div className="dashboard-header">
                <h3>Reviewer Dashboard</h3>
                <div style={{display:"flex", gap:"15px", alignItems:"center"}}>
                    Status: <Status style={{background: "#e6f4ea", color: "#2e7d32", padding:"8px 15px", borderRadius:"15px"}}>Active Author</Status>
                </div>
            </div>
            <Tabs tabs={tabs} active={activeTab} onChange={(tab) => setActiveTab(tab)} />
        </Card>
    );
};

export default Authors;