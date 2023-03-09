
import { useLayoutEffect, useRef, useState } from 'react';
import './NameIconWrapper.scss';

export default function NameIconWrapper({ name, icon, count }: any) {
    let overloadText = (count > 1) ? (<span style={{ fontSize: 8 }}>{count} overloads</span>) : (<></>);
    let iconElement = <></>;

    let alt, src;

    // Icons from https://www.svgrepo.com/collection/graphic-design-tool-icons/

    switch (icon) {
        case "function":
        case "composite":
        case "enum":
            src = icon + ".svg";
            alt = icon;
            break;
    }

    if (alt && src) {
        iconElement = <img
            src={src}
            alt={alt}
            height="16px"
            width="16px"
            style={{ "display": "inline", "marginRight": "4px" }} />;
    }

    return (
        <>
            <span className='NameIconWrapper'>
                {iconElement}
                {name}
            </span>
            {overloadText}
        </>
    );
}