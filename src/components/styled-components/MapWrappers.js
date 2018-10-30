import styled from 'styled-components'

export const MapOuterWrapper = styled.div`
  position: relative;
  margin-left: 18rem; /* $sidebar-width; */
  width: calc(100vw - 18rem); /* calc(100vw - #{$sidebar-width}); */
  height: calc(100vh - 25rem - 4.5rem); /* calc(100vh - #{$risk-height} - #{$header-height}); */
  z-index: 1;
  overflow: hidden;
`

export const MapInnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  .map {
    width: 100%;
    height: 100%;
  }
`

export const MapLegendWrapper = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 7rem;
`

export const MapFiltersWrapper = styled.div`
  position: absolute;
  left: 12rem;
  bottom: 7rem;
`
