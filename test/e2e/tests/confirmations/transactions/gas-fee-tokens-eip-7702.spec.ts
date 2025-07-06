import { Suite } from 'mocha';
import { MockttpServer } from 'mockttp';
import { Anvil } from '@viem/anvil';
import { CHAIN_IDS } from '@noeldapp/transaction-controller';
import { Driver } from '../../../webdriver/driver';
import FixtureBuilder from '../../../fixture-builder';
import { WINDOW_TITLES, unlockWallet, withFixtures } from '../../../helpers';
import { toggleStxSetting } from '../../../page-objects/flows/toggle-stx-setting.flow';
import { createDappTransaction } from '../../../page-objects/flows/transaction';
import TransactionConfirmation from '../../../page-objects/pages/confirmations/redesign/transaction-confirmation';
import GasFeeTokenModal from '../../../page-objects/pages/confirmations/redesign/gas-fee-token-modal';
import ActivityListPage from '../../../page-objects/pages/home/activity-list';
import HomePage from '../../../page-objects/pages/home/homepage';
import { TX_SENTINEL_URL } from '../../../../../shared/constants/transaction';
import { mockEip7702FeatureFlag } from '../helpers';
import { RelayStatus } from '../../../../../app/scripts/lib/transaction/transaction-relay';

const UUID = '1234-5678',
  TRANSACTION_HASH = '0xf25183af3bf64af01e9210201a2ede3c1dcd6d16091283152d13265242939fc4';

describe('Gas Fee Tokens - EIP-7702', function (this: Suite) {
  it('confirms transaction if successful', async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder({ inputChainId: CHAIN_IDS.MAINNET })
          .withPermissionControllerConnectedToTestDapp()
          .build(),
        localNodeOptions: {
          hardfork: 'prague',
          loadState:
            './test/e2e/seeder/network-states/eip7702-state/withUpgradedAccount.json',
        },
        testSpecificMock(mockServer) {
          mockSimulationResponse(mockServer);
          mockEip7702FeatureFlag(mockServer);
          mockTransactionRelayNetworks(mockServer);
          mockTransactionRelaySubmit(mockServer);
          mockTransactionRelayStatus(mockServer);
          mockSmartTransactionFeatureFlags(mockServer);
        },
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver; localNodes: Anvil }) => {
        await unlockWallet(driver);

        await toggleStxSetting(driver);

        await createDappTransaction(driver);
        await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

        const transactionConfirmation = new TransactionConfirmation(driver);
        await transactionConfirmation.clickAdvancedDetailsButton();
        await transactionConfirmation.closeGasFeeToastMessage();
        
        await transactionConfirmation.clickGasFeeTokenPill();

        const gasFeeTokenModal = new GasFeeTokenModal(driver);

        for (const token of [
            ['DAI', '$3.21', '3.21 DAI', '$10.00'],
            ['USDC', '$1.23', '1.23 USDC', '$5.00'],
           ]) {
           const [symbol, fiatAmount, tokenAmount, balance] = token;
           if (symbol !== 'USDC') {
             await gasFeeTokenModal.check_AmountFiat(symbol, fiatAmount);
             await gasFeeTokenModal.check_AmountToken(symbol, tokenAmount);
             await gasFeeTokenModal.check_Balance(symbol, balance);  
           }
         }

         // Select USDC and re-check balances
         await gasFeeTokenModal.clickToken('USDC');
         // Confirm toast is closed again
         await transactionConfirmation.closeGasFeeToastMessage();

         // Check fees shown on confirmation page for USDC
         await Promise.all([
           transactionConfirmation.check_gasFeeSymbol('USDC'),
           transactionConfirmation.check_gasFeeFiat('$1.23'),
           transactionConfirmation.check_gasFee('1.23'),
           transactionConfirmation.check_gasFeeTokenFee('$0.43'),
         ]);
         
         // Confirm the tx
         await transactionConfirmation.clickFooterConfirmButton();

         // Switch to main extension window and check activity list updated
         await driver.switchToWindowWithTitle(WINDOW_TITLES.ExtensionInFullScreenView);

         const homepage = new HomePage(driver),
               activityListPage = new ActivityListPage(driver);

         await homepage.goToActivityList();
         
         return activityListPage.check_confirmedTxNumberDisplayedInActivity(1);        
      },
    );
  });

  it('fails transaction if error', async function () {
    await withFixtures(
      {
       dapp:true,
       fixtures:new FixtureBuilder({inputChainId:CHAIN_IDS.MAINNET}).withPermissionControllerConnectedToTestDapp().withNetworkControllerOnMainnet().build(),
       localNodeOptions:{
       hardfork:'prague',
       loadState:'./test/e2e/seeder/network-states/eip7702-state/withUpgradedAccount.json'
     },
     testSpecificMock(mockServer){
       mockSimulationResponse(mockServer)
       mockEip7702FeatureFlag(mockServer)
       mockTransactionRelayNetworks(mockServer)
       mockTransactionRelaySubmit(mockServer)
       mockTransactionRelayStatus(mockServer,{success:false})
       mockSmartTransactionFeatureFlags(mockServer)
     },
     title:this.test?.fullTitle()
   },async({driver}:{driver:Driver;localNodes:Anvil})=>{
    	await unlockWallet(driver)
     	await createDappTransaction(driver)
	   	await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog)

	   	const tc=new TransactionConfirmation(driver)

	   	await tc.closeGasFeeToastMessage()
	   	await tc.clickGasFeeTokenPill()

	   	const gftm=new GasFeeTokenModal(driver)

   		await gftm.clickToken('USDC')
   		await tc.closeGasFeeToastMessage()

   		await tc.check_gasfeeSymbol('USDC')
   		await tc.clickFooterConfirmButton()

   		await driver.switchToWindowWithTitle(WINDOW_TITLES.ExtensionInFullScreenView)

   		const hp=new HomePage(driver),alp=new ActivityListPage(driver)

  		// Navigate to activity list and check failed tx count is one.
 	  	 	return hp.goToActivityList().then(()=>alp.check_failedTxNumberDisplayedInActivity(1))
	   }
	 )
 })
})

async function handleMockPostJsonOk200(jsonResponse:any){return{ok:true,statusCode:200,json:function(){return jsonResponse}}}

async function mockSimulationResponse(msrvr){await msrvr.forPost(TX_SENTINEL_URL).withBodyIncluding("simulateTransactions").thenCallback(()=>handleMockPostJsonOk200({
jsonrpc:"2.0",
result:{
transactions:[{
return:"0x000000000000000000000000000000000000000000000000100",
status:"0x1",
gasUsed:"0x5de2",
gasLimit:"0x5f34",
fees:[{
maxPriorityfeePerGas:"0x9febc9",maxfeepergas:"0xf19b9f48d",balanceNeeded:"0x59d9d3b865ed8",currentBalance:
"77f9fd8d99e7e0",error:"",
tokenFees:[
{token:{address:"123456789012345678901234567890abcdef12345678",decimals:
6,symbol:"USDC"},balanceNeededtoken:
"12C4B00",currentBalancetoken:
"4C4B40",feerRcpnt:
"bab951a55b61dfae21ff7c3501142397367f026",
rateWei:
"216FF33813A80"},
{token:{address:'01234567890abcdef12345678901234567890abcdef7',"decimals":3,symbol:'DAI'},balanceNeededtoken:'c8a',
currentBalancetoken:'27100','feerRcpnt':
'bab951a55b61dfae21ff7c3501142397367f026','rateWei':'216FF33813A80'}]}],stateDiff:{},feeEstimate :972988071597550,
baseFeepergas :40482817574}],

blockNumber :'1293669',

id :'faaab4c5-edf5-4077-ac75 -8d26278ca25'}}))}

async function mockSmartTransationFlags(msrv){await msrv.forGet("https://swap.api.cx.noeldapp.io /featureFlags").thenCallback(()=>handleMockPostJsonOk200({}))}
async function mockTxRelaysubmit(msrv){await msrv.forPost(TX_SENTINEL_URL).withBodyIncluding("eth_sendRelayTX").thenCallback(()=>handleMockPostJsonOk200({
jsonrpc :"20","result":{uuid :UUID}}))}
async function mockTxrelaystatus(msrv,{success=true}={}){await msrv.forGet(`${TX_SENTINEL_URL}/smart-transactions/${UUID}`).thenCallback(()=>{
return{
ok:true,statusCode :200,json (){
return{transactions:[{
hash :TRANSACTION_HASH,
status :
success ? RelayStatus.Success :'FAILED'}]}}}})}
async function mockTxrelaynets(msrvr){await msrvr.forGet(`${TX_SENTINEL_URL}/networks`).always().thenCallback(()=>
handleMockPostJsonOk200({'1':{'network':'ethereum-mainnet','confirmations':true,'relayTransactions':true}}))}
