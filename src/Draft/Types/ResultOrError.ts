export type ResultOrError<TResult, TError> = { isError: false, result: TResult} | { isError: true, error: TError}
