import { createReducer } from '@reduxjs/toolkit'
import { resetBridgeState, typeInput, typeInputPer, setRecipient, setCurrencyId,
  setFee, setPaused } from './actions'

export interface BridgeState {
    readonly typedValue: string,
    readonly typedPer: string,
    readonly recipient: string | null,
    readonly currencyId: string | undefined,
    readonly feeBridge: string | undefined,
    readonly pausedBridge: boolean
}


const initialState: BridgeState = {
    typedValue: '',
    typedPer: '',
    recipient: null,
    currencyId: undefined,
    feeBridge: undefined,
    pausedBridge: false
}

export default createReducer<BridgeState>(initialState, builder =>
    builder
      .addCase(resetBridgeState, () => initialState)
      .addCase(typeInput, (state, { payload: { typedValue } }) => {
        return { 
          ...state,
          typedValue,
           }
        })
      .addCase(typeInputPer, (state, { payload: { typedPer } }) => {
        return { 
          ...state,
          typedPer,
            }
        })
      .addCase(setRecipient, (state, { payload: { recipient } }) => {
        return { 
          ...state,
          recipient,
            }
        })
      .addCase(setCurrencyId, (state, { payload: { currencyId } }) => {
        return { 
          ...state,
          currencyId
          }
        })
      .addCase(setFee, (state, { payload: { feeBridge } }) => {
        return { 
          ...state,
          feeBridge
          }
        })
      .addCase(setPaused, (state, {payload: { pausedBridge } }) => {
        return { 
          ...state,
          pausedBridge
        }
      })
      
)
  