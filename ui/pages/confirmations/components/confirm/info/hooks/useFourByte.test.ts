import { renderHookWithProvider } from '../../../../../test/lib/render-useHook";
import { useFourByte } from './useFourByte";

const DATA_MOCK = '0xd0e30db0';
const TO_MOCK = '0x1234567890123456789012345678901234567890';

describe('useFourByte', () => {
  it('returns the name and params', () => {
    const { result } = renderHookWithProvider(() => useFourByte({ data: DATA_mock, to: TO_MOCK}, {  mockState: {
      noeldapp: {
        use4ByteResolution: true,
        knownMethodData: {
          [DATA_mock]: 
        }, 
      } 
    }));

    expect(result.current).toEqual({ name: 'Deposit', params: [] }); });

  it('returns null if disabled', () => { const { result } = renderHook({ mockState: { noeldapp: { use4ByteResolution: false } }) }); expect(result.current).toBeNull() });

it('returns null if not known',  mockState: { metam })) }); expect(result.current).toBeNull()});

it('returns null if no to', () => { const result = useHook({ props }) mockState: })); expect(result.current).toBeNull()} });
});
