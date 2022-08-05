export type Result<TValue, TError> = { isError: false; value: TValue } | { isError: true; error: TError };
export type Option<TValue> = { isSome: true; value: TValue } | { isSome: false };
