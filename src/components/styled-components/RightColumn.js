import styled from 'styled-components'
import { media } from '../../assets/style-utils'

const RightColumn = styled.div`
  display: flex;
  margin: 0px;
  flex-direction: column;
  background-color: #FAFAFB;
  padding: 16px;
  padding-bottom: 0px;
  box-shadow: inset 5px 0px 20px 0px #ececec;
  ${media.smallScreen`
    min-width: 75vw;
  `}
  ${media.handheld`
    min-width: 100%;
    flex-basis: 100%;
  `}
`

export default RightColumn;