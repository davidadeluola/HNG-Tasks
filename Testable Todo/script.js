const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const DESCRIPTION_COLLAPSE_THRESHOLD = 150;
const TIME_UPDATE_INTERVAL_MS = 30000;

function toDateOrFallback(value, fallbackDate) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallbackDate;
  }
  return parsed;
}

function toLocalDateTimeInputValue(date) {
  const pad = function (num) {
    return String(num).padStart(2, "0");
  };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

function formatDueDate(date) {
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getRelativeTimeInfo(dueDate) {
  const diff = dueDate.getTime() - Date.now();
  const abs = Math.abs(diff);

  if (abs < MINUTE_MS) {
    return {
      text: "Due now!",
      isOverdue: false,
    };
  }

  if (diff > 0) {
    const days = Math.floor(diff / DAY_MS);
    if (days >= 2) {
      return { text: "Due in " + days + " days", isOverdue: false };
    }
    if (days === 1) {
      return { text: "Due tomorrow", isOverdue: false };
    }

    const hours = Math.floor(diff / HOUR_MS);
    if (hours >= 1) {
      return {
        text: "Due in " + hours + " hour" + (hours === 1 ? "" : "s"),
        isOverdue: false,
      };
    }

    const minutes = Math.ceil(diff / MINUTE_MS);
    return {
      text: "Due in " + minutes + " minute" + (minutes === 1 ? "" : "s"),
      isOverdue: false,
    };
  }

  const overdueDays = Math.floor(abs / DAY_MS);
  if (overdueDays >= 1) {
    return {
      text:
        "Overdue by " + overdueDays + " day" + (overdueDays === 1 ? "" : "s"),
      isOverdue: true,
    };
  }

  const overdueHours = Math.floor(abs / HOUR_MS);
  if (overdueHours >= 1) {
    return {
      text:
        "Overdue by " + overdueHours + " hour" + (overdueHours === 1 ? "" : "s"),
      isOverdue: true,
    };
  }

  const overdueMinutes = Math.max(1, Math.floor(abs / MINUTE_MS));
  return {
    text:
      "Overdue by " + overdueMinutes + " minute" + (overdueMinutes === 1 ? "" : "s"),
    isOverdue: true,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const title = document.querySelector('[data-testid="test-todo-title"]');
  const description = document.querySelector('[data-testid="test-todo-description"]');
  const priority = document.querySelector('[data-testid="test-todo-priority"]');
  const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
  const status = document.querySelector('[data-testid="test-todo-status"]');
  const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
  const dueDate = document.querySelector('[data-testid="test-todo-due-date"]');
  const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
  const completeToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
  const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
  const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
  const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
  const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
  const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
  const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
  const editDescriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
  const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
  const saveButton = document.querySelector('[data-testid="test-todo-save-button"]');
  const cancelButton = document.querySelector('[data-testid="test-todo-cancel-button"]');

  if (
    !card ||
    !title ||
    !description ||
    !priority ||
    !priorityIndicator ||
    !status ||
    !statusControl ||
    !dueDate ||
    !timeRemaining ||
    !overdueIndicator ||
    !completeToggle ||
    !collapsibleSection ||
    !expandToggle ||
    !editButton ||
    !deleteButton ||
    !editForm ||
    !editTitleInput ||
    !editDescriptionInput ||
    !editPrioritySelect ||
    !editDueDateInput ||
    !saveButton ||
    !cancelButton
  ) {
    return;
  }

  timeRemaining.setAttribute("aria-live", "polite");

  let timeIntervalId = null;
  let editSnapshot = null;
  let isExpanded = false;

  const initialDueDate = toDateOrFallback(
    dueDate.getAttribute("datetime") || "",
    new Date(Date.now() + 36 * HOUR_MS)
  );

  const state = {
    title: title.textContent ? title.textContent.trim() : "",
    description: description.textContent ? description.textContent.trim() : "",
    priority: priority.textContent ? priority.textContent.trim() : "Medium",
    status: status.textContent ? status.textContent.trim() : "In Progress",
    dueDate: initialDueDate,
  };

  function applyPriorityVisual(priorityValue) {
    const normalized = priorityValue.toLowerCase();
    priorityIndicator.classList.remove("priority-low", "priority-medium", "priority-high");

    if (normalized === "high") {
      priorityIndicator.classList.add("priority-high");
      priority.style.background = "#ffe9e9";
      priority.style.color = "var(--high)";
      return;
    }

    if (normalized === "low") {
      priorityIndicator.classList.add("priority-low");
      priority.style.background = "#e6f9ef";
      priority.style.color = "var(--low)";
      return;
    }

    priorityIndicator.classList.add("priority-medium");
    priority.style.background = "#fff5e3";
    priority.style.color = "var(--medium)";
  }

  function applyStatusVisual(statusValue) {
    status.classList.remove("status-pending", "status-in-progress", "status-done");
    card.classList.remove("state-pending", "state-in-progress", "state-done");

    if (statusValue === "Done") {
      status.classList.add("status-done");
      card.classList.add("state-done");
      title.classList.add("completed");
      description.classList.add("completed");
      return;
    }

    title.classList.remove("completed");
    description.classList.remove("completed");

    if (statusValue === "Pending") {
      status.classList.add("status-pending");
      card.classList.add("state-pending");
      return;
    }

    status.classList.add("status-in-progress");
    card.classList.add("state-in-progress");
  }

  function updateTimeDisplay() {
    if (state.status === "Done") {
      timeRemaining.textContent = "Completed";
      timeRemaining.classList.remove("overdue");
      overdueIndicator.hidden = true;
      card.classList.remove("state-overdue");
      return;
    }

    const relativeTime = getRelativeTimeInfo(state.dueDate);
    timeRemaining.textContent = relativeTime.text;
    timeRemaining.classList.toggle("overdue", relativeTime.isOverdue);
    overdueIndicator.hidden = !relativeTime.isOverdue;
    card.classList.toggle("state-overdue", relativeTime.isOverdue);
  }

  function stopTimeUpdates() {
    if (timeIntervalId !== null) {
      window.clearInterval(timeIntervalId);
      timeIntervalId = null;
    }
  }

  function ensureTimeUpdates() {
    stopTimeUpdates();
    if (state.status !== "Done") {
      timeIntervalId = window.setInterval(updateTimeDisplay, TIME_UPDATE_INTERVAL_MS);
    }
    updateTimeDisplay();
  }

  function renderDueDate() {
    dueDate.setAttribute("datetime", state.dueDate.toISOString());
    dueDate.textContent = formatDueDate(state.dueDate);
  }

  function syncStatus(nextStatus, source) {
    state.status = nextStatus;
    status.textContent = nextStatus;
    statusControl.value = nextStatus;

    if (source !== "checkbox") {
      completeToggle.checked = nextStatus === "Done";
    }

    applyStatusVisual(nextStatus);
    ensureTimeUpdates();
  }

  function updateCollapseAvailability() {
    const isLongDescription = state.description.length > DESCRIPTION_COLLAPSE_THRESHOLD;
    if (!isLongDescription) {
      collapsibleSection.classList.remove("is-collapsed");
      expandToggle.hidden = true;
      expandToggle.setAttribute("aria-expanded", "true");
      isExpanded = true;
      return;
    }

    expandToggle.hidden = false;
    if (isExpanded) {
      collapsibleSection.classList.remove("is-collapsed");
      expandToggle.textContent = "Collapse";
      expandToggle.setAttribute("aria-expanded", "true");
      return;
    }

    collapsibleSection.classList.add("is-collapsed");
    expandToggle.textContent = "Expand";
    expandToggle.setAttribute("aria-expanded", "false");
  }

  function openEditMode() {
    editSnapshot = {
      title: state.title,
      description: state.description,
      priority: state.priority,
      dueDate: new Date(state.dueDate.getTime()),
    };

    editTitleInput.value = state.title;
    editDescriptionInput.value = state.description;
    editPrioritySelect.value = state.priority;
    editDueDateInput.value = toLocalDateTimeInputValue(state.dueDate);

    editForm.hidden = false;
    editButton.setAttribute("aria-expanded", "true");
    editTitleInput.focus();
  }

  function closeEditMode() {
    editForm.hidden = true;
    editButton.setAttribute("aria-expanded", "false");
    editButton.focus();
  }

  renderDueDate();
  applyPriorityVisual(state.priority);
  syncStatus(state.status, "init");
  updateCollapseAvailability();

  completeToggle.addEventListener("change", function () {
    if (completeToggle.checked) {
      syncStatus("Done", "checkbox");
      return;
    }
    syncStatus("Pending", "checkbox");
  });

  statusControl.addEventListener("change", function () {
    const selectedStatus = statusControl.value;
    syncStatus(selectedStatus, "status-control");
  });

  expandToggle.addEventListener("click", function () {
    if (expandToggle.hidden) {
      return;
    }

    isExpanded = !isExpanded;
    updateCollapseAvailability();
  });

  editButton.addEventListener("click", function () {
    if (!editForm.hidden) {
      closeEditMode();
      return;
    }
    openEditMode();
  });

  cancelButton.addEventListener("click", function () {
    if (!editSnapshot) {
      closeEditMode();
      return;
    }

    state.title = editSnapshot.title;
    state.description = editSnapshot.description;
    state.priority = editSnapshot.priority;
    state.dueDate = new Date(editSnapshot.dueDate.getTime());

    title.textContent = state.title;
    description.textContent = state.description;
    priority.textContent = state.priority;
    renderDueDate();
    applyPriorityVisual(state.priority);
    ensureTimeUpdates();
    updateCollapseAvailability();
    closeEditMode();
  });

  editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nextTitle = editTitleInput.value.trim();
    const nextDescription = editDescriptionInput.value.trim();
    const nextPriority = editPrioritySelect.value;
    const nextDueDate = toDateOrFallback(editDueDateInput.value, state.dueDate);

    state.title = nextTitle || state.title;
    state.description = nextDescription || state.description;
    state.priority = nextPriority;
    state.dueDate = nextDueDate;

    title.textContent = state.title;
    description.textContent = state.description;
    priority.textContent = state.priority;

    renderDueDate();
    applyPriorityVisual(state.priority);
    ensureTimeUpdates();

    isExpanded = false;
    updateCollapseAvailability();
    closeEditMode();
  });

  editForm.addEventListener("keydown", function (event) {
    if (event.key !== "Tab" || editForm.hidden) {
      return;
    }

    const focusableElements = [
      editTitleInput,
      editDescriptionInput,
      editPrioritySelect,
      editDueDateInput,
      saveButton,
      cancelButton,
    ];

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  deleteButton.addEventListener("click", function () {
    const shouldDelete = window.confirm("Delete this task?");
    if (!shouldDelete) {
      return;
    }

    stopTimeUpdates();
    card.remove();
  });
});
