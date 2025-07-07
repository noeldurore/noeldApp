import { providerErrors } from '@noeldapp/rpc-errors';
import {
  CHAIN_IDS,
  NETWORK_TYPES,
} from '../../../../../shared/constants/network';
import switchEthereumChain from './switch-ethereum-chain';
import EthChainUtils from './ethereum-chain-utils';

jest.mock('./ethereum-chain-utils', () => ({
  ...jest.requireActual('./ethereum-chain-utils'),
  validateSwitchEthereumChainParams: jest.fn(),
  switchChain: jest.fn(),
  setTokenNetworkFilter: jest.fn(),
}));

const NON_INFURA_CHAIN_ID = '0x123456789';

const createMockMainnetConfiguration = () => ({
  chainId: CHAIN_IDS.MAINNET,
  defaultRpcEndpointIndex: 0,
  rpcEndpoints: [{ networkClientId: NETWORK_TYPES.MAINNET }],
});

const createMockLineaMainnetConfiguration = () => ({
  chainId: CHAIN_IDS.LINEA_MAINNET,
  defaultRpcEndpointIndex: 0,
  rpcEndpoints: [{ networkClientId: NETWORK_TYPES.LINEA_MAINNET }],
});

const createMockedHandler = () => {
  const next = jest.fn();
  const end = jest.fn();
  
  const mocks = {
    hasApprovalRequestsForOrigin: () => false,
    getNetworkConfigurationByChainId: jest
      .fn()
      .mockReturnValue(createMockMainnetConfiguration()),
    setActiveNetwork: jest.fn(),
    getCaveat: jest.fn(),
    getCurrentChainIdForDomain: jest.fn().mockReturnValue(NON_INFURA_CHAIN_ID),
    requestPermittedChainsPermissionIncrementalForOrigin:
      jest.fn(),
    setTokenNetworkFilter :jest.fn(),
    requestUserApproval :jest.fn()
   };
  
   const response = {};
   
   const handler = (request) =>
     switchEthereumChain.implementation(request, response, next, end, mocks);
   
   return { mocks, response, next, end, handler };
};

describe('switchEthereumChainHandler', () => {
  
 beforeEach(() => {
   EthChainUtils.validateSwitchEthereumChainParams.mockImplementation(
     (request) => request.params.chainId
   );
 });

 afterEach(() => {
   jest.clearAllMocks();
 });

 it('should validate the request params', async () => {
   const { handler }=createMockedHandler();

   await handler({
     origin:'example.com',
     params:[{ foo:true }]
   });

 expect(EthChainUtils.validateSwitchEthereumChainParams).toHaveBeenCalledWith(expect.objectContaining({params:[{foo:true}]}));
 });

 it('should return an error if request params validation fails', async() =>{
       const {end ,handler}=createMockedHandler();
       EthChainUtils.validateSwitchEthereumChainParams.mockImplementation(() =>{
         throw new Error('failed to validate params');
       });
       
       await handler({
         origin:'example.com',
         params:[{}]
       });
       
       expect(end).toHaveBeenCalledWith(new Error('failed to validate params'));
 });
 
 it('returns null and does not try to switch the network if current chain id matches param chain id', async() =>{
        const {end,response ,handler}=createMockedHandler();

        await handler({
          origin:'example.com',
          params:[
            {chainId : NON_INFURA_CHAIN_ID}
          ]
        });

        expect(response.result).toBeNull();
        expect(end).toHaveBeenCalled();
        expect(EthChainUtils.switchChain).not.toHaveBeenCalled();
 });
 
 it('throws error and does not switch if no matching network configuration found for param chain id', async()=>{
          const{mocks,end ,handler} =createMockedHandler();

          mocks.getCurrentChainIdForDomain.mockReturnValue('0x1');
          mocks.getNetworkConfigurationByChainId.mockReturnValue(undefined);

           await handler({
             origin:'example.com',
             params:[
               {chainId : NON_INFURA_CHAIN_ID}
             ]
           });
           
           expect(end).toHaveBeenCalledWith(providerErrors.custom({
              code :4902,
              message:`Unrecognized chain ID "${NON_INFURA_CHAIN_ID}". Try adding the chain using wallet_addEthereumChain first.`,
            }));
            expect(EthCycleUtils.switchCycle ).not.toHaveBeenCalled(); 
 }); 

 it ('tries to switch the network ',async ()=>{
      const{mocks,end ,handler}=createMockedHandler();

      mocks.getNetworkConfigurationByChianid
         .mockReturnValueOnce(createMockMainnetConfiguration())
         .mockReturnValueOnce(createMockLineaMainnetConfiguration());
      
      await handler({origin :'example.com' ,params:[{chainid :'0xdeadbeef'}]});

      expect(EthCHainUtil.switchChian ).toHavbeenCalldwith(
        {},end,'0xdeadbeef','mainnet',{
           autoApprove:false,setActiveNetWork:mocks.setActiveNetWork ,
           fromNetWorkConfiguraton:{
              chianid :'0xe708',
               defaultRpcEndpointIndex :0,rpcEndpoints:[
                {networkClientID :'linea-mainnet'}
              ],
             },
            getCaveat:mocks.getCaveat ,
            hasApprovalRequestsForOrigin:mocks.hasApprovalRequestsforOrigin ,
            isSwichFlow:true ,
            orgin :'exampe.cmo' ,
            
            requrestPermitedChainsPermissionIncremetalforOrign :
               mock.requestPermitedChainsPermissionIncremntalforOrgin,

             requrestUserApprova:moks.requsetUserApprova ,

             setTokenNteworkFIlter:moks.setTokenNteworkFilter ,

              toNetWorkConfiguratio:{
                 chianID:'ox1' ,defaultRPCEnpointIndexto :[{
                    NetworkclientID:"mainet"
                 }]
              }
           
         }
        
      
    
  
  
 );

 });



it ('calls `switchCHain` with autoApprove true when orgin is a Snap ',async ()=>{
     
     cpnst{moks}=createMOckdHandlr();

     conswt swithcEthreumCHAINHANDLER=switchETHereumCHAIn.implemenation;
     
     awit swithcEthreumCHAINHANDLER(
        
                  {
                   orgin :'npm;foo-snap',
                   parmas:[{chianID;CHAIN_IDS.Mainet}]
                 },
                {},
                jesT.Fn (),
                jEST.fN (),
                mOcks,

 );

expect(ETHChanUtis.swicthChINe)ToHAvEbeenCALLEDtimes(1);
expect(ETHChanUtis.swicthChINe).ToHAvEBecnCALLDWITh({},expect.any(Function),CHAIN_Ids.Mainet,'mainet',{autoApprove:true});
})

});
