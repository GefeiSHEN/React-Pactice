import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import CompletedArea from "./CompletedArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import RecommandCourseArea from "./RecommandCourseArea";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      keywords: [],
      completedCourses: [],
      cartCourses: {},
      ratedCourses: [],
      recommandedCourses: [],
    };
    this.setRating = this.setRating.bind(this);
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    let courseURL = "http://cs571.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();
    let completedURL = "http://cs571.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completedData = await (await fetch(completedURL)).json();
    //completedData = completedData.data;

    this.setState({
      allCourses: courseData,
      filteredCourses: courseData,
      completedCourses: completedData.data,
      subjects: this.getSubjects(courseData),
      keywords: this.getKeywords(courseData),
    });
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setRating(number,score) {
    let ratedCourses = JSON.parse(JSON.stringify(this.state.ratedCourses));
    for (let i = 0; i < this.state.completedCourses.length; i++) {
      if (this.state.completedCourses[i] === number) {
        const index = ratedCourses.map(function(e) { return e.number; }).indexOf(number);
        if (index === -1) {
          ratedCourses.push({number:number,rate:score});
        } else {
          ratedCourses[index].rate = score;
        }
      }
    }

    this.setState({ratedCourses: ratedCourses},this.setRecommandation);
  }

  setRecommandation() {
    console.log(this.state.ratedCourses);
    let keywords = [];
    let recommandedCourses = [];
    for (let i=0; i<this.state.ratedCourses.length; i++) {
      if (this.state.ratedCourses[i].rate === "★★★★★") {
        for (let j=0; j<this.state.allCourses.length; j++) {
          if (this.state.allCourses[j].number === this.state.ratedCourses[i].number) {
            for (let k=0; k < this.state.allCourses[j].keywords.length; k++) {
              if (keywords.indexOf(this.state.allCourses[j].keywords[k]) === -1)
              keywords.push(this.state.allCourses[j].keywords[k]);
            }
          }
        }
      }
    }
    keywords = keywords.sort();
    for (let i=0; i<keywords.length; i++) {
      for (let j=0; j<this.state.allCourses.length; j++) {
        if (this.state.allCourses[j].keywords.indexOf(keywords[i]) !== -1 && this.state.completedCourses.indexOf(this.state.allCourses[j].number) === -1) {
          if (recommandedCourses.indexOf(this.state.allCourses[j]) === -1)
            recommandedCourses.push(this.state.allCourses[j]);
        }
      }
    }
    this.setState({recommandedCourses: recommandedCourses});
  }

  getKeywords(data) {
    let keywords = [];
    keywords.push("All");

    for (let i = 0; i < data.length; i++) {
      for (let j=0; j < data[i].keywords.length; j++) {
        if (keywords.indexOf(data[i].keywords[j]) === -1)
        keywords.push(data[i].keywords[j]);
      }
    }

    keywords = keywords.sort();
    return keywords;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    this.checkEligibility(data);

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  checkEligibility(data) {
    for (let i=0; i<this.state.allCourses.length; i++) {
      if (this.state.allCourses[i].number === data.course) {
        console.log(this.state.allCourses[i].requisites);
        if (this.state.allCourses[i].requisites.length === 0) {
          return ;
        } else {
          let passAll = true;
          for (let j=0; j<this.state.allCourses[i].requisites.length; j++) {
            let pass = false;
            for (let k=0; k<this.state.allCourses[i].requisites[j].length; k++) {
              console.log(this.state.allCourses[i].requisites[j][k]);
              if (this.state.completedCourses.indexOf(this.state.allCourses[i].requisites[j][k]) !== -1) {
                pass = true;
              }
            }
            if (!pass) {
              passAll = false;
            }
          }
          if (!passAll) {
            alert("Course requisites not met!");
          }
          return;
        }
      }
    }
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].forEach((_subsection) => {
        if (_subsection.number === data.subsection.number) {
          newCartCourses[data.course][data.section].splice(
            newCartCourses[data.course][data.section].indexOf(_subsection),
            1
          );
        }
      });
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  getCompletedData() {
    let completedData = [];
    
    this.state.completedCourses.forEach(number =>
      {
        this.state.allCourses.forEach(course => {
          if (course.number === number) {
            completedData.push(course);
          }
        })
      })
    return completedData;
  }

  render() {
    return (
      <>
        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              keywordList={this.state.keywords}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                cartMode={false}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.getCartData()}
                cartMode={true}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{ paddingTop: "5vh"}}>
            <div style={{ marginLeft: "20vw"}}>
              <CompletedArea
                data={this.getCompletedData()}
                setRating={(number,score) => this.setRating(number,score)}
              />
            </div>
          </Tab>
          <Tab eventKey="recommand" title="Recommanded Courses" style={{ paddingTop: "5vh"}}>
            <div style={{ marginLeft: "20vw"}}>
            <RecommandCourseArea
                data={this.state.recommandedCourses}
                cartMode={false}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
