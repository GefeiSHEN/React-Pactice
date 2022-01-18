import React from "react";
import "./App.css";
import Course from "./Course";

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (!this.props.cartMode) {
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <Course
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
          <Course
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
    return <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>;
  }
}

export default CourseArea;
