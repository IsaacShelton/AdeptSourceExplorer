import { useEffect, useRef, useState } from "react";

/*
    Based off of https://github.com/fivecar/use-delay-follow-state/blob/master/src/index.ts
    Licensed under the MIT License
*/

/**
 * Enhancement of useState that sets a state after an (optional) delay in
 * milliseconds. Can be canceled with `cancelSetState`.
 * @template T
 * @param {T} initialState - The state you want to start with
 * @returns [state: T, setStateAfter: (newState: T, delayMS?: number) => void, cancelSetState: () => void]
 */
export function useDelayedState<T>(
    initialState: T
): [T, (newState: T, delayMS?: number) => void, () => void] {
    const [state, setState] = useState(initialState);
    const timeoutRef: any = useRef();

    const cancelSetState = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const setStateAfter = (newState: T, delayMS?: number) => {
        // The implication here is that setStateAfter("hi", 3000) followed shortly
        // by setStateAfter("bye") should cancel the original "hi".
        cancelSetState();

        if (delayMS === 0 || delayMS === undefined) {
            setState(newState);
        } else {
            timeoutRef.current = setTimeout(() => {
                setState(newState);
                timeoutRef.current = null;
            }, delayMS);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return [state, setStateAfter, cancelSetState];
}