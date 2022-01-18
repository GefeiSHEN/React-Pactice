import React from "react";
import "./App.css";
import CompletedCourse from "./CompletedCourse";

class CompletedArea extends React.Component {
    
  getCourses() {
    let courses = [];

      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <CompletedCourse
            key={this.props.data[i].number}
            data={this.props.data[i]}
            courseKey={this.props.data[i]}
            setRating={this.props.setRating}
          />
        );
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

export default CompletedArea;
