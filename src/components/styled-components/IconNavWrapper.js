import styled from 'styled-components'

const IconNavWrapper = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 1em;
  & + ul {
    border-left: 1px solid #ccc;
  }
  li {
    display: flex;
    align-items: center;
    margin: 0 .25em;
    padding: .5em;
    border-radius: 50%;
    &:hover {
      background-color: #ececec;
    }
  }
`

export default IconNavWrapper
