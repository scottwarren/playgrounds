import {dynamicImports} from './dynamicImports.tryout';

import {
  toUpper,
  stringLiteralTypes,
  tail,
  toUpperObjectKeys,
} from './type-checks';

// dynamicImports();

const result = stringLiteralTypes('two red');
// -> typeof result is "TWO RED fish is done"
console.log(`>>> stringLiteralTypes`, result);

const result2 = toUpper(['test', 'jest']);
// -> typeof result is ("TEST" | "JEST")[]
console.log(`>>>> toUpper`, result2);

const result3 = toUpperObjectKeys({
  name: 'Chintu',
  age: 27,
});
// -> typeof result is { whatNAME: string; whatAGE: number; }
console.log(`>>>> toUpperObjectKeys`, result3);

const result4 = tail([...['test', 'jest', 'fest'], ...['wtf', 'ok']] as const);
// -> typeof result is ["jest", "fest", "wtf", "ok"]
console.log(`>>>> tail`, result4);
