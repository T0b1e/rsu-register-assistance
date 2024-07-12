// src/sharedState.js
export let selectedCourses = {};
export let selectedSubjectsCount = 0;

export function updateSelectedCourses(newSelectedCourses) {
    selectedCourses = newSelectedCourses;
}

export function updateSelectedSubjectsCount(newCount) {
    selectedSubjectsCount = newCount;
}
