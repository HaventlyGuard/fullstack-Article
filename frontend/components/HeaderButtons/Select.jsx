import React, { useState } from 'react';
import { Select } from 'antd';
import { Flex } from 'antd';

let timeout;
let currentValue;
const toURLSearchParams = record => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(record)) {
        params.append(key, value);
    }
    return params;
};
const fetchData = (value, callback) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;
    const params = toURLSearchParams({ code: 'utf-8', q: value });
    const fake = () => {
        fetch(`https://suggest.taobao.com/sug?${params.toString()}`)
            .then(response => response.json())
            .then(({ result }) => {
                if (currentValue === value) {
                    const data = result.map(item => ({ value: item[0], text: item[0] }));
                    callback(data);
                }
            });
    };
    if (value) {
        timeout = setTimeout(fake, 300);
    } else {
        callback([]);
    }
};
function Selection (props) {
    const {
        children,
        onClick,
        className,
        type
    } = props
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const handleSearch = newValue => {
        fetchData(newValue, setData);
    }

    const handleChange = newValue => {
        setValue(newValue);
    };

    return (

<Flex gap="small">
    <Select
        defaultValue="lucy"
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
        ]}
    />
    <Select
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={(data || []).map(d => ({
            value: d.value,
            label: d.text,
        }))}
    />
</Flex>
    )}


export default Selection;