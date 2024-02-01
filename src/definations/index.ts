/**
 * 常规对象泛型
 */
export type CommonObjectType<T = any> = Record<string, T>;

/**
 * 常规数组泛型
 */
export type CommonArrayType = Array<CommonObjectType>;
