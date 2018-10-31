import styled from 'styled-components'

export const SelectOutbreakWrapper = styled.div`
  select {
    color: #fff;
    background-color: #e43b46;
  }
  option {
    color: #fff;
    background-color: #e43b46;
  }
`

export const SelectSearchWrapper = styled.div`
  select {
    color: #fff;
    background-color: #000;
  }
  option {
    color: #fff;
    background-color: #000;
  }
`

export const SelectInput = styled.select`
  display: block;
  width: 100%;
  padding: 1.5rem;
  font-size: 1.4em;
  font-weight: bold;
  line-height: 1.3;
  border: 0;
  /* reset browser specific styling */
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNjEycHgiIGhlaWdodD0iNzkycHgiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjx0aXRsZT5hcnJvd3M8L3RpdGxlPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIyMS42NTIsMzY5Ljg2NGw4NC43NDUtMTE4LjAwOGw4My45NTEsMTE4LjAwOEgyMjEuNjUyeiBNMzkwLjM0OCw0MjIuMTM2bC04My45NTEsMTE4LjAwOGwtODQuNzQ1LTExOC4wMDgNCglIMzkwLjM0OHoiLz4NCjwvc3ZnPg0K');
  background-position: right 0px center;
  background-repeat: no-repeat;
  background-size: auto 80%;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 1px 1px 6px 0px rgba(39,124,218,0.20);
  }
`
