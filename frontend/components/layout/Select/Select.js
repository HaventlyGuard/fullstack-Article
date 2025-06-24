import {Select as AntSelect} from "antd";
import "../../../assets/less/styles/less/layout/Select/Select.less"
import {RiArrowDownSLine} from "react-icons/ri";
import {useState, useEffect} from "react";

function Select({...props}) {
    const [options, setOptions] = useState(props.options);
console.log(props)
    return (

        <AntSelect {...props}
                      options={options}
                      suffixIcon={<RiArrowDownSLine />}
                      className={`${props.className} select-wrap`}
                      onChange={props.onChange}

        />
    )
}
export default Select;