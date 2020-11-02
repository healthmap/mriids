import styled from 'styled-components'

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex: none;
  width: 100%;
  height: ${(props) => props.theme.headerHeight}; 
  box-shadow: 0 10px 12px -8px rgba(0,0,0,0.10); /* $box-shadow--bottom */
  z-index: 3; 
  > div {
    display: flex;
  }
`

export default Header
