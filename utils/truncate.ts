export function truncateAddress(address: string): string {
    if (address?.length < 11) {
        return address;
    }
    const prefix: string = address?.slice(0, 5);
    const suffix: string = address?.slice(-5);
    return `${prefix}...${suffix}`;
}