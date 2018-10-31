import styled from 'styled-components'

export const Button = styled.button`
  position: relative;
  padding: .2em 1.5em;
  color: #000;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  outline: none;
  &:focus,
  &.focus {
    text-decoration: none;
    outline: 0;
  }
  &:active,
  &.is-active {
    color: #fff;
    background-color: #000;
    background-image: none;
    outline: 0;
    user-select: none;
  }
  &:disabled {
    cursor: auto;
    opacity: .65;
  }
`

export const ButtonIcon = styled.button`
  position: relative;
  padding: 0 .5em;
  text-decoration: none;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  outline: none;
  &:focus,
  &.focus {
    text-decoration: none;
    outline: 0;
  }
  &:active,
  &.is-active {
    background-color: #ececec;
    background-image: none;
    outline: 0;
    user-select: none;
  }
  &:disabled {
    cursor: auto;
    opacity: .65;
  }
`

export const ButtonLink = styled.button`
  position: relative;
  padding: .2em 1em;
  color: #000;
  text-decoration: none;
  background-color: #fff;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  outline: none;
  &:focus,
  &.focus {
    text-decoration: none;
    outline: 0;
  }
  &:active,
  &.is-active {
    background-color: #ececec;
    background-image: none;
    outline: 0;
    user-select: none;
  }
  &:disabled {
    cursor: auto;
    opacity: .65;
  }
`
