export type FlowNodeLabelIcon = 'function' | 'composite' | 'enum';

export default function FlowNodeLabel(props: {
    name: string;
    icon: FlowNodeLabelIcon;
    count: number;
    usedOverloads: number | null | undefined;
}) {
    let overloadText =
        props.count > 1 ? (
            <span style={{ fontSize: 8 }}>
                {props.usedOverloads ? props.usedOverloads + '/' : ''}
                {props.count} overloads
            </span>
        ) : (
            <></>
        );
    let iconElement = <></>;

    let alt, src;

    // Icons from https://www.svgrepo.com/collection/graphic-design-tool-icons/

    switch (props.icon) {
        case 'function':
        case 'composite':
        case 'enum':
            src = props.icon + '.svg';
            alt = props.icon;
            break;
    }

    if (alt && src) {
        iconElement = (
            <img
                src={src}
                alt={alt}
                height="16px"
                width="16px"
                style={{ display: 'inline', marginRight: '4px' }}
            />
        );
    }

    return (
        <>
            <span className="flex items-center justify-center">
                {iconElement}
                {props.name}
            </span>
            {overloadText}
        </>
    );
}
