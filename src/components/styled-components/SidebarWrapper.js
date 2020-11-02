import styled from 'styled-components'

const SidebarWrapper = styled.div`
  position: absolute;
  top: ${(props) => props.theme.headerHeight};  
  left: 0;
  bottom: 0;
  width: ${(props) => props.theme.sidebarWidth};  
  background-color: ${(props) => props.theme.lightestGray};  
  overflow: auto;
  z-index: 2; /* $z-index--sidebar make variable */
  h4 {
    padding-top: 1em;
  }
`

export default SidebarWrapper;
