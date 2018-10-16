import styled from 'styled-components'

const Button = styled.button`
  font-size: 14px;
  color: #000;
  background: #FAFAFB;
  border-color: #C4C6CB;
  border-radius: 4px;
  outline: none;
  &[disabled]{
    color: #828282;
    background: #ECECEF;
    border-color: #C4C6CB;
  }
  &:first-child {
    margin-bottom: 2px;
  }
`

export default Button;