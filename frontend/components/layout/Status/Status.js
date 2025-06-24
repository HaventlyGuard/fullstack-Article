import "../../../assets/less/styles/less/layout/Status/Status.less"


function Status({...props}){

    return <span className="status" style={props.style}>{props.children}</span>

}
export default Status;