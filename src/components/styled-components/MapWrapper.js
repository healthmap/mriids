import styled from 'styled-components'

const MapWrapper = styled.div`
  position: relative;
  margin-left: 18rem; /* $sidebar-width; */
  width: calc(100vw - 18rem); /* calc(100vw - #{$sidebar-width}); */
  height: calc(100vh - 25rem - 4.5rem); /* calc(100vh - #{$risk-height} - #{$header-height}); */
  z-index: 1;
  overflow: hidden;
`

export default MapWrapper;
