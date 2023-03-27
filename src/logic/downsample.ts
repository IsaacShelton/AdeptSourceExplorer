import assert from 'assert';

export function downsample(items: any[], maxCount: number) {
    assert(maxCount > 0);

    if (items.length <= maxCount) return items;

    if (maxCount == 1) {
        return [items[0]];
    }

    if (maxCount == 2) {
        return [items[0], items[items.length - 1]];
    }

    let middleItems = [];
    let rest = items.slice(1, items.length - 1);
    let islands = maxCount - 2;
    let padding = Math.floor(0.5 * (rest.length - (islands * rest.length) / (islands + 1)));

    for (let i = 0; i < islands; i++) {
        let index = padding + Math.round((i * rest.length) / (islands + 1));
        middleItems.push(rest[index]);
    }

    return [items[0], ...middleItems, items[items.length - 1]];
}
