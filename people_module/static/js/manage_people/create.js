
export function setupCreate(activateCreateButton, detailElementsCreate, searchContainer, buttonContainer, detailContainer, selectedPersonDni) {
  activateCreateButton.addEventListener('click', function() {
    document.querySelector('.edit-delete-person-section').classList.add('d-none');
    document.querySelector('.create-person-section').classList.remove('d-none');
    detailElementsCreate.cc.readOnly = false;
    detailElementsCreate.cc.value = "";
    detailElementsCreate.nombre.value = "";
    detailElementsCreate.telefono.value = "";
    detailElementsCreate.direccion.value = "";
    detailElementsCreate.correo.value = "";
    searchContainer.classList.remove('col-md-12');
    searchContainer.classList.add('col-md-6');
    buttonContainer.classList.add('opacity-0');
    buttonContainer.classList.remove('opacity-100');
    detailContainer.classList.remove('opacity-0');
    detailContainer.classList.add('opacity-100');
    window.selectedPersonDni = null;
  });
}