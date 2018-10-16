import styled from 'styled-components'
import {Button} from 'react-bootstrap'

const ModalButton = styled(Button)`
  text-align: left;
  align-items: center;
  align-content: center;
  height: 40px;
  font-size: 14px;
  &.active {
    font-weight: 500;
  }
  &:focus, &:active:focus {
    outline: none;
  }
  ${props => props.secondary ? `
  color: #53ABA4;
  background: #FFF;
  border-color: #53ABA4;
  &.active,
  &:hover,
  &:active:hover,
  &.active:hover {
    color: #479892;
    background: #FFF;
    border-color: #479892;
    box-shadow: none;
  }`
  : `
  color: #FFF;
  background: #53ABA4;
  border-color: #53ABA4;
  &.active,
  &:hover,
  &:active:hover,
  &.active:hover {
    color: #FFF;
    background: #479892;
    border-color: #479892;
    box-shadow: none;
  };`
  }
`

export default ModalButton;