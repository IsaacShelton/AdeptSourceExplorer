
import { DependencyList, useEffect, useState } from 'react'

/*
    Based on https://github.com/Alpakat/use-async-memo/blob/master/src/index.ts
    Licensed under MIT License
*/

export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList): T | undefined
export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList, initial: T): T
export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList, initial?: T) {
    const [val, setVal] = useState<T | undefined>(initial);

    useEffect(() => {
        let cancel = false;

        const promise = factory();

        if (promise === undefined || promise === null) return;

        promise.then((val) => {
            if (!cancel) {
                setVal(val);
            }
        });

        return () => {
            cancel = true;
        };
    }, deps);

    return val;
}
