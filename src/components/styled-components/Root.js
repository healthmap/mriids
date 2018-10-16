import styled from 'styled-components';
import { media } from '../../assets/style-utils'

const Root = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  height: 100vh;
  ${media.handheld`
    flex-wrap: wrap;
  `}
`

export default Root;