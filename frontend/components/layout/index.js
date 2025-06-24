import React, {useContext, useEffect, useState} from 'react'
import {getUserInfo} from '../../actions/profile/getUserInfo'
import {getUserRules} from '../../actions/profile/getUserRules'
import {refreshToken} from '../../actions/profile/refreshToken'
import "../../assets/less/styles/less/layout/Layout.less"
import {connect, useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import {Layout as AntLayout, message} from 'antd'
import Head from "next/head"
import { wrapper } from '../../store';
import {isProd, route} from "../../route"
import _ from "lodash";
import HttpProvider from "../../HttpProvider";
import {getCookieFromBrowser} from "../../public/cookie";
// import {YMInitializer} from "react-yandex-metrika";
import dynamic from "next/dynamic";
import Header from "../HeaderButtons/Header";
import Drawer from "./Drawer/Drawer";
import Authentication from "../Auth/Authentication";

// const DynamicComponentWithNoSSR = dynamic(
//     () => import("./Scripts"),
//     { ssr: false }
// );


function Layout(props) {
    const router = useRouter()
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openDraweUser, setOpenDraweUser] = useState(false);

    const infoDrawer = {
        isOpen: openDrawer,
        placement: 'left',
        title: 'Pages',
        onClose: () => setOpenDrawer(false),
        buttons: [
            { label: 'Article', route: '/', key: '/' },
        ],
    };

    console.log(props)

    const userDrawer = {
        isOpen: openDraweUser,
        placement: 'right',
        title: 'Authorization',
        onClose: () => setOpenDraweUser(false),
        content: <Authentication setOpenDraweUser={setOpenDraweUser}/>
    }

    // useEffect(() => {
    //     if (localStorage) {
    //         let auth_date = localStorage.getItem('auth_date')
    //         auth_date = new Date(auth_date)
    //         let minutes = (new Date() - auth_date) / (60 * 1000)
    //         let token = localStorage.getItem('token')
    //
    //         try {
    //             if (token && token !== 'undefined') {
    //                 token = JSON.parse(token)
    //             }
    //         } catch (e) {
    //             token = null
    //         }
    //
    //         if (minutes >= 10080 && token || token && !getCookieFromBrowser('token')) {
    //             props.refreshToken(token).then(
    //                 (result) => {
    //                     if (result) {
    //                         token = result
    //                         window.location.reload()
    //                         // props.getUserInfo(token)
    //                     }
    //                 }
    //             )
    //         } else if (token && token !== 'undefined') {
    //             props.getUserInfo(token)
    //         }
    //
    //         setLoadScript(true)
    //     }
    //
    //     if (router.query.confirm_registration === "yes") {
    //         HttpProvider.auth_post(route.user.confirm, {
    //             code: router.query.confirm_code,
    //             user: router.query.confirm_user_id
    //         }).then(res => {
    //             if (res.success) {
    //                 message.success('Вы успешно активировали профиль, теперь можно авторизоваться!', 10)
    //             }
    //         });
    //     }
    //
    // }, [])
    // console.log(openDrawer)
    //
    // let typeID = router.query.change_password === "yes" ? 3 : 0
    // typeID = router.query.reg_modal === "y" ? 1 : typeID
    // typeID = router.query.restore_password === 'yes' ? 2 : typeID
    //
    // const [isActiveSearch, setIsActiveSearch] = useState(false);
    //
    // let LoginPopUpVisible = typeID == 3 || typeID == 2 || typeID == 1

    return (
        <AntLayout >
            <Head>
                <link rel="shortcut icon" href="/favicon2.png"/>
                <link rel="apple-touch-icon" sizes="128x128" href="/logo.png"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"/>
            </Head>

            <AntLayout className={`page__main`}>
                <AntLayout.Header style={{
                    backgroundColor: 'transparent',
                    padding: 0,
                    height: 82,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <Header user={props.currentUser.data} avatarUrl={"sd"} setOpenDrawer={setOpenDrawer} setOpenDraweUser={setOpenDraweUser}/>
                </AntLayout.Header>
                <AntLayout hasSider={true}>
                    <Drawer infoDrawer={infoDrawer}/>
                    <Drawer userDrawer={userDrawer}/>
                    <AntLayout.Content className="page__content">
                        <div
                            className={`page__content-inner ${props.isMainPage ? 'page__content-inner_main' : ''} ${props.withoutInnerPadding ? "page__content-inner_max" : ""}`}>
                            {props.children}
                        </div>
                        <footer className="reviewer-footer">© 2025 Review System. All rights reserved.</footer>
                    </AntLayout.Content>
                </AntLayout>
            </AntLayout>
        </AntLayout>
    )
}

const mapDispatchToProps = {
    // getUserInfo,
    // getUserRules,
    // refreshToken,
}

const mapStateToProps = state => {
    return {
        currentUser: state.user,
        layout: state.layout,
    }
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
    // Here you can dispatch an action to fetch the user, e.g.:
    // await store.dispatch(fetchUser(someUserId));
    // const cookies = context.req.headers.cookie;

    const state = store.getState();
    return {
        props: {
            user: state.user,
        },
    };
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
