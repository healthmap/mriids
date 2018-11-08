import styled from 'styled-components'

export const ZoomButtons = styled.div`
  position: absolute;
  right: 10px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  box-shadow: 1px 1px 6px 0px rgba(0,0,0,0.10);
  border-radius: .5rem;
  background-color: #fff;
  overflow: hidden;
`

export const ZoomButton = styled.button`
  display: block;
  padding: .8em;
  color: #000;
  font-size: 16px;
  line-height: .8;
  text-decoration: none;
  text-align: center;
  background-color: #fff;
  border: 0;
  cursor: pointer;
  user-select: none;
  outline: none;
  &:focus {
    text-decoration: none;
    outline: 0;
  }
  &:active {
    background-image: none;
    outline: 0;
    user-select: none;
  }
  &:last-child {
    border-top: 1px solid #ececec;
  }
`
