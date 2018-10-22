import styled from 'styled-components'

export const AxisXTitle = styled.span`
  font-size: 12px;
  position: absolute;
  bottom: 3px;
`

export const AxisYTitle = styled.span`
  font-size: 12px;
  position: absolute;
  top: 50%;
  ${props => props.position === 'left' ? `
  left: -20px;
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  ` : `
  right: -20px;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  `}
  
`
