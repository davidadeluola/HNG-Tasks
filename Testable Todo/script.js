const DUE_DATE = new Date("2026-03-01T18:00:00Z");
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function calculateTimeRemaining() {
  const diff = DUE_DATE.getTime() - Date.now();
  const abs = Math.abs(diff);

  if (abs < MINUTE_MS) {
    return "Due now!";
  }

  if (diff > 0) {
    const days = Math.floor(diff / DAY_MS);
    if (days >= 2) {
      return "Due in " + days + " days";
    }
    if (days === 1) {
      return "Due tomorrow";
    }

    const hours = Math.floor(diff / HOUR_MS);
    if (hours >= 1) {
      return "Due in " + hours + " hour" + (hours === 1 ? "" : "s");
    }

    const minutes = Math.ceil(diff / MINUTE_MS);
    return "Due in " + minutes + " minute" + (minutes === 1 ? "" : "s");
  }

  const overdueDays = Math.floor(abs / DAY_MS);
  if (overdueDays >= 1) {
    return (
      "Overdue by " +
      overdueDays +
      " day" +
      (overdueDays === 1 ? "" : "s")
    );
  }

  const overdueHours = Math.floor(abs / HOUR_MS);
  if (overdueHours >= 1) {
    return (
      "Overdue by " +
      overdueHours +
      " hour" +
      (overdueHours === 1 ? "" : "s")
    );
  }

  const overdueMinutes = Math.floor(abs / MINUTE_MS);
  return (
    "Overdue by " +
    overdueMinutes +
    " minute" +
    (overdueMinutes === 1 ? "" : "s")
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const title = document.querySelector('[data-testid="test-todo-title"]');
  const description = document.querySelector(
    '[data-testid="test-todo-description"]'
  );
  const status = document.querySelector('[data-testid="test-todo-status"]');
  const dueDate = document.querySelector('[data-testid="test-todo-due-date"]');
  const timeRemaining = document.querySelector(
    '[data-testid="test-todo-time-remaining"]'
  );
  const completeToggle = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]'
  );
  const editButton = document.querySelector(
    '[data-testid="test-todo-edit-button"]'
  );
  const deleteButton = document.querySelector(
    '[data-testid="test-todo-delete-button"]'
  );

  if (
    !card ||
    !title ||
    !description ||
    !status ||
    !dueDate ||
    !timeRemaining ||
    !completeToggle ||
    !editButton ||
    !deleteButton
  ) {
    return;
  }

  let editing = false;

  dueDate.setAttribute("datetime", DUE_DATE.toISOString());
  dueDate.textContent = DUE_DATE.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZoneName: "short",
  });

  timeRemaining.textContent = calculateTimeRemaining();
  timeRemaining.classList.toggle(
    "overdue",
    timeRemaining.textContent.toLowerCase().includes("overdue")
  );

  completeToggle.addEventListener("change", function () {
    const done = completeToggle.checked;
    title.classList.toggle("completed", done);
    status.textContent = done ? "Done" : "In Progress";
  });

  editButton.addEventListener("click", function () {
    editing = !editing;
    title.contentEditable = editing ? "true" : "false";
    description.contentEditable = editing ? "true" : "false";
    title.classList.toggle("editable-field", editing);
    description.classList.toggle("editable-field", editing);
    editButton.textContent = editing ? "Save" : "Edit";

    if (editing) {
      title.focus();
    }
  });

  deleteButton.addEventListener("click", function () {
    const shouldDelete = window.confirm("Delete this task?");
    if (shouldDelete) {
      card.remove();
    }
  });
});
