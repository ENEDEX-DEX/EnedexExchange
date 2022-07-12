import { useBlockNumber } from '../application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { getBridgeContract } from '../../utils'
import {useEffect} from 'react';
import { BigNumber } from '@ethersproject/bignumber'
import { useDispatch } from 'react-redux'
import { AppDispatch} from '../index'
import { setFee, setPaused  } from './actions'
import { ethers } from "ethers";



export default function Updater(): null {

    const { chainId,library, account } = useActiveWeb3React()
    
    const latestBlockNumber = useBlockNumber()

    const dispatch = useDispatch<AppDispatch>()

    
      


    
    useEffect(() => {
        if (!chainId || !library || !account) return 
        const bridge = getBridgeContract(chainId, library, account)
        bridge._fee().then((fee:BigNumber) => {
            const feeBridge = ethers.utils.formatEther(fee)
            dispatch(setFee({feeBridge}))
        })
        bridge.paused().then((pausedBridge:boolean) => {
            //const until = parseInt(process.env.REACT_APP_MAINTANENCE_DEADLINE ?? '0')
            dispatch(setPaused({pausedBridge}))
        })
    
    },[chainId, dispatch, latestBlockNumber])
    

    return null;
}