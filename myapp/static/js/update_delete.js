export function setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken) {
  updateButton.addEventListener('click', function () {
    if (!changeForm.checkValidity()) {
    changeForm.reportValidity();
    return;
  }
    const formData = new FormData(changeForm);
    fetch(`/edit_person/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        detailElementsChange.cc.value = data.person.dni;
        detailElementsChange.nombre.value = data.person.name;
        detailElementsChange.telefono.value = data.person.phoneNumber;
        detailElementsChange.direccion.value = data.person.address;
        detailElementsChange.correo.value = data.person.email;
        sessionStorage.setItem("successMessage", "Persona actualizada correctamente.");
      } else {
        console.error("Error:", data.error);
      }
    })
    .catch(error => {
      console.error("Error al actualizar la persona:", error);
    });
  });
}

export function setupDelete(deleteButton, changeForm, csrfToken) {
  deleteButton.addEventListener('click', function () {
    const formData = new FormData(changeForm); 
    fetch(`/delete_person/`, {
      method: 'POST',
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    })
    .then(response => {
      sessionStorage.setItem("successMessage", "Persona eliminada correctamente.");
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
