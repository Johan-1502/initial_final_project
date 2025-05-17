export let selectedPersonDni = null;

export function showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer) {
  const persona = {
    dni: button.getAttribute('data-dni'),
    name: button.getAttribute('data-name'),
    phoneNumber: button.getAttribute('data-phone'),
    address: button.getAttribute('data-address'),
    email: button.getAttribute('data-email'),
  };

  if(window.selectedPersonDni == persona.dni){
    searchContainer.classList.remove('col-md-6');
    searchContainer.classList.add('col-md-12');
    detailContainer.classList.remove('opacity-100');
    detailContainer.classList.add('opacity-0');
    document.querySelector('.edit-delete-person-section').classList.add('d-none');
    window.selectedPersonDni = null;
  }else{
    window.selectedPersonDni = persona.dni;

    detailElementsChange.cc.value = persona.dni;
    detailElementsChange.nombre.value = persona.name;
    detailElementsChange.telefono.value = persona.phoneNumber;
    detailElementsChange.direccion.value = persona.address;
    detailElementsChange.correo.value = persona.email;

    searchContainer.classList.remove('col-md-12');
    searchContainer.classList.add('col-md-6');
    detailContainer.classList.remove('opacity-0');
    detailContainer.classList.add('opacity-100');
    buttonContainer.classList.add('opacity-100');
    buttonContainer.classList.remove('opacity-0');

    document.querySelector('.edit-delete-person-section').classList.remove('d-none');
    document.querySelector('.create-person-section').classList.add('d-none');
  }

  
}

window.showDetails = function(button) {
  const { detailElementsChange, searchContainer, detailContainer, buttonContainer} = window.peopleGlobals;
  showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer);
};