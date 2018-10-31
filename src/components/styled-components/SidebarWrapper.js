import styled from 'styled-components'

const SidebarWrapper = styled.div`
  position: absolute;
  top: 4.5rem; /* $header-height make variable */
  left: 0;
  bottom: 0;
  width: 18rem; /* $sidebar-width make variable */
  background-color: #efefef; /* $lightest-gray make variable */
  overflow: auto;
  z-index: 2; /* $z-index--sidebar make variable */
  h4 {
    padding-top: 1em;
    border-top: 1px solid #666;
  }
`

export default SidebarWrapper;
