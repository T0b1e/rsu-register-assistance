// src/components/plans.js
import { planSelection, savePlanButton, clearPlanButton } from '../domElements.js';
import { data } from '../data.js';
import { selectedCourses, selectedSubjectsCount, updateSelectedCourses, updateSelectedSubjectsCount } from './sharedState.js';
import { addCourseToNewTable, removeCourseFromNewTable } from './modal.js';

let plans = {
    "plan-1": { courses: {}, checkboxes: {} },
    "plan-2": { courses: {}, checkboxes: {} },
    "plan-3": { courses: {}, checkboxes: {} }
};
let currentPlan = "plan-1";

export function saveCurrentPlan() {
    const savedSelectedCourses = {};
    document.querySelectorAll('.subject-row input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            const courseCode = checkbox.getAttribute('data-course');
            const section = checkbox.getAttribute('data-section');
            savedSelectedCourses[courseCode] = section;
        }
    });
    plans[currentPlan] = {
        courses: JSON.parse(JSON.stringify(selectedCourses)),
        checkboxes: savedSelectedCourses
    };
    savePlansToLocalStorage();
    alert(`Plan "${currentPlan}" saved successfully!`);
}

export function clearCurrentPlan() {
    Object.keys(selectedCourses).forEach(code => {
        const schedule = selectedCourses[code].schedule;
        removeCourseFromNewTable(data.courses.find(course => course.code === code), schedule);
    });
    updateSelectedCourses({});
    updateSelectedSubjectsCount(0);
    document.querySelectorAll('.subject-row input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    alert(`Plan "${currentPlan}" cleared successfully!`);
}

export function loadPlan(plan) {
    Object.keys(selectedCourses).forEach(code => {
        const schedule = selectedCourses[code].schedule;
        removeCourseFromNewTable(data.courses.find(course => course.code === code), schedule);
    });

    const planData = plans[plan] || { courses: {}, checkboxes: {} };
    updateSelectedCourses(JSON.parse(JSON.stringify(planData.courses || {})));
    updateSelectedSubjectsCount(Object.keys(selectedCourses).length);

    document.querySelectorAll('.subject-row input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    if (planData.checkboxes) {
        Object.keys(planData.checkboxes).forEach(courseCode => {
            const section = planData.checkboxes[courseCode];
            const checkbox = document.querySelector(`input[type="checkbox"][data-course="${courseCode}"][data-section="${section}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    Object.keys(selectedCourses).forEach(code => {
        const course = data.courses.find(course => course.code === code);
        const schedule = selectedCourses[code].schedule;
        addCourseToNewTable(course, schedule);
    });
}

export function savePlansToLocalStorage() {
    localStorage.setItem('plans', JSON.stringify(plans));
}

export function loadPlansFromLocalStorage() {
    const storedPlans = localStorage.getItem('plans');
    if (storedPlans) {
        try {
            const parsedPlans = JSON.parse(storedPlans);
            Object.assign(plans, parsedPlans);
            Object.keys(plans).forEach(planName => {
                if (!document.querySelector(`#planSelection option[value="${planName}"]`)) {
                    const newOption = document.createElement('option');
                    newOption.value = planName;
                    newOption.textContent = planName;
                    planSelection.appendChild(newOption);
                }
            });
        } catch (e) {
            console.error('Error parsing saved plans:', e);
        }
    } else {
        savePlansToLocalStorage();
    }
}

export function handlePlanChange() {
    const selectedPlan = planSelection.value;
    if (selectedPlan === 'new-plan') {
        const newPlanName = prompt('Enter the name of the new plan:');
        if (newPlanName) {
            plans[newPlanName] = { courses: {}, checkboxes: {} };
            const newOption = document.createElement('option');
            newOption.value = newPlanName;
            newOption.textContent = newPlanName;
            planSelection.insertBefore(newOption, planSelection.querySelector('option[value="new-plan"]'));
            planSelection.value = newPlanName;
            currentPlan = newPlanName;
        }
    } else {
        currentPlan = selectedPlan;
        loadPlan(currentPlan);
    }
}

planSelection.addEventListener('change', handlePlanChange);
savePlanButton.addEventListener('click', saveCurrentPlan);
clearPlanButton.addEventListener('click', clearCurrentPlan);
