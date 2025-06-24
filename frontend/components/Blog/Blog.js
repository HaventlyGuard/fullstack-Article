import {Layout, Space} from "antd";
import {useEffect, useState} from "react";
import ArticleCard from "../ArticleCard";
import {useRouter} from "next/router";
import Input from "../layout/Input/Input";
import { wrapper } from '../../store'
import Select from "../layout/Select/Select";
import Search from "../layout/Search/Search";
import HttpProvider from "../../HttpProvider";
import {route} from "../../route";
import {fetchArticle} from "../../actions/fetchArticles";
import {connect} from "react-redux";
import Card from "../layout/Card/Card";

function Blog({...props}){
    const router = useRouter();

    useEffect(() => {
        props.fetchArticle();
        console.log(props.articles)
    },[])

    const [filteredArticles, setFilteredArticles] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        filterArticles(props.articles, query, selectedCategory);
    }, [query, selectedCategory, props.articles]);

    const onDelete = (id) => {
        setFilteredArticles(props.articles.filter(consult => consult.id !== id))
    }

    const handleSearchChange = (e) => {
        setQuery(e.target.value.toLowerCase());
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const filterArticles = (data, text, category) => {
        const filtered = data?.filter(article => {
            const matchesText = article.title.toLowerCase().includes(text);
            const matchesCategory = category === "All" || article.category === category;
            return matchesText && matchesCategory;
        });
        setFilteredArticles(filtered);
    };

    return(
        <Layout>
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
                        { label: "Science", value: "Science" },
                        { label: "Culture", value: "Culture" }
                    ]}
                    onChange={handleCategoryChange}
                />
            </div>
            <div style={{ width: "100%", padding: "32px 0" }}>
                {filteredArticles && filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                        <ArticleCard
                            {...props}
                            key={article.id}
                            date={article}
                            onDelete={(id) => onDelete(id)}
                            onViewDetails={() => router.push(`/articles/${article.id}`)}
                        />
                    ))
                ) : (
                    <Card
                        style={{
                            minWidth: "1000px",
                            padding: "10px",
                            color: "black",
                            fontSize: "20px",
                            justifySelf: "center",
                            display: "flex",
                            alignSelf: "center",
                            justifyContent: "center"
                        }}
                    >
                        Записи не найдены
                    </Card>
                )}
            </div>
        </Layout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, pathname, req, ...res }) => {

    return store.dispatch(fetchArticle()).then((data) => {
        return {
            props: {
                items: data || [],
            }
        };
    });
})

function mapStateToProps(state) {
    return {
        articles: state.articles.article
    };
}

export default connect(mapStateToProps, { fetchArticle })(Blog)
