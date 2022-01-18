import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import "./App.css";

class Subsection extends React.Component {
  render() {
    return (
      <Accordion.Item
        key={this.props.subsectionKey}
        eventKey={this.props.subsectionKey}
      >
        <Accordion.Header
          variant="link"
          style={{ height: 63, display: "flex", alignItems: "center" }}
        >
          {this.props.subsectionKey}
          {this.getSubsectionButton(this.props.sectionKey, this.props.data)}
        </Accordion.Header>
        <Accordion.Body>{JSON.stringify(this.props.data.time)}</Accordion.Body>
      </Accordion.Item>
    );
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = "dark";
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = "Add Subsection";

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        if (
          this.props.cartCourses[this.props.courseKey][section].some(
            (_subsection) => _subsection.number === subsection.number
          )
        ) {
          buttonVariant = "outline-dark";
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = "Remove Subsection";
        }
      }
    }

    return (
      <Button
        as="a"
        variant={buttonVariant}
        onClick={buttonOnClick}
        style={{ position: "absolute", right: 50 }}
      >
        {buttonText}
      </Button>
    );
  }

  addSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.addCartCourse({
      course: this.props.courseKey,
      section: section,
      subsection: subsection,
    });
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse({
      course: this.props.courseKey,
      section: section,
      subsection: subsection,
    });
  }
}

export default Subsection;
