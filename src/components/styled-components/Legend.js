import styled from 'styled-components'
import { media } from '../../assets/style-utils'

export const LegendWrapper = styled.div`
  margin-bottom: 10px;
  width: 100px;
`

export const LegendInfo = styled.div`
  width: 55px;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
  height: 100%;
  background-color: rgba(0,0,0,0.25);
`
export const LegendLevel = styled.div`
  margin-bottom: 1px;
  min-height: 14px;
  height: 2.5vh;
  ${media.handheld`
    height: 20px;
  `}
`

export const LegendText = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  font-weight: 500;
  color: #FFF;
  padding-right: 5px;
  height: 100%;
`