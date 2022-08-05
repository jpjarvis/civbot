export type ResultOrErrorWithDetails<TResult, TError> =
    | { isError: false; result: TResult }
    | { isError: true; error: TError };
export type ResultOrError<TResult> = { isError: false; result: TResult } | { isError: true };
