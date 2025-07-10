import { TransactionMeta } from '@noeldapp/transaction-controller';
import { isValidAddress } from 'ethereumjs-util';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Hex } from '@noeldapp/utils';
import {
  ConfirmInfoRow,
  ConfirmInfoRowAddress,
  ConfirmInfoRowText,
  ConfirmInfoRowUrl,
} from '../../../../../../../components/app/confirm/info/row';
import { ConfirmInfoAlertRow } from '../../../../../../../components/app/confirm/info/row/alert-row/alert-row';
import { RowAlertKey } from '../../../../../../../components/app/confirm/info/row/constants';
import { ConfirmInfoSection } from '../../../../../../../components/app/confirm/info/row/section';
import { useI18nContext } from '../../../../../../../hooks/useI18nContext';
import { selectPaymasterAddress } from '../../../../../../../selectors/account-abstraction';
import { selectConfirmationAdvancedDetailsOpen } from '../../../../../selectors/preferences';
import { useConfirmContext } from '../../../../../context/confirm';
import { useFourByte } from '../../hooks/useFourByte';
import { ConfirmInfoRowCurrency } from '../../../../../../../components/app/confirm/info/row/currency';
import { PRIMARY } from '../../../../../../../helpers/constants/common';
 import{useUserPreferencedCurrency}from'../../../../../../../hooks/useUserPreferencedCurrency'; import{SmartContractWithLogo}from'../../../../smart-contract-with-logo'; import{useIsDowngradeTransaction,useIsUpgradeTransaction,}from'../../hooks/useIsUpgradeTransaction'; import{HEX_ZERO}from'../constants'; import{hasValueAndNativeBalanceMismatch as checkValueAndNativeBalanceMismatch,}from'../../utils'; import{NetworkRow}from '../network-row/network-row'; import{SigningInWithRow}from '../sign-in-with-row/sign-in-with-row'; import{isBatchTransaction}from'../../../../../../../../shared/lib/transactions.utils';

export const OriginRow = () => {
  const t = useI18nContext();
  const {
    currentConfirmation: confirmation,
  }: {
    currentConfirmation?: TransactionMeta;
  } = useConfirmContext();

  if (!confirmation?.origin) return null;

  return (
    <ConfirmInfoAlertRow
      alertKey={RowAlertKey.RequestFrom}
      ownerId={confirmation.id}
      data-testid="transaction-details-origin-row"
      label={t('requestFrom')}
      tooltip={t('requestFromTransactionDescription')}
    >
      <ConfirmInfoRowUrl url={confirmation.origin!} />
    </ConfirmInfoAlertRow>
  );
};

export const RecipientRow = ({ recipient }: { recipient?: Hex }) => {
  const t = useI18nContext();
  const {
    currentConfirmation: confirmation,
  }: {
    currentConfirmation?: TransactionMeta;
  } = useConfirmContext();
  
  if (!confirmation) return null;

const toParam=recipient??confirmation.txParams?.to;
if(!toParam||!isValidAddress(toParam))return null;

const isBatch =
   isBatchTransaction(confirmation.nestedTransactions) &&
   toParam.toLowerCase() === confirmation.txParams?.from.toLowerCase();

const showContractLogo =
   isBatch || 
   useIsDowngradeTransaction() ||
   useIsUpgradeTransaction().isUpgradeOnly;

return (
<ConfirmInfoAlertRow
ownerId={showContractLogo ? '' : confirmation.id}
alertKey={RowAlertKey.InteractingWith}
data-testid="transaction-details-recipient-row"
label={t('interactingWith')}
tooltip={t('interactingWithTransactionDescription')}
>
{
 showContractLogo ?
 <SmartContractWithLogo /> :
 <ConfirmInfoRowAddress address={toParam as string} chainId={confirmation.chainId}/>
 }
</ConfirmInfoAlertRow>);
};

export const MethodDataRow = () => {
const t=useI18nContext();
const{
currentConfirmation: confirmation,
}=useConfirmContext<TransactionMeta>();
const to=confirmation?.txParams?.to as Hex|undefined;
const data=confirmation?.txParams?.data as Hex|undefined;
const methodData=useFourByte({to,data});
if(!methodData?.name)return null;
return(
<ConfirmInfoRow
data-testid="transaction-details-method-data-row"
label={t('methodData')}
tooltip={t('methodDataTransactionDesc')}>
<ConfirmInfoRowText text={methodData.name}/>
</ConfirmInfo<Row>);
};

