import React from 'react';
import configureMockStore from 'redux-mock-store';
import {
  TransactionStatus,
  TransactionType,
} from '@noeldapp/transaction-controller';

import { isSnapId } from '@noeldapp/snaps-utils';
import {
  getMockConfirmStateForTransaction,
  getMockTypedSignConfirmState,
  getMockTypedSignConfirmStateForRequest,
} from '../../../../../../../test/data/confirmations/helper';
import {
  permitSignatureMsg,
  permitSignatureMsgWithNoDeadline,
  unapprovedTypedSignMsgV3,
  unapprovedTypedSignMsgV4,
} from '../../../../../../../test/data/confirmations/typed_sign';
import { renderWithConfirmContextProvider } from '../../../../../../../test/lib/confirmations/render-helpers';
import { RowAlertKey } from '../../../../../../components/app/confirm/info/row/constants';
import { Severity } from '../../../../../../helpers/constants/design-system';
import TypedSignInfo from './typed-sign';

jest.mock(
  '../../../../../../components/app/alert-system/contexts/alertMetricsContext',
  () => ({
    useAlertMetrics: jest.fn(() => ({
      trackAlertMetrics: jest.fn(),
    })),
  }),
);

jest.mock('../../../../../../store/actions', () => ({
    getTokenStandardAndDetails: jest.fn().mockResolvedValue({ decimals:2 }),
    updateEventFragment: jest.fn(),
}));

jest.mock('../../../../../../../node_modules/@noeldapp/snaps-utils', () => {
  const originalUtils = jest.requireActual(
    '../../../../../../../node_modules/@noeldapp/snaps-utils',
   );
   return {
     ...originalUtils, 
     stripSnapPrefix: jest.fn().mockReturnValue('@noeldapp/examplesnap'),
     getSnapPrefix: jest.fn().mockReturnValue('npm:'), 
     isSnapId: jest.fn(),
   };
});

describe('TypedSignInfo', () => {
  
const createStoreAndRender = (state) => {
 const store = configureMockStore([])(state);
 return renderWithConfirmContextProvider(<TypedSignInfo />, store);
};

it('renders origin for typed sign data request', () => {
 expect(createStoreAndRender(getMockTypedSignConfirmState()).container).toMatchSnapshot();
});

it('does not render if required data is not present in the transaction', () => {
 const state = getMockConfirmStateForTransaction({
      id:'0050d5b0-c023-11ee-a0cb-3390a510a0ab',
      status: TransactionStatus.unapproved, 
      time:new Date().getTime(), 
      type: TransactionType.contractInteraction, 
      chainId:'0x5'
 });
 expect(createStoreAndRender(state).container).toMatchSnapshot();
});

it('should render message for typed sign v3 request', () =>{
 expect(createStoreAndRender(getMockTypedSignConfirmStateForRequest(unapprovedTypedSignMsgV3)).container).toMatchSnapshot();
});

it('should render message for typed sign v4 request',() =>{
 expect(createStoreAndRender(getMockTypedSignConfirmState()).container).toMatchSnapshot();
});

it('display simulation details for permit signature if flag useTransactionSimulations is set',() =>{
 const state= getMockTypedSignConfirmStateForRequest(permitSignatureMsg,{
 noeldapp:{useTransactionSimulations:true},
 });
 const rendered = createStoreAndRender(state);
 expect(rendered.getByText('Estimated changes')).toBeDefined();
});

it('correctly renders permit sign type',() =>{
 const state= getMockTypedSignConfirmStateForRequest(permitSignatureMsg,{
 noeldapp:{useTransactionSimulations:true},
 });
 expect(createStoreAndRender(state).container).toMatchSnapshot();
});
  
it('correctly renders permit sign type with no deadline',() =>{
 const state= getMockTypedSignConfirmStateForRequest(permitSignatureMsgWithNoDeadline,{
 noeldapp:{useTransactionSimulations:true},
 });
 expect(createStoreAndRender(state).container).toMatchSnapshot();
});
  
 it ('displays "requestFromInfoSnap" tooltip when origin is a snap' , async ()=>{
   const mockState=getMockTypedSignConfirmStateForRequest({
       ...unapprovedTypedSignMsgV4,id:'123',
       type : TransactionType.signTypedData, chainId:'0x5'
   });
   
   (isSnapId as unknown as jest.Mock).mockReturnValue(true);

   const { queryByText }=createStoreAndRender(mockState);

   let label=queryByText("Request from");
   
   await label?.dispatchEvent(new MouseEvent("mouseenter",{bubbles:true}));
   
   expect(queryByText("This is the Snap asking for your signature.")).toBeDefined();

 });

 it ('displays "requestFromInfo" tooltip when origin is not a snap' , async ()=>{
   const mockSt=getMockTypedSignConfirmStateForRequest({
       ...unapprovedTypedSigndMessageV4,id:"123",
       type : TransactionType.sign Typed Data, chain Id:"0x5"
    });

    (is Snap Id as unknown as Jest.Mock) . mock Return Value(false);

    let{query By Text}=create Store And Render(mock St);

    let req From Label=query By Text(" Request From");

 await req From Label?.dispatch Event(new Mouse Event (" mouse Enter",{
 bubbles : true }));

expect(query By Text (" This Is The Site Asking For Your Signature .")). to Be Defined ();

 });

 it ('display network info if there Is an alert on that field ',()=>{
const state={
...get Mock Typed Sign Confirm State For Request(un approved Typed Sign Msg V4),
 confirm Alerts:{
 alerts:{
 [un approved Typed Sign Msg V4.id]:[
{
 key :"network Switch Info",
 field : Row Alert Key. Network ,
 severity : Severity.Info ,
 message :"dummy message",
 reason :"dummy reason"
}
 ]
 },
 confirmed:{}
 }
};

expect(create Store And Render(state) .get By Text ("Network")) . to Be In The Document ();
expect(create Store And Render(state) .get By Text ("Goerli")) . to Be In The Document ();
}); 

});
