import "../../../assets/less/styles/less/layout/Card/Card.less"

function Card({...props}) {
    return (
        <>
            {
                props.type === "main" ? <div className="card-main" style={props.style}>
                        {props.children}
                    </div> :
                    <div className="card" style={props.style}>
                        {props.children}
                    </div>
            }
        </>
    )
}
export default Card;