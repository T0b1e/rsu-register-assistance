// src/events.js
import { planSelection, savePlanButton, clearPlanButton } from './domElements.js';
import { handlePlanChange, saveCurrentPlan, clearCurrentPlan } from './functions.js';

planSelection.addEventListener('change', handlePlanChange);
savePlanButton.addEventListener('click', saveCurrentPlan);
clearPlanButton.addEventListener('click', clearCurrentPlan);
