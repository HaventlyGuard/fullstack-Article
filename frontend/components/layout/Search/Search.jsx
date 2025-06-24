import Input from "../Input/Input";
import { IoSearch } from "react-icons/io5";
import Button from "../Button/Button";

function Search({...props}){


    return (
        <div style={{display: "flex", width: "100%"}}>
            <Input placeholder={props.placeholder} onChange={props.onChange} {...props} />
        </div>
    )
}

export default Search;