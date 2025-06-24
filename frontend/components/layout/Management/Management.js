import MangementControler from "../../MangementControler";
import {Layout} from "antd";


function Management(){

    return(
        <Layout style={{minHeight: "100vh" }}>
            <h2>User Management</h2>
            <MangementControler/>
        </Layout>
    )
}

export default Management;