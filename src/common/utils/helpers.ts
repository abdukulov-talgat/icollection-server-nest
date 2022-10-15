export const mapPageToOffset = (page: number, limit: number) => {
    const clampedPage = Math.max(page, 1);
    return (clampedPage - 1) * limit;
};
