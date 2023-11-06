export type ClarityInput<T = unknown> =
  | ClarityConstInput<T>
  | ClarityStandardInput<T>;

export interface ClarityStandardInput<T = unknown> {
  type: T;
  id: string;
}

export interface ClarityConstInput<T = any> extends ClarityStandardInput<T> {
  value: T;
}
