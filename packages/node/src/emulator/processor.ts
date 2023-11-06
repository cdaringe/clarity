interface ProcessorByName {}

type ProcessorTuple<I extends any[], O extends any> = [input: I, output: O];

import { ClarityInput } from "../interfaces";
interface ProcessorByName {
  "std/num/sum": ProcessorTuple<
    [a: ClarityInput<number>, b: ClarityInput<number>],
    [o1: ClarityInput<number>]
  >;
  "std/num/sub": ProcessorTuple<
    [a: ClarityInput<number>, b: ClarityInput<number>],
    [o1: ClarityInput<number>]
  >;
}

// interface ProcessorByName {
//   "std/num/sum": number;
//   "std/num/sub": boolean;
// }

export type ProcessorName = keyof ProcessorByName;
type ProcessorNameTest<T extends ProcessorName> = T;

type _Test1 = ProcessorNameTest<"std/num/sum">;
// @ts-expect-error
type _Test2 = ProcessorNameTest<"std/num/fooo">;
