export function setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken) {
  updateButton.addEventListener('click', function () {
    if (!changeForm.checkValidity()) {
    changeForm.reportValidity();
    return;
  }
    const formData = new FormData(changeForm);
    fetch(`/edit_event/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        detailElementsChange.nombre.value = data.event.name;
        sessionStorage.setItem("successMessage", "Evento actualizado correctamente.");
      } else {
        console.error("Error:", data.error);
      }
    })
    .catch(error => {
      console.error("Error al actualizar el evento:", error);
    });
  });
}

export function setupDelete(deleteButton, changeForm, csrfToken) {
  deleteButton.addEventListener('click', function () {
    const formData = new FormData(changeForm); 
    fetch(`/delete_event/`, {
      method: 'POST',
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    })
    .then(response => {
      sessionStorage.setItem("successMessage", "Evento eliminado correctamente.");
      if (response.ok) {
        location.reload();
      } else {
        alert("Error al eliminar.");
      }
    });
  });
}

export function showMessage(message, type = "success") {
  const container = document.querySelector(".messages");
  if (!container) return;

  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.innerText = message;

  container.appendChild(alert);
}
