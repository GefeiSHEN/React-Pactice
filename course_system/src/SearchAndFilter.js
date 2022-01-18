class SearchAndFilter {
  searchAndFilter(courses, search, subject, keyword, minimumCredits, maximumCredits) {
    if (subject !== "" && search !== null) {
      let coursesAfterSearch = [];

      for (const course of courses) {
        for (const keyword of course.keywords) {
          if (keyword.includes(search)) {
            coursesAfterSearch.push(course);
            break;
          }
        }
      }
      courses = coursesAfterSearch;
    }

    if (subject !== "All") {
      let coursesAfterSubject = [];

      for (const course of courses) {
        if (course.subject === subject) coursesAfterSubject.push(course);
      }
      courses = coursesAfterSubject;
    }

    if (keyword !== "All") {
      let coursesAfterKeyword = [];

      for (const course of courses) {
        for (let i=0; i<course.keywords.length; i++) {
          if (course.keywords[i] === keyword) coursesAfterKeyword.push(course);
        }
      }
      courses = coursesAfterKeyword;
    }

    if (minimumCredits !== "") {
      let coursesAfterMinimumCredits = [];

      for (const course of courses) {
        if (course.credits >= parseInt(minimumCredits))
          coursesAfterMinimumCredits.push(course);
      }
      courses = coursesAfterMinimumCredits;
    }

    if (maximumCredits !== "") {
      let coursesAfterMaximumCredits = [];

      for (const course of courses) {
        if (course.credits <= parseInt(maximumCredits))
          coursesAfterMaximumCredits.push(course);
      }
      courses = coursesAfterMaximumCredits;
    }

    return courses;
  }
}

export default SearchAndFilter;
