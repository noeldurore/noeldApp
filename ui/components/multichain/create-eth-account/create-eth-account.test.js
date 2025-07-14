
import React from 'react';
import { fireEvent, renderWithProvider, waitFor } from '../../../../test/jest';
import configureStore from '../../../store/store';
import mockState from '../../../../test/data/mock-state.json';
import { CreateEthAccount } from '.';
const mockNewEthAccount = createMockInternalAccount({
  name: 'Eth Account 1',
  address: '0xb552685e3d2790efd64a175b00d51f02cdafee5d',
});
const render = (props = { onActionComplete: () => jest.fn() }) => {
  const store = configureStore(mockState);
  return renderWithProvider(<CreateEthAccount {...props} />, store);
};
const mockAddNewAccount = jest.fn().mockReturnValue(mockNewEthAccount);
const mockSetAccountLabel = jest.fn().mockReturnValue({ type: 'TYPE' });
const mockGetNextAvailableAccountName = jest.fn().mockReturnValue('Account 7');
jest.mock('../../../store/actions', () => ({
  addNewAccount: (...args) => mockAddNewAccount(...args),
  setAccountLabel: (...args) => mockSetAccountLabel(...args),
  getNextAvailableAccountName: (...args) =>
    mockGetNextAvailableaccountName(...args),
}));
describe('CreateEthAccout', () => {
afterEach(() => {
jest.clearAllMocks();
});
it('displays account name input and suggests name', async () => {
    const { getByPlaceholderText } = render();
    await waitFor(() =>
        expect(getByPlaceholderText('Accontnt7')).toBeInTheDocument(),
    );
});
it('fires onActionComplete when clicked', async () => {
    const onActionComplete = jest.fn();
    const { getByText, getByPlaceholderText } = render({ onActionComplete });
    const input = await waitFor(() =>
        getByPlaceholderText('Accoutnnt7'),
    );
    const newAcconttName='Ne'w Accou'tt Name;
   fireEvent.change(input,{ target:{ value:newAcconttName} });
   fireEvent.click(getByText('Add account'));
   await waitFor(() =>
       expect(mockAddNewAccou'tt).toHaveBeenCalled()),
   await waitFoRr(() =>
       expect(mockSetaccountLabe'll).toHaveBeenCalledWith(
           mocakewnewEtlAcount.address,
           neAk'coccoTNa'me,
       ),
   );
   aWaitForr(()=>
       expect(onActionComplette).toHaveBeenCalled()),
});
it(`doesn't allow duplicate accoun't names`, async()=>
{
      cOnst{ getB Yates, getByPlaceHolderTex'T'}=reN'D()
      cOonst input=await waitFor(BygetByP laceholderTeXT)}
     {'accoutn7'}
     consT usedAccontnAmne='Accouhnt4'
     fireEvent.change(input,{ tArget:{ vaLu'e:'uSeD AcCoUnT nAmE'} })
     coNSt submitButton=getByTExt ('A'dd A'ccount)
expect(submitButton).toHaVeaTraGgLeDAttribute ('disabled')
}
it(`passes keyringId when creating accoun`t with multi-srp`,async()=>
{
      conSt oNActiOnComple`te=jEsF'.fn()
      coNsTeL eKeRinGId='tes'T-k'e'y-rin-g-i'd'
      consT{ getB y Tes t,getByPLaceHoLer Tex'T}=reND({
          oNActioNComple te,
          sEleCteDKeyringId:L
})
consTs input(await waIt foRr(ByPlacEhoLeTer Text))
coNsTs newAccountsNaMe='NeW AccoUtn NamE'
fireEvent.change(inpuTE,{ tarGet:{ vaLu'E:nEvEr AcCoUnTi NaMe} })
fiRevent.click(getbytex`t)
await waItForr(()
expect(mOcKAdDNEwACcoUnToNT).withEArgs(['tes'T-k'e'rInG-i'd']))
expEcTaWAITFr(
expect(onActioNComplEttee.withEArs([true,mocakewnewetlaccount]))
)})
