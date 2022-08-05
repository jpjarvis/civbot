export type Result<TValue, TError> = { isError: false; value: TValue } | { isError: true; error: TError };
