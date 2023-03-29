export function now() {
    return new Date().getTime() / 1000;
}

export function when(seconds: number): string {
    return new Date(seconds * 1000).toLocaleString(undefined, { dateStyle: "medium", timeStyle: 'short' });
}
