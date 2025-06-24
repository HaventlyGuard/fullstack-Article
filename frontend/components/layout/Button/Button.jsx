import "../../../assets/less/styles/less/layout/Button/Button.less"

export default function Button({...props }) {
    const {
        children,
        onClick,
        className,
        type,
        style,
        width,
    } = props

    let customClass = "";
    let classList = ['button'];
    className && classList.push(className);

    switch (type) {
        case 'white':
            classList.push('button_white');
            break;
        case 'drawer':
            // classList.push('button_drawer');
            break;
        case 'menu':
            classList.push('button_menu');
            break;
            case 'danger':
                classList.push('button_danger');
                break;
        case 'aprove':
            classList.push('button_aprove');
            break;
            case 'search':
                classList.push('button_search');
                break;
        case 'exit':
            classList.push('button_exit');
            break;
        case 'sign-in':
            classList.push('button_sign-in');
            break;
            case 'sign-up':
                classList.push('button_sign-up');
                break;
        case 'dark-blue':
            classList.push('button_dark_blue');
            break;
            default:
                break;
    }

    switch (width) {
        case 'large':
            classList.push('button_large')
            break

        case 'max':
            classList.push('button_max-width')
            break

        case 'min':
            classList.push('button_min-width')
            break

        default:
            break
    }

    return(
        <button style={style} className={classList.join(' ')} onClick={onClick}>{children}</button>
    )
}
