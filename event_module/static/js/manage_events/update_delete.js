export function setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken) {
  updateButton.addEventListener('click', function (event) {
    handleUpdateClick(changeForm, detailElementsChange, csrfToken, event);
  });
}

function handleUpdateClick(changeForm, detailElementsChange, csrfToken, event) {

  if (!validateForm(changeForm)) {
    return;
  }
  const startDateInput = document.getElementById('change-detail-fecha-inicio');
  const endDateInput = document.getElementById('change-detail-fecha-fin');

  const employeesInput = document.getElementById('change-employees');
  const clientInput = document.getElementById('change-detail-client');

  //let employees = [];
  //try {
  //  employees = JSON.parse(employeesInput.value);
  //} catch (e) {
  //  employees = [];
  //}
  //if (!Array.isArray(employees) || employees.length === 0) {
  //  event.preventDefault();
  //  showMessage("Debe seleccionar al menos un empleado.", "danger");
  //  return;
  //}
  //console.log("change-employees", employeesInput.value);

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (startDate && endDate && startDate > endDate) {
    event.preventDefault();
    showMessage("La fecha de inicio del evento debe ser anterior a la fecha de finalización", "danger");
    endDateInput.focus();
  } else {
    const formData = new FormData(changeForm);
    performUpdateRequest(formData, detailElementsChange, csrfToken);
  }


}

function validateForm(changeForm) {
  if (!changeForm.checkValidity()) {
    changeForm.reportValidity();
    return false;
  }
  return true;
}

function performUpdateRequest(formData, detailElementsChange, csrfToken) {


  fetch(`/manage_event/edit_event/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      handleUpdateResponse(data, detailElementsChange);
    })
    .catch(error => {
      handleUpdateError(error);
      createMessageAlert("AAAAAAAAAAA", "success")
    });
}

function handleUpdateResponse(data, detailElementsChange) {
  if (data.success) {
    handleUpdateSuccess(data, detailElementsChange);
  } else {
    handleUpdateFailure(data);
  }
}

function handleUpdateSuccess(data, detailElementsChange) {
  detailElementsChange.nombre.value = data.event.name;
  sessionStorage.setItem("successMessage", "Evento actualizado correctamente.");
}

function handleUpdateFailure(data) {
  console.error("Error:", data.error);
}

function handleUpdateError(error) {
  console.error("Error al actualizar el evento:", error);
}

export function setupDelete(deleteButton, changeForm, csrfToken) {
  deleteButton.addEventListener('click', function () {
    handleDeleteClick(changeForm, csrfToken);
  });
}

function handleDeleteClick(changeForm, csrfToken) {
  const formData = new FormData(changeForm);
  performDeleteRequest(formData, csrfToken);
}

function performDeleteRequest(formData, csrfToken) {
  fetch(`/manage_event/delete_event/`, {
    method: 'POST',
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: formData,
  })
    .then(response => {
      handleDeleteResponse(response);
    })
    .catch(error => {
      handleDeleteError(error);
    });
}

function handleDeleteResponse(response) {
  sessionStorage.setItem("successMessage", "Evento eliminado correctamente.");

  if (response.ok) {
    handleDeleteSuccess();
  } else {
    handleDeleteFailure();
  }
}

function handleDeleteSuccess() {
  location.reload();
}

function handleDeleteFailure() {
  alert("Error al eliminar.");
}

function handleDeleteError(error) {
  console.error("Error al eliminar el evento:", error);
  alert("Error al eliminar el evento.");
}

export function showMessage(type, text, duration = 3000) {
  const container = document.getElementById("js-messages-container");
  if (!container) return;

  const alert = createMessageAlert(type, text);
  container.appendChild(alert);

  scheduleMessageRemoval(alert, duration);
}

function scheduleMessageRemoval(alert, duration) {
  setTimeout(() => {
    alert.remove();
  }, duration);
}

function createMessageAlert(message, type) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.innerText = message;
  return alert;
}