import React from 'react'
import styled, { keyframes } from 'styled-components'

const Spinner = () => (
  <SpinnerAnimation />
)

const rotation = keyframes`
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
  `

const SpinnerAnimation = styled.div`
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${rotation} 2s linear infinite;
`

export default Spinner


