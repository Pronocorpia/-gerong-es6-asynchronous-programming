/* script.js
   Demonstrates ES6 classes, Promises (.then), Async/Await and Fetch API.
*/

class Student {
    constructor({ id, name, age, course }) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.course = course;
    }
  
    introduce() {
      return `Hi, my name is ${this.name}, I am ${this.age} years old, and I am enrolled in ${this.course}.`;
    }
  }
  
  class Instructor {
    constructor({ id, name, subject }) {
      this.id = id;
      this.name = name;
      this.subject = subject;
    }
  
    teach() {
      return `I am ${this.name} and I teach ${this.subject}.`;
    }
  }
  
  function el(tag, text = '', cls = '') {
    const n = document.createElement(tag);
    if (text) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }
  
  function fetchWithThen(path = 'data/students.json') {
    return fetch(path)
      .then(res => {
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('--- fetchWithThen (Promise .then) ---');
        console.log(data);
        return data;
      })
      .catch(err => {
        console.error('Error in fetchWithThen:', err);
        throw err;
      });
  }
  
  async function fetchWithAsync(path = 'data/students.json') {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
      const data = await res.json();
      console.log('--- fetchWithAsync (Async/Await) ---');
      console.log(data);
      return data;
    } catch (err) {
      console.error('Error in fetchWithAsync:', err);
      throw err;
    }
  }

  function renderAll(data) {
    const output = document.getElementById('output');
    output.innerHTML = '';
  
    const studentObjects = data.students.map(s => new Student(s));
    const instructorObjects = data.instructors.map(i => new Instructor(i));
  
    const studentsSection = el('div', '', 'section');
    studentsSection.appendChild(el('h3', 'Students:'));
    data.students.forEach(s => {
      const isOlder = s.age > 21;
      const div = el(
        'div',
        `${s.name} (${s.age}) - ${s.course}${isOlder ? ' *' : ''}`,
        `student ${isOlder ? 'highlight' : ''}`
      );
      studentsSection.appendChild(div);
    });
    output.appendChild(studentsSection);
  
    const coursesSection = el('div', '', 'section');
    coursesSection.appendChild(el('h3', 'Courses:'));
    data.courses.forEach(c => {
      const div = el('div', `${c.title}: ${c.description}`, 'course');
      coursesSection.appendChild(div);
    });
    output.appendChild(coursesSection);
  
    const instrSection = el('div', '', 'section');
    instrSection.appendChild(el('h3', 'Instructors:'));
    data.instructors.forEach(i => {
      const div = el('div', `${i.name} - ${i.subject}`, 'instructor');
      instrSection.appendChild(div);
    });
    output.appendChild(instrSection);
  
    const relSection = el('div', '', 'section');
    relSection.appendChild(el('h3', 'Data Relationships:'));
  
    const studentCourseList = el('div');
    studentCourseList.appendChild(el('h4', 'Student → Course → Course Description'));
    data.students.forEach(s => {
      const course = data.courses.find(c => c.title === s.course);
      const text = course
        ? `${s.name} → ${course.title} → ${course.description}`
        : `${s.name} → ${s.course} → (no description found)`;
      studentCourseList.appendChild(el('div', text));
    });
    relSection.appendChild(studentCourseList);
  
    const courseInstructorList = el('div');
    courseInstructorList.appendChild(el('h4', 'Course → Instructor'));
    data.courses.forEach(c => {
      const found = data.instructors.find(i =>
        i.subject.toLowerCase().includes(c.title.toLowerCase())
      );
      let instructorName = found ? found.name : null;
      if (!instructorName) {
        if (c.title.toLowerCase().includes('data')) instructorName = 'Maria Santos';
        else if (c.title.toLowerCase().includes('cyber')) instructorName = 'Carlos Dela Cruz';
        else instructorName = 'John Rey Silverio';
      }
      courseInstructorList.appendChild(el('div', `${c.title} → Taught by ${instructorName}`));
    });
    relSection.appendChild(courseInstructorList);
  
    output.appendChild(relSection);
  
    const examples = el('div', '', 'section');
    examples.appendChild(el('h3', 'Examples from class instances'));
    studentObjects.slice(0, 3).forEach(s => examples.appendChild(el('div', s.introduce())));
    instructorObjects.slice(0, 2).forEach(i => examples.appendChild(el('div', i.teach())));
    output.appendChild(examples);
  }
  

  fetchWithThen()
    .then(data => {
      renderAll(data);
    })
    .catch(err => {
      const out = document.getElementById('output');
      out.textContent = 'Failed to load data (see console).';
    });
  

  (async function demoAsync() {
    try {
      await fetchWithAsync();
    } catch (err) {
    }
  })();
  