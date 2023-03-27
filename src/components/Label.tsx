import { ReactNode } from 'react';

export function Label(props: { children?: ReactNode }) {
    return <p className="py-2 text-lg">{props.children}</p>;
}
