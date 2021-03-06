import React, {
  Component,
} from 'react';
import { PropTypes as T } from 'prop-types';
import radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SelectActions from '../../actions/Select.js';

import Theme from '../../styles/Theme.js';
// components
import CourseDetail from '../Lightbox/CourseDetail.jsx';


// Style
const styles = {
  wrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    width: '90%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  h1Wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: {
    color: Theme.TITLE_COLOR,
  },
  coursesWraper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  courseWrapper: {
    display: 'flex',
    width: '100%',
  },
  course: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    minHeight: 80,
    margin: 8,
    textDecoration: 'none',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 6,
    borderShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
    padding: '0px 15px',
  },
  courseRowEven: {
    borderBottom: '1px solid rgb(240, 240, 240)',
    borderTop: '1px solid rgb(240, 240, 240)',
    backgroundColor: 'rgb(248, 248, 248)',
  },
  text: {
    margin: 5,
    minWidth: 50,
    fontSize: 13,
    fontWeight: 300,
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 80,
    margin: 8,
    textDecoration: 'none',
    backgroundColor: 'rgba(53, 53, 53, 0.8)',
    borderRadius: 6,
    borderShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
    padding: '0px 15px',
  },
  header: {
    margin: 5,
    fontSize: 15,
    fontWeight: 500,
    color: '#fefefe',
  },
  buttonWraper: {
    minWidth: 50,
    margin: 20,
    fontSize: 13,
    fontWeight: 500,
    color: '#fefefe',
  },
  detailButton: {
    margin: 30,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 5,
    padding: '6px 24px',
    color: 'rgb(245, 166, 67)',
    border: '2px solid rgb(245, 166, 67)',
    backgroundColor: 'transparent',
    outline: '0px',
    cursor: 'pointer',
  },
  addButton: {
    margin: 5,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 5,
    padding: '6px 24px',
    color: 'rgba(38, 62, 208, 0.9)',
    border: '2px solid rgba(38, 62, 208, 0.9)',
    backgroundColor: 'transparent',
    outline: '0px',
    cursor: 'pointer',
  },
  sortButton: {
    margin: 5,
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 5,
    padding: '6px 24px',
    border: '2px solid #575759',
    backgroundColor: '#D3D2D9',
    color: '#575759',
    outline: '0px',
    cursor: 'pointer',
    letterSpacing: 3,
    textDecoration: 'none',
  },
  sortCompleteButton: {
    border: '2px solid #3AB795',
    backgroundColor: '#3AB795',
    color: '#eee',
  },
};


class SelectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortMode: false,
      renderCourses: props.courses || [],
      draggedCourse: null,
      beforeResort: [],
      showLightbox: false,
      courseId: '',
    };
  }

  componentWillMount() {
    const {
      getCourseList,
    } = this.props;

    getCourseList();
  }

  componentWillReceiveProps({
    courses,
  }) {
    if (courses.length && this.props.courses !== courses) {
      this.setState({ renderCourses: courses });
    }
  }

  handleDragOver(id, event) {
    event.preventDefault();

    const targetElement = document.getElementById(id);
    const targetRect = targetElement.getBoundingClientRect();
    const distance = (targetRect.y + (targetRect.height / 2)) - event.clientY;

    if (distance <= -targetRect.height / 5) {
      targetElement.style.borderTop = '';
      targetElement.style.borderBottom = 'dashed 5px rgb(245, 67, 67)';
      this.relativePosition = 'bottom';
    } else if (distance >= targetRect.height / 5) {
      targetElement.style.borderBottom = '';
      targetElement.style.borderTop = 'dashed 4px rgb(245, 67, 67)';
      this.relativePosition = 'top';
    }
  }

  move(targetId, relativePosition = this.relativePosition) {
    const {
      draggedCourse,
      renderCourses,
    } = this.state;
    if (draggedCourse === targetId) return null;

    const originalCourseList = renderCourses.slice();
    const draggedIndex = originalCourseList.findIndex(a => a.course_id === draggedCourse);
    let tempCourseList = [
      ...originalCourseList.slice(0, draggedIndex),
      ...originalCourseList.slice(draggedIndex + 1),
    ];
    const targetIndex = tempCourseList.findIndex(a => a.course_id === targetId);
    switch (relativePosition) {
      case 'top':
        tempCourseList = [
          ...tempCourseList.slice(0, targetIndex),
          originalCourseList[draggedIndex],
          ...tempCourseList.slice(targetIndex),
        ];
        break;
      case 'bottom':
        tempCourseList = [
          ...tempCourseList.slice(0, targetIndex + 1),
          originalCourseList[draggedIndex],
          ...tempCourseList.slice(targetIndex + 1),
        ];
        break;
      default:
        return null;
    }
    this.setState({
      renderCourses: tempCourseList,
    });
    return null;
  }

  handleDragStart(id) {
    document.getElementById(id).style.opacity = 0.3;
    this.setState({
      draggedCourse: id,
    });
  }

  handleDragLeave(id) {
    const targetElement = document.getElementById(id);

    targetElement.style.borderTop = '';
    targetElement.style.borderBottom = '';
    return this;
  }

  handleDragEnd(id) {
    const targetElement = document.getElementById(id);
    targetElement.style.opacity = 1;
    return this;
  }

  handleDrop(id) {
    const targetElement = document.getElementById(id);

    targetElement.style.borderTop = '';
    targetElement.style.borderBottom = '';
    this.move(id);
  }

  render() {
    const {
      toggleSelectStatus,
      sortCourses,
    } = this.props;

    const {
      sortMode,
      renderCourses,
    } = this.state;

    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.h1Wrapper}>
            <h1 style={styles.h1}>選課清單</h1>
            {
              sortMode ?
                <div>
                  <button
                    key="submitButton"
                    onClick={() => {
                      const submitData = renderCourses.map(a => a.subject_id);
                      sortCourses({
                        order_list: submitData,
                      }, renderCourses);
                      this.setState({
                        sortMode: false,
                      });
                    }}
                    style={[styles.sortButton, styles.sortCompleteButton]}>
                    儲存
                  </button>
                  <button
                    key="cancelButton"
                    onClick={() => {
                      this.setState({
                        sortMode: false,
                        renderCourses: this.state.beforeResort,
                      });
                    }}
                    style={[styles.sortButton]}>
                    取消
                  </button>
                </div>
                : (
                  <button
                    onClick={() => {
                      this.setState({
                        sortMode: true,
                        beforeResort: renderCourses,
                      });
                    }}
                    style={styles.sortButton}>
                    編輯排序
                  </button>
                )}
          </div>
          <div style={styles.coursesWraper}>
            <div style={[styles.headerWrapper]}>
              <span style={[styles.header, { flex: '1 1 50px' }]}>學期</span>
              <span style={[styles.header, { flex: '2 2 100px' }]}>課程名稱</span>
              <span style={[styles.header, { flex: '2 2 100px' }]}>任課教師</span>
              <span style={[styles.header, { flex: '2 2 100px' }]}>教室</span>
              <span style={[styles.header, { flex: '1.2 1.2 60px' }]}>開課院系</span>
              <span style={[styles.header, { flex: '1 1 50px' }]}>修別</span>
              <span style={[styles.header, { flex: '4 4 200px' }]}>上課時間</span>
              <span style={[styles.buttonWraper, { flex: '2 2 100px' }]}>更多資訊</span>
              <span style={[styles.buttonWraper, { flex: '2 2 100px' }]}>操作</span>
            </div>
            {renderCourses[0] && renderCourses.map((course, index) => (
              <div
                draggable={this.state.sortMode}
                id={course.course_id}
                onDragStart={event => this.handleDragStart(course.course_id, event)}
                onDragOver={event => this.handleDragOver(course.course_id, event)}
                onDragLeave={event => this.handleDragLeave(course.course_id, event)}
                onDragEnd={event => this.handleDragEnd(course.course_id, event)}
                onDrop={event => this.handleDrop(course.course_id, event)}
                style={[styles.courseWrapper, sortMode && { cursor: 'move' }]}
                key={course.course_id}>
                <div style={[styles.course, index % 2 !== 0 ? styles.courseRowEven : null]}>
                  <span style={[styles.text, { flex: '1 1 50px' }]}>{course.semester || ''}</span>
                  <span style={[styles.text, { flex: '2 2 100px' }]}>{course.course_name_ch || ''}</span>
                  <span style={[styles.text, { flex: '2 2 100px' }]}>{course.teacher || ''}</span>
                  <span style={[styles.text, { flex: '2 2 100px' }]}>{course.location || ''}</span>
                  <span style={[styles.text, { flex: '1.2 1.2 60px' }]}>{course.department || ''}</span>
                  <span style={[styles.text, { flex: '1 1 50px' }]}>{course.course_type || ''}</span>
                  <span style={[styles.text, { flex: '4 4 200px' }]}>
                    {`${course.weekday || ''} ${course.begin_time && course.begin_time.match(/T(\d+:\d+)/i)[1]} - ${course.end_time && course.end_time.match(/T(\d+:\d+)/i)[1]}`}
                  </span>
                  <button
                    onClick={() => {
                      this.setState({
                        courseId: course.subject_id,
                        showLightbox: true,
                      });
                    }}
                    style={[styles.detailButton, { flex: '2 2 100px' }]}>
                    more
                  </button>
                  <button
                    style={[styles.addButton, { flex: '2 2 140px' }]}
                    onClick={() => {
                      if (window.confirm(`是否取消選取課程${course.subject_id}？`)) {
                        toggleSelectStatus(course.subject_id, (msg) => {
                          window.alert(`${course.course_name_ch}(${course.subject_id}):\n${msg}`)
                        });
                      }
                      return null;
                    }}>刪除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {
          this.state.showLightbox &&
          <CourseDetail
            courseId={this.state.courseId}
            eventHandler={{
              onClick: () => {
                this.setState({
                  showLightbox: false,
                });
              },
            }} />
        }
      </div>
    );
  }
}


const reduxHook = connect(
  state => ({
    courses: state.Select.courseList,
  }),
  dispatch => bindActionCreators({
    ...SelectActions,
  }, dispatch)
);


SelectList.propTypes = {
  // redux
  getCourseList: T.func.isRequired,
  toggleSelectStatus: T.func.isRequired,
  sortCourses: T.func.isRequired,
  courses: T.arrayOf(T.shape({})),
  // Router
  history: T.shape({}).isRequired,
};

SelectList.defaultProps = {
  courses: [],
};

export default reduxHook(
  radium(SelectList)
);
