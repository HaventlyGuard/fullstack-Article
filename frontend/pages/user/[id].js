import {connect, useDispatch, useSelector} from "react-redux";
import Reviewer from "../../components/reviewer/profile/Reviewer";
import {useEffect, useState} from "react";
import HttpProvider from "../../HttpProvider";
import {route} from "../../route";
import {useRouter} from "next/router";
import Authors from "../../components/authors/Authors";
import {wrapper} from "../../store";
import {fetchArticle} from "../../actions/fetchArticles";
import MangementControler from "../../components/MangementControler";
import Management from "../../components/layout/Management/Management";
import {Layout} from "antd";


function User({...props}) {
    const [role, setRole] = useState(null);
    const router = useRouter();
    const user = useSelector(state => state.user);

    return (
        <>
            {user.data.role === "Reviewer" ? (
                <Reviewer user={user} />
            ) : user.data.role === "Author" ?  (
                <Authors user={user} />
            ) : user.data.role === "Admin" ?  (
                <Management/>
            ) :
                user.data.role === "Blocked" ? (
                        <Layout style={{minHeight: "100vh"}}>
                            <span style={{display:"flex",fontSize:"18px", justifyContent:"center"}}>Your account is blocked</span>
                        </Layout>
                    )
                :
                <Layout style={{minHeight: "100vh"}}>
                    <span style={{display:"flex",fontSize:"18px", justifyContent:"center"}}>Log in, or sign up to your account</span>
                </Layout>
            }
        </>
    );
}


export default User;