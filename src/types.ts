// Generic
export declare type Optional<T> = T | undefined
export interface Dictionary<T> {
  [key: string]: Optional<T>
}
