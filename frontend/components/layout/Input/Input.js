import React, {useState} from 'react';
import {Input as AntInput} from 'antd';
import "../../../assets/less/styles/less/layout/Input/Input.less"

const Input = (props) => {
    let classList = ['input'];
    const { type, value, onChange, ...restProps } = props;
    const { Search } = AntInput;

    const [isValid, setIsValid] = useState(true);

    const validateEmail = (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
    };

    const handleEmailChange = (e) => {
        const val = e.target.value;
        if (validateEmail(val) || val === '') {
            setIsValid(true);
            onChange?.(e); // вызвать внешний onChange, если передан
        } else {
            setIsValid(false);
        }
    };

    switch (props.type) {
        case 'password':
            return <AntInput.Password className={classList.join(' ')} {...props} value={props.value} />

        case 'search':
            return <Search className={classList.join(' ')} {...props} />;

        case 'area':
            return <AntInput.TextArea className={classList.join(' ')} {...props} value={props.value} />;

        case 'email':
            return (
                <AntInput
                    className={`${classList.join(' ')} ${!isValid ? 'input-error' : ''}`}
                    {...restProps}
                    value={value}
                    onChange={handleEmailChange}
                    status={!isValid ? 'error' : undefined}
                />
            );

        default:
            return (
                <AntInput style={{border:"1px solid #000"}} className={classList.join(' ')} {...props} value={props.value || undefined}/>
            )
    }
}

export default Input;