import Card from "../../../components/layout/Card/Card";
import {Layout, Rate, Spin} from "antd";
import {useRouter} from "next/router";
import HttpProvider from "../../../HttpProvider";
import {useEffect, useState} from "react";
import {route} from "../../../route";

function Reviewers({...props }) {
    const router = useRouter();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;

        const { id } = router.query;

        HttpProvider.get(route.review.item(id))
            .then((response) => {
                setReview(response);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router.isReady]);

    if (loading) {
        return (
            <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" />
            </Layout>
        );
    }

    if (!review) {
        return (
            <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div>Review not found</div>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Card type={"main"}>
                <span>Article Title</span>
                <Card type="card">
                    <div>{review.titleArticle ?? "Machine Learning Advances in 2025"}</div>
                </Card>
                <span>Author</span>
                <Card type="card">
                    <div>
                        {Array.isArray(review.fullName)
                            ? review.fullName.map((item, index) => <span key={index}>{item}</span>)
                            : "Unknown Author"}
                    </div>
                </Card>
                <span>Review score</span>
                <Card type="card">
                    <Rate disabled defaultValue={review.rating ?? 0} style={{ color: "#284775" }} />
                </Card>
                <span>Description</span>
                <Card type="card">
                    <div>{review.comment ?? "No description"}</div>
                </Card>
            </Card>
        </Layout>
    );
}

export default Reviewers;
