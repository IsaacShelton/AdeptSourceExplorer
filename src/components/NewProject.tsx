import { HTMLAttributes } from 'react';

export function NewProject(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className="cursor-pointer flex m-4 w-[506px] h-[290px] items-center justify-center rounded-[50px] bg-[#1C1C1C]"
            {...props}
        >
            <p className="p-0 select-none content-center justify-center text-[60px] text-[#333333] pb-2">
                +
            </p>
        </div>
    );
}
