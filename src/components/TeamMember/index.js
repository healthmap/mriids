import React, { Component } from "react";
import TeamMemberContent from "./TeamMemberContent";
import * as Styled from "./styles.js";

class TeamMember extends Component {
  render() {
    let teamMemberDisplay = TeamMemberContent[this.props.content];

    const paragraphs = teamMemberDisplay.body.map((paragraph, i) => (
      <Styled.Body key={i}>{paragraph}</Styled.Body>
    ));

    return (
      <Styled.TeamMemberContentWrapper>
        {teamMemberDisplay.image && (
          <Styled.Image src={teamMemberDisplay.image} />
        )}
	    <Styled.TeamMemberTextWrapper>
        {teamMemberDisplay.name && (
          <Styled.Title>{teamMemberDisplay.name}</Styled.Title>
        )}
        {teamMemberDisplay.org && (
          <Styled.SubTitle>{teamMemberDisplay.org}</Styled.SubTitle>
        )}
        {teamMemberDisplay.body && <div>{paragraphs}</div>}
	    </Styled.TeamMemberTextWrapper>
      </Styled.TeamMemberContentWrapper>
    );
  }
}

export default TeamMember;
