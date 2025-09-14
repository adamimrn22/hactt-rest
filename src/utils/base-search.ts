// utils/baseSearch.ts
export abstract class BaseSearch<T, WhereInput, OrderByInput> {
    protected abstract buildSearchFilters(
        filters: Record<string, any>
    ): WhereInput;

    // Common logic for sorting
    protected buildSortOptions(
        sortBy: string | string[],
        sortOrder: 'asc' | 'desc'
    ): OrderByInput {
        const orderBy: OrderByInput = {} as OrderByInput;

        if (typeof sortBy === 'string') {
            orderBy[sortBy] = sortOrder;
        } else {
            sortBy.forEach((field) => {
                orderBy[field] = sortOrder;
            });
        }

        return orderBy;
    }

    // Common pagination logic
    protected getPagination(skip: number, limit: number) {
        return {
            skip,
            take: limit,
        };
    }
}
