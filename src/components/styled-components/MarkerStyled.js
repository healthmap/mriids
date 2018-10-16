import styled from 'styled-components'
import { Marker } from 'react-map-gl';

const MarkerStyled = styled(Marker)`
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
`

export default MarkerStyled