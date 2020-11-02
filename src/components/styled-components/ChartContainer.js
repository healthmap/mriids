import styled from 'styled-components'

const ChartContainer = styled.div`
  flex: none;
  padding-left: ${(props) => props.theme.sidebarWidth};  
  height: ${(props) => props.theme.riskHeight}; 
  overflow: hidden;
`

export default ChartContainer;
