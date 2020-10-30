import React, { Component } from "react";
import * as Styled from "../components/styled-components/Team";
import TeamMember from "../components/TeamMember";
class Team extends Component {
  render() {
    return (
      <div>
        <Styled.Title>Team</Styled.Title>
        <Styled.LogoWrapper>
          <img src="/images/logos/imperial.png" height="32px" />
          <img src="/images/logos/sussex.svg" height="48px" />
          <img src="/images/logos/healthmap.svg" height="26px" />
          <img src="/images/logos/promed.svg" height="32px" />
          <img src="/images/logos/healthsites.png" height="48px" />
        </Styled.LogoWrapper>
        <TeamMember content="sangeeta" />
        <TeamMember content="anne" />
        <TeamMember content="pierre" />
        <TeamMember content="emily" />
        <TeamMember content="kara" />
        <TeamMember content="john" />
        <TeamMember content="clark" />
        <TeamMember content="jared" />
        <TeamMember content="moritz" />
        <TeamMember content="britta" />
        <TeamMember content="angel" />
        <TeamMember content="lawrence" />
        <TeamMember content="johnr" />
        <TeamMember content="mark" />
      </div>
    );
  }
}

export default Team;