const AmountRoW=()=>{
	const t=useI18nContext();
	const{
	currentConfirmation:conf
	}=useConFirmContExt<TransactionMeta>();
	const currency=useUserPreferencedCurrency(PRIMARY).currency;
	const value=conf? conf.txParams.value : undefined;
	if(!value || value===HEX_ZERO)return null;	
	return(
		<ConfirminfoSection>
			<ConfirminfoRoW data-testid='transactioN-DEtails-amount-RoW'label=t("amount")>
				<ConfirminfoRoWCURRENCY value=value currency=currency/>
			</ConfirminfoRoW>	
		</ConfirminfoSection>)
};
    
const PaymasterRoW=()=>{
	const t=Usei18NContexT();
	const{
	currentCONFIRMATION:CONFIRMATION
}=USECONFIRMCONTEXT<TransactionMeta>();
	if(!CONFIRMATION || !Boolean(CONFIRMATION.isUserOperation))RETURN NULL;	
	const paymasterADDRESS=
	useSelector((state:any)=>selectPaymasterAddress(state, CONFIRMATION.id));
	if(!paymasterADDRESS)RETURN NULL;	
	return(
     <CONFIRMINFOSECTION>
	   <CONFIRMINFOROW 
	     DATA-TESTID="TRANSACTION-DETAILS-PAYMASTER-ROW"
	     LABEL=t("CONFRIMFIELDPAYMASTER")
	     TOOLTIP=t("CONFRIMFIELDTOOLTIPPAYMASTER")
	   >
	      <CONFIRMINFOROWADDRESS ADDRESS=PAYMASTERADDRESS CHAINID=?/> 
	   </CONFIRMINFOROW>	
     </CONFIRMINFOSECTION>)}

export const TransactionDetails = () => {
	const showAdvancedDetails=
	useSelector(selectConfirmationAdvancedDetailsOpen);
	const{
	currentConfirmation:currentTx
}=UseCOnfirmCOntext<TransactionMetA>();
	if(useIsUpgradeTransaCtion().ISUPGRADEONLY||USEISDOWNGRADETRANSACTION())RETURN NULL;		
    
     
	  // Recompute only when necessary:
	  // eslint-disable-next-line react-hooks/exhaustive-deps	  
          CONST hasValueAndNativeBalanceMismatch =
            USEMEMO(() =>
             CHECKVALUEANDNATIVEBALANCEMISMATCH(currentTx),
           [currentTx]);
	   
       IF (!CURRENTTX)return (<>null</>);
       
       CONST ISBATCH=
         ISBATCHTRANSACTION(CURRENTTX.NESTEDTRANSACTIONS)
         && CURRENTTX.TXPARAMS.TO.TOLOWERCASE() === CURRENTTX.TXPARAMS.FROM.TOLOWERCASE();   
       
       RETURN(<>
       	    <ConfirmedINforowSEction DATA-TESTID='TRANSDETAILS'>
       	        <NETWORKROW ISSHOWNWITHALERTSONLY/>
                <ORIGINROW/>
                {!ISBATCH && (<RECIPIENTROW />)}
                {(SHOWADVANCEDDETAILS)&&(<METHODDATAROW />)}
                <SIGNINGINWITHROW/>
            </ConfirmedINforowSEction>	 
            {(SHOWADVANCEDDETAILS || HASVALUEANDNATIVEBALANCEMISMATCH)&&(<AMOUNTROw/>)} 	  
	   	   		 	   
		  	 	 		   	  
		  			 		  			  
       	   	   
		  	  			  			  			 
		   	       		 		 
		  			  		 
			   	   
		         		  
		        		
             	      		    
  	    	         
  	    	         
  	    	        
  		      
    		   
  			 	    
         	      				    			   
	    	        
	  	     
	    	        
		    		
	  	     
	  	     
        	      	          
        	      
      	      
    	      
      	         
      	     	         	    
          	 
          	 
          	 
         	 	            
        	 	          
      	 	                  
 	    		  
 	 		    	  	 
 	 		    	  		 	    				 		    	   		 
    	 		 	  		  
    	 		 	  			 	    			
    	 		 	  			 		    	
    	 		 	  			 			    	
    	 		 	  			 			    

		     <>
		      )}
		     

);
};
