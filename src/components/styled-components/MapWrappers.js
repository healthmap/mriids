import styled from "styled-components";

export const MapOuterWrapper = styled.div`
  position: relative;
  margin-left: ${props => props.theme.sidebarWidth};
  width: calc(100vw - ${props => props.theme.sidebarWidth});
  height: calc(100vh - ${props => props.theme.headerHeight});
  z-index: 1;
  overflow: hidden;
  &.has-chart {
    height: calc(
      100vh - ${props => props.theme.riskHeight} -
        ${props => props.theme.headerHeight}
    );
  }
`;

export const MapInnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  .map {
    width: 100%;
    height: 100%;
  }
`;

export const MapLegendWrapper = styled.div`
  position: absolute;
  width: 9rem;
  left: 2rem;
  bottom: 7rem;
  > div {
    width: 100%;
    height: 100%;
  }
`;

export const MapLegendWrapperSnapshot = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  bottom: 7rem;
  width: 9rem;
  overflow: hidden;
  > div {
    width: 100%;
    height: 100%;
  }
`;

export const MapLegendItemsWrapper = styled.div`
  height: calc(100% - 7rem);
  overflow: auto;
`;

export const MapFiltersWrapper = styled.div`
  position: absolute;
  left: 12rem;
  bottom: 7rem;
  h3 {
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  label {
    display: block;
    margin: 0.3em 0;
    color: #666;
  }
`;
