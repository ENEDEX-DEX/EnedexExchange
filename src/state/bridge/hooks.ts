import { Currency, CurrencyAmount, BASE_CURRENCY,  Percent, Token, ChainId } from '@dctdao/sdk'
import { AppDispatch, AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { useCallback } from 'react'
import { typeInput, typeInputPer, setRecipient, setCurrencyId } from './actions'
import { tryParseAmount } from '../swap/hooks'
import { useTranslation } from 'react-i18next'
import { isAddress } from '../../utils'
import { useCurrency } from '../../hooks/Tokens'
import useENS from '../../hooks/useENS'
import {RESOURCE_ID, BRIDGE_CHAINIDS} from '../../constants/index' 
import { wrappedCurrency } from '../../utils/wrappedCurrency'



export function useBridgeState(): AppState['bridge'] {
    return useSelector<AppState, AppState['bridge']>(state => state.bridge)
}

export function useDerivedBridgeInfo(
    currencyA: Currency | undefined
): {
    currencyBalance ?: CurrencyAmount
    parsedAmount ?: CurrencyAmount
    parsePerAmount : Percent
    inputError ?: string
    sourceDestiChainId ?: ChainId[]
    max3DecimalsError : boolean
    tokenAddress?: string
}
{ 
    let max3DecimalsError = false
    const { t } = useTranslation()
    const { account, chainId } = useActiveWeb3React()
    if(!chainId) throw new Error("No chain Id")

    let sourceDestiChainId
    switch(chainId) {
      case ChainId.ROPSTEN:
        sourceDestiChainId = [ChainId.ROPSTEN, ChainId.AVAX_TEST]
        break
      
      case ChainId.AVAX_TEST:
        sourceDestiChainId = [ChainId.AVAX_TEST, ChainId.ROPSTEN]
        break
        
      case ChainId.MAINNET:
        sourceDestiChainId = [ChainId.MAINNET, ChainId.AVAX]
        break
      case ChainId.AVAX:
        sourceDestiChainId = [ChainId.AVAX, ChainId.MAINNET]
        break
        
    }

    

    const { typedValue, typedPer, currencyId, recipient } = useBridgeState()
    
    const currencyBalance  = useCurrencyBalances(account ?? undefined , [currencyA])[0]
    
    const currency = useCurrency(chainId, currencyId)
    const parsedAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencyA)

    const parsePerAmount = new Percent(typedPer, '100')

    

    let inputError: string | undefined
    if (!account) {
        inputError = t('connectWallet')
    }
    
    if (!parsedAmount || !currency) {
      inputError = inputError ?? t('enterAnAmount')
    }else {
      let dec = (currency?.decimals - 3);
      let a = parsedAmount.raw.toString()
      a = a.substr(a.length - dec)
    if(a !== '0'.repeat(dec)){
        max3DecimalsError=true
        inputError = inputError ?? 'Too many decimals' 
      }
    }
    let tokenAddress
    if (!currency) {
      inputError = inputError ?? t('selectAToken')
    } else {
      tokenAddress = wrappedCurrency(currency, chainId)?.address ?? ''
    }
    

    const recipientLookup = useENS(recipient ?? undefined)
    const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null
  
    const formattedTo = isAddress(to)
    if (!to || !formattedTo) {
      inputError = inputError ?? t('enterARecipient')
    } else {
      /**  TODO: FUture check if address is not token address
      if (
        (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
        (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
      ) {
        inputError = inputError ?? t('invalidRecipt')
      }
      */
    }

    if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
      inputError = 'Insufficient ' + currency?.symbol + ' balance'
    }
  
    if(currency && currency === BASE_CURRENCY[currency.chainId]){
      inputError = 'Native currency not supported yet'
    }

    if(!sourceDestiChainId || 
      BRIDGE_CHAINIDS[sourceDestiChainId[0]] === undefined ||
      BRIDGE_CHAINIDS[sourceDestiChainId[1]] === undefined ){
        inputError = 'No Bridge for these chains'
      }
      
      
    if(currency && sourceDestiChainId){
      const chain_resources = sourceDestiChainId && RESOURCE_ID[sourceDestiChainId[0]]
      
      if(!chain_resources){
        inputError='No supported tokens for Source chain'
      } else if (tokenAddress && (chain_resources[tokenAddress] === undefined)){
        inputError = 'Not supported token'
      }
    }
    
    

    return { currencyBalance, parsedAmount, parsePerAmount, sourceDestiChainId, inputError, max3DecimalsError, tokenAddress}

}


export function useBridgeActionHandlers(
  ): {
    onFieldInput: (typedValue: string) => void,
    onPerInput: (typedPer: string) => void,
    onSetRecipient: (recipient: string | null) => void,
    onSetcurrencyId: (currencyId: Currency) => void,
  } {
    const dispatch = useDispatch<AppDispatch>()
  
    const onFieldInput = useCallback(
      (typedValue: string) => {
        dispatch(typeInput({ typedValue }))
      },
      [dispatch]
    )  
    const onPerInput = 
    useCallback(
      (typedPer: string) => {
        dispatch(typeInputPer({ typedPer }))
      },
      [dispatch]
    )  
    const onSetRecipient = 
    useCallback(
      (recipient: string | null) => {
        dispatch(setRecipient({ recipient }))
      },
      [dispatch]
    )
    const onSetcurrencyId = 
    useCallback(
      (currency: Currency) => {
        dispatch(setCurrencyId({ 
          currencyId: currency instanceof Token ? currency.address : currency === BASE_CURRENCY[currency.chainId] ? currency.symbol : ''
        }))
      },
      [dispatch]
    )
    return {
      onFieldInput,
      onPerInput,
      onSetRecipient,
      onSetcurrencyId
    }
}