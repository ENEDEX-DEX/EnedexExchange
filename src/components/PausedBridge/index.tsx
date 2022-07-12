import React  from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import {  Spinner } from '../../theme/components'
import { AutoColumn, ColumnCenter } from '../Column'
import Circle from '../../assets/images/blue-loader.svg'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`



const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const CustomLightSpinner = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`
export function PausedBridgeContent() {
	return (
	  <Wrapper>
	    <Section>
	      <ConfirmedIcon>
          	<CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
              </ConfirmedIcon>
	      <AutoColumn gap="12px" justify={'center'}>
		<Text fontWeight={500} fontSize={20}>
		  Bridge is under maintenance.
		</Text>
		<Text fontSize={12} color="#565A69" textAlign="center">
		 It will take a few hours. 
		</Text>
	      </AutoColumn>
	    </Section>
	  </Wrapper>
	)
      }
