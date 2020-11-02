import styled from 'styled-components'

const ChartContainer = styled.div`
  flex: none;
  padding-left: ${(props) => props.theme.sidebarWidth};  
  height: 28rem; /* $risk-height */
  overflow: hidden;
`

export default ChartContainer;
