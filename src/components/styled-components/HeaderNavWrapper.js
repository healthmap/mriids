import styled from 'styled-components'

const HeaderNavWrapper = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    align-items: center;
    margin: 0;
    a, a:visited, a:hover, a:focus, a:active {
      display: inline-block;
      padding: 0 2rem;
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: none;
    }
    &.is-active {
      background-color: #d4d4d4; /* $light-gray */
    }
  }
`

export default HeaderNavWrapper
