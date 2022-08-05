import { ResultOrErrorWithDetails } from "./Types/ResultOrError";

export function extractResultAndAssertIsNotError<TResult, TError>(
    resultOrError: ResultOrErrorWithDetails<TResult, TError>
): TResult {
    expect(resultOrError.isError).toBe(false);
    if (!resultOrError.isError) {
        return resultOrError.result;
    }

    // This should never happen ever
    throw Error("Some quantum shit is going on here");
}

export function extractErrorAndAssertIsError<TResult, TError>(
    resultOrError: ResultOrErrorWithDetails<TResult, TError>
): TError {
    expect(resultOrError.isError).toBe(true);
    if (resultOrError.isError) {
        return resultOrError.error;
    }

    // This should never happen ever
    throw Error("Some quantum shit is going on here");
}
