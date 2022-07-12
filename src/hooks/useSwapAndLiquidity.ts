import { useActiveWeb3React } from '../hooks'
import { useMemo } from 'react'
import {ChainId} from '@dctdao/sdk'





export function useSwapAndLiquidity() : boolean{
    const { chainId, library } = useActiveWeb3React()

    return useMemo(()=>{
        switch(chainId){
            case ChainId.AVAX_TEST:
            case ChainId.AVAX:
                return true
            default:
                return false
        }
    },[chainId,library])
}



