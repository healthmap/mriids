import { css } from 'styled-components'

export const media = {
  handheld: (...args) => css`
    @media (max-width: 580px) {
      ${ css(...args) }
    }
  `,
  smallScreen: (...args) => css`
    @media (max-width: 1024px) {
      ${ css(...args) }
    }
  `
}