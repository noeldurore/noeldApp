import { diffMap, getChangedAuthorizations, getRemovedAuthorizations } from './differs';

describe('PermissionController selectors', () => {
  describe('diffMap', () => {
    it('handles undefined previous value', () => {
      const newAccounts = new Map([['foo.bar', ['0x1']]]);
      expect(diffMap(newAccounts, undefined)).toBe(newAccounts);
    });

    it('returns empty map for identical inputs', () => {
      const newAccounts = new Map([['foo.bar', ['0x1']]]);
      expect(diffMap(newAccounts, newAccounts)).toEqual({});
    });

    it('computes differences between two maps correctly', () => {
      const prev = new Map([
        ['bar.baz', ['0x1']],
        ['fizz.buzz', ['0x1']],
        ['foo.bar', []],
      ]);
      const next = new Map([
        ['bar.baz', ['0x1','0x2']],
        ['fizz.buzz'],
        [],
       ]);
     }
   });
```
