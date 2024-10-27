// src/functions.js
export { createCourseTable } from './components/courseTable.js';
export { createNewTable } from './components/newTable.js';
export { updateSubjectCounter } from './components/subjectCounter.js';
export { saveCurrentPlan, loadPlan, savePlansToLocalStorage, loadPlansFromLocalStorage, handlePlanChange, clearCurrentPlan } from './components/plans.js';
export { openAddSubjectModal, closeAddSubjectModal, addNewSubject, editSubject, deleteSubject, addNewSection, addCourseToNewTable, removeCourseFromNewTable } from './components/modal.js';
export { handleCheckboxChange } from './components/checkboxHandler.js';
export { startClock } from './components/clock.js';