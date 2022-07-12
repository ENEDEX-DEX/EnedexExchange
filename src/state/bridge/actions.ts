import { createAction } from '@reduxjs/toolkit'

export const typeInput = createAction<{ typedValue: string; }>('bridge/typeInputBridge')
export const typeInputPer = createAction<{ typedPer: string; }>('bridge/typePerBridge')
export const resetBridgeState = createAction<void>('bridge/resetBridgeState')
export const setRecipient =  createAction<{ recipient: string | null; }>('bridge/recipientBridge')
export const setCurrencyId = createAction<{ currencyId: string | undefined; }>('bridge/currencyIdBridge')
export const setFee = createAction<{ feeBridge: string ; }>('bridge/feeBridge')
export const setPaused = createAction<{ pausedBridge: boolean; }>('bridge/pausedBridge')


