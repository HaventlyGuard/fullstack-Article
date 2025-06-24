import React from 'react';
import { wrapper } from '../store';
import ReactBreakpoints from 'react-breakpoints';
import ruRU from "antd/lib/locale/ru_RU";
import {ConfigProvider} from "antd";
import Router from 'next/router'
import NProgress from 'nprogress';
import { appWithTranslation } from 'next-i18next';
import Layout from "../components/layout";
import "../assets/less/styles/less/styles.less"

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 960,
  desktop: 1316,
  desktopLarge: 1500,
  desktopWide: 1920,
}

Router.events.on('routeChangeStart', (url) => {
  NProgress.configure({ parent: '.ant-layout-header', showSpinner: false });
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const PlayersApp = ({Component, pageProps}) => {
  const getLayout = Component.getLayout || ((page) => <Layout seo={pageProps.seo}>{page}</Layout>)

  return (
      <ReactBreakpoints breakpoints={breakpoints} defaultBreakpoint={breakpoints.desktop} debounceResize={true}>
        <ConfigProvider locale={ruRU}>
            {getLayout(<Component {...pageProps} />)}
        </ConfigProvider>
      </ReactBreakpoints>
  )
};

export default wrapper.withRedux(appWithTranslation(PlayersApp));