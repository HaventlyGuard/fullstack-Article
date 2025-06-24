import {Space, Button, message} from "antd";
import Card from "./layout/Card/Card";
import "../assets/less/styles/less/layout/article/articleCard.less";
import { CalendarOutlined, TagFilled } from "@ant-design/icons";
import Avatarka from "./HeaderButtons/Avatarka";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import HttpProvider from "../HttpProvider";
import {route} from "../route";
import {isEmpty} from "lodash";

function ArticleCard({...props}){
    const router = useRouter();
    const user = useSelector((state) => state.user);
    const {
        image,
        status,
        title,
        name,
        date,
        tag,
        onViewDetails
    } = props;

    console.log("Datas",props);

    const handleDelete = () => {
        HttpProvider.del(route.articles.delete(date.id)).
            then((res) => {
                console.log(res)
                if (isEmpty(res)) {
                    message.success(`Article deleted ${date.name}`);
                    props.onDelete(date.id);
                }
                else{
                    message.error(`Article not deleted ${date.name}`);
                }
        })
    }

    return(
        <Card type="card">
            <div className="article-card-container">
    
                <div className="article-card-left-col">
                    <div className="article-card-title-row">
                        <div className="avatarka-img">
                            <Avatarka imageUrl={image}/>
                        </div>
                        <span className="article-card-title">{date?.title ?? "Machine Learning Advances in 2025"}</span>
                    </div>
                    <div className="article-card-meta-row">
                        <span className="article-card-name">by {date?.name ?? "dasf"}</span>
                        <span className="article-card-date">
                            <CalendarOutlined /> {(typeof date?.createdAt === 'string' && date?.createdAt) ? date?.createdAt : "May 8, 2025"}
                        </span>
                        <span className="article-card-tag">
                            <TagFilled /> {(typeof date?.category === 'string' && date?.category) ? date?.category : "Technology"}
                        </span>
                    </div>
                </div>
                
                <div className="article-card-right-row">
                    <div className="article-card-status">
                        <span>{date?.status !== null ? date?.status : "Pending Review"}</span>
                    </div>
                    {/*Заглушка true там должна быть проверка на role пользователя*/}
                    {user?.data.role === "Admin" && <Button type="link" onClick={() => handleDelete()}>Delete</Button>}
                    {(date?.status === "Not_reviewed" && user.data.role === "Reviewer") && <Button type="link" onClick={() => router.push({pathname: "/reviewers/create/", query:props.date.id})}>Reviewed</Button>}
                    <Button type="link" {...props} onClick={onViewDetails ?? (() => {})}>View Details</Button>
                </div>
            </div>
        </Card>
    )
}

export default ArticleCard;