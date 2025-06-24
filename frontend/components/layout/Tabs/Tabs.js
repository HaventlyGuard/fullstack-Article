import React, { useEffect, useState } from 'react';
import { Button, Tabs as AntTabs } from 'antd';
import "../../../assets/less/styles/less/layout/Tabs/Tabs.less"

const { TabPane } = AntTabs;

const TabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="tabs__tab-bar">
        {node => (
            <div className="tabs__tab-pane-wrap">
                {node}
            </div>
        )}
    </DefaultTabBar>
);

const Tabs = (props) => {

    const [active, setActive] = useState(props.active);

    const onChange = (key) => {
        props.onChange ? props.onChange(key) : setActive(key)
    }

    useEffect(() => {
        setActive(props.active);
    }, [props.active]);

    if (!props.tabs) return null;

    let Items = props.tabs.map((item, index) => {
        if (!item) return null;
        return (
            <TabPane
                className="tab"
                tab={item.tab}
                key={item.key ?`${item.key}` : index + 1}
                disabled={item.disabled}
            >
                {item.content}
            </TabPane>
        )
    })


    return (
        <AntTabs
            className="dashboard-tabs tab"
            onChange={key => onChange(key)}
            defaultActiveKey={active}
            renderTabBar={TabBar}
            activeKey={active}
            type="card" size="small"
        >
            {Items}
        </AntTabs>
    )
}

export default Tabs;