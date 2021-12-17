export function generateArray(count: number): string[] {
    return Array.from(Array(count)).map((_,i) => `item${i}`)
}