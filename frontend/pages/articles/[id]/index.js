import {Layout, message} from "antd";
import Card from "../../../components/layout/Card/Card";
import {useEffect, useState} from "react";
import HttpProvider from "../../../HttpProvider";
import {useRouter} from "next/router";
import {route} from "../../../route";
import Button from "../../../components/layout/Button/Button";


function Article({...props}) {
    const router = useRouter();
    const [article, setArticle] = useState([]);

    const { id } = router.query;

    const [downloads, setDownloads] = useState(null);

    console.log(id);

    useEffect(() => {
        // const res = fetch(route.articles.item("81d6a340-7f9b-4830-a2cc-20039d25a602")).then(res => res.json());
        HttpProvider.get(route.articles.item(id)).then((res) => {
            setArticle(res);
        })
        // setArticle(res);
    }, []);

    return (
        <Layout style={{minHeight: "100vh" }}>
            <h2>{article.title ?? "Name rewers"}</h2>
            <Card type="main">
                <span>Category</span>
                <Card type="card">
                    <div>{article.category ?? "Heklo"}</div>
                </Card>
                <span>Content</span>
                <Card type="card">
                    <div>{article.textcontent ?? "Heklo"}</div>
                </Card>
                <span>Files</span>
                <Card type="card">
                    <div>
                        <Button onClick={() => window.open(route.articles.file(article.fileId), '_blank')}>Download files</Button>
                    </div>
                </Card>
            </Card>
        </Layout>
    )
}


export default Article;