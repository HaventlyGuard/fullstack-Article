import React, {useEffect, useState} from 'react';
import Layout from '../components/layout';
import { connect } from 'react-redux';
import { wrapper } from '../store';
import {Col, Row, Space, Layout as AntLayout} from "antd";
import 'swiper/swiper.less';
import '../assets/less/styles/less/styles.less'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getTranslation } from "../language";
import { Media } from "react-breakpoints";
import Button from "../components/layout/Button/Button";
import Select from "../components/layout/Select/Select";
import Blog from "../components/Blog/Blog";

// Define the functional component
function Index(props) {

    const [date, setDate] = useState([]);

    const handleChange = value => {
        console.log(`selected ${value}`);
    };

    return (
        <div className="index-page">
            <div className="content-inner">
                <Media>
                    {({ breakpoints, currentBreakpoint }) => (
                        <Space
                            size={breakpoints[currentBreakpoint] < breakpoints.tablet ? 38 : 28}
                            direction="vertical"
                        >
                            <AntLayout style={{minHeight: "100vh" }}>
                                <Blog></Blog>
                            </AntLayout>
                        </Space>
                    )}
                </Media>

            </div>
        </div>
    );
}

// Define the layout for the page
Index.getLayout = (page) => {
    return (
        <Layout isIndexPage={true} isMainPage={true} seo={page.props?.seo}>
            {page}
        </Layout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, pathname, req }) => {
    const translation = await serverSideTranslations(getTranslation(req), ['common', 'layout']);


    return {
        props: {
            ...translation,
        },
    };
});

const mapStateToProps = (state) => {
    return {
        // user: state.profile.user,
    };
};

export default connect(mapStateToProps, {})(Index);
