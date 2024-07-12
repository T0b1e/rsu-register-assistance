// src/components/checkboxHandler.js
import { updateSubjectCounter } from './subjectCounter.js';
import { addCourseToNewTable, removeCourseFromNewTable } from './modal.js';
import { selectedCourses, selectedSubjectsCount, updateSelectedCourses, updateSelectedSubjectsCount } from './sharedState.js';

export function handleCheckboxChange(course, schedule, checkbox) {
    const courseKey = `${course.code}-${schedule.sec}`;

    if (checkbox.checked) {
        if (selectedCourses[course.code]) {
            const prevCheckbox = document.querySelector(`input[type="checkbox"][data-course="${course.code}"][data-section="${selectedCourses[course.code].section}"]`);
            if (prevCheckbox) prevCheckbox.checked = false;
            removeCourseFromNewTable(course, selectedCourses[course.code].schedule);
        } else {
            updateSelectedSubjectsCount(selectedSubjectsCount + 1);
        }

        selectedCourses[course.code] = { section: schedule.sec, schedule: schedule };
        addCourseToNewTable(course, schedule);
    } else {
        delete selectedCourses[course.code];
        removeCourseFromNewTable(course, schedule);
        updateSelectedSubjectsCount(selectedSubjectsCount - 1);
    }

    checkbox.setAttribute('data-course', course.code);
    checkbox.setAttribute('data-section', schedule.sec);

    updateSubjectCounter();
}
