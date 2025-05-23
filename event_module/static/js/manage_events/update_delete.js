export function setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken) {
  updateButton.addEventListener('click', function () {
    handleUpdateClick(changeForm, detailElementsChange, csrfToken);
  });
}

function handleUpdateClick(changeForm, detailElementsChange, csrfToken) {
  if (!validateForm(changeForm)) {
    return;
  }
  
  const formData = new FormData(changeForm);
  performUpdateRequest(formData, detailElementsChange, csrfToken);
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

export function showMessage(message, type = "success") {
  const container = getMessageContainer();
  if (!container) return;

  const alert = createMessageAlert(message, type);
  container.appendChild(alert);
}

function getMessageContainer() {
  return document.querySelector(".messages");
}

function createMessageAlert(message, type) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.innerText = message;
  return alert;
}