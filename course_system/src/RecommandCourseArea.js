import React from "react";
import { Accordion } from "react-bootstrap";
import "./App.css";
import RecommandCourse from "./RecommandCourse";

class RecommandCourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (!this.props.cartMode) {
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <RecommandCourse
            key={"course_" + i}
            data={this.props.data[i]}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
          />
        );
      }
    } else {
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <RecommandCourse
            key={"cartItem_" + this.props.data[i].number}
            data={this.props.data[i]}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
          />
        );
      }
    }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    return (
      <Accordion style={{ width: "80%", margin: 5, marginTop: -5 } }>
        <Accordion.Header>
          Since you've taken: PSYCH 202
        </Accordion.Header>
        <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>
      </Accordion>
      
    );
  }
}

export default RecommandCourseArea;
