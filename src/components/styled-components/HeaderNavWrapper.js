import styled from "styled-components";

const HeaderNavWrapper = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    a {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0 2rem;
      font-weight: bold;
      font-size: 1.2rem;
      text-transform: uppercase;
      text-decoration: none;
      &.is-active {
        background-color: #d4d4d4;
      }
    }
  }
`;

export default HeaderNavWrapper;
