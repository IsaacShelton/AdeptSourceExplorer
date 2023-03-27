import React, { ForwardedRef, HTMLAttributes } from 'react';

export const TextInput = React.forwardRef(
    (props: HTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement | null>) => {
        let { className, ...restProps } = props;
        return (
            <input
                type="text"
                className={`flex-grow outline-none bg-[#202020] p-4 outline-offset-0 ${className}`}
                ref={ref}
                spellCheck="false"
                {...restProps}
            />
        );
    }
);
