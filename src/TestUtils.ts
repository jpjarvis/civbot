import {ResultOrErrorWithDetails} from "../src/Types/ResultOrError";

export function generateArray(count: number): string[] {
    return generateArrayWithNames(count, "item");
}

export function generateArrayWithNames(count: number, itemName: string): string[] {
    return Array.from(Array(count)).map((_,i) => `${itemName}${i}`);
}

export function extractResultAndAssertIsNotError<TResult, TError>(resultOrError: ResultOrErrorWithDetails<TResult, TError>): TResult {
    expect(resultOrError.isError).toBe(false);
    if (!resultOrError.isError) {
        return resultOrError.result;
    }

    // This should never happen ever
    throw Error("Some quantum shit is going on here");
}

export function extractErrorAndAssertIsError<TResult, TError>(resultOrError: ResultOrErrorWithDetails<TResult, TError>): TError {
    expect(resultOrError.isError).toBe(true);
    if (resultOrError.isError) {
        return resultOrError.error;
    }

    // This should never happen ever
    throw Error("Some quantum shit is going on here");
}