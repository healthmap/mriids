import styled from 'styled-components'
import { media } from '../../assets/style-utils'

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 50vh;
  padding: 0px;
  overflow: auto;
  ${media.handheld`
    flex-wrap: wrap;
    height: 100%;
  `}
`

export default ChartContainer;