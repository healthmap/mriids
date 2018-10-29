import React, { Component } from 'react';

import ProjectionToggleWrapper from '../components/styled-components/ProjectionToggleWrapper';
import OnOffSwitch from '../components/styled-components/OnOffSwitch';

class ProjectionToggle extends Component {
   render() {
      return (
        <ProjectionToggleWrapper>
          Projection
          <OnOffSwitch>
            <input type="checkbox" name="projection" id="projection-switch" />
            <label for="projection-switch">
              <span class="onoffswitch-inner"></span>
              <span class="onoffswitch-switch"></span>
            </label>
          </OnOffSwitch>
        </ProjectionToggleWrapper>
      );
   }
}

export default ProjectionToggle;
