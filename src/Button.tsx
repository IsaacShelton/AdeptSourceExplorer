import { ButtonHTMLAttributes, ReactNode } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { iconURL?: string, noIconShift?: boolean, children?: ReactNode }) {
    let { iconURL, noIconShift, children, className, ...restProps } = props;

    return <button
        className={`bg-[#343434] hover:bg-[#444444] text-white font-bold py-2 px-4 rounded inline-flex items-center select-none flex-shrink ${className}`}
        {...restProps}
    >
        <img className={`pr-4 ${noIconShift ? 'absolute' : ''}`} src={iconURL} />
        <span className='w-full text-center pr-2'>{children}</span>
    </button>;
}
