
export const plural = (value: any[] | number | null, suffix: string = 's') => {
    if (value == null) return '';

    if (Array.isArray(value)) {
        return value && value.length > 1 ? suffix : '';
    } else {
        return value > 1 ? suffix : '';
    }
};
