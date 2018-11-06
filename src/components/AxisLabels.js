import React from 'react';
import {AxisXTitle, AxisYTitle} from '../components/styled-components/AxisTitles'
import AxisLabelsWrapper from '../components/styled-components/AxisLabelsWrapper'
import {OverlayTrigger} from 'react-bootstrap'

const AxisLabels = (props) => {
    const {children, xAxis, yAxis, renderTooltip, position} = props
    return (
      <AxisLabelsWrapper>
        {children}
        <OverlayTrigger placement="top" overlay={renderTooltip ? renderTooltip(`Mouseover placeholder ${xAxis}`) : ''}>
          <AxisXTitle>{xAxis}</AxisXTitle>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={renderTooltip ? renderTooltip(`Mouseover placeholder ${yAxis}`) : ''}>
          <AxisYTitle position={position}>{yAxis}</AxisYTitle>
        </OverlayTrigger>
      </AxisLabelsWrapper>
    )
  }

  export default AxisLabels;
