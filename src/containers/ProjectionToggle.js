import React, { Component } from 'react';

import ProjectionToggleWrapper from '../components/styled-components/ProjectionToggleWrapper';
import OnOffSwitch from '../components/styled-components/OnOffSwitch';

class ProjectionToggle extends Component {
   render() {
      return (
        <ProjectionToggleWrapper className={this.props.status ? 'is-active' : ''}>
          Projection
          <OnOffSwitch>
            <input onChange={this.props.toggleProjectionChange} type="checkbox" name="projection" id="projection-switch" />
            <label htmlFor="projection-switch">
              <span className="onoffswitch-inner"></span>
              <span className="onoffswitch-switch"></span>
            </label>
          </OnOffSwitch>
        </ProjectionToggleWrapper>
      );
   }
}

export default ProjectionToggle;
