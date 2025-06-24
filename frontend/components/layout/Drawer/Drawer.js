import { Drawer as AntDrawer } from 'antd';
import { useRouter } from 'next/router';
import Button from "../Button/Button";

function Drawer({ ...props }) {
    const router = useRouter();
    console.log(props);

    const types = props.infoDrawer ? props.infoDrawer : props.userDrawer;

    return (
        <AntDrawer
            title={types.title}
            closable={true}
            onClose={types.onClose}
            placement={types.placement}
            open={types.isOpen}
        >
            <div className="drawer">
                {types.buttons?.map(({ label, route, key }) => (
                    <Button
                        type={"drawer"}
                        className={"button-drawer " + `${router.pathname === key ? 'button-drawer_active' : ''}`}
                        onClick={() => router.push(route)}
                        style={{marginBottom:"15px"}}
                    >
                        {label}
                    </Button>
                ))}
                {types.content &&
                    types.content
                }
            </div>
        </AntDrawer>
    );
}

export default Drawer;
