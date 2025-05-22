export let selectedEventName = null;

export function showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer) {
  console.log(button.getAttribute("data-date"));
  
  const event = extractEventDataFromButton(button);

  if (window.selectedEventName == event.name) {
    hideEventDetails(searchContainer, detailContainer, buttonContainer);
  } else {
    showEventDetails(event, detailElementsChange, searchContainer, detailContainer, buttonContainer);
  }
}

function extractEventDataFromButton(button) {
  return {
    name: button.getAttribute('data-name'),
    startDate: button.getAttribute('data-start-date'),
    endDate: button.getAttribute('data-end-date'),
    place: button.getAttribute('data-place'),
    type: button.getAttribute('data-type'),
    placeId: button.getAttribute('data-place-id'),
    typeId: button.getAttribute('data-type-id'),
    id: button.getAttribute('data-id'),
    client: button.getAttribute('data-client'),
  };
}

function hideEventDetails(searchContainer, detailContainer, buttonContainer) {
  searchContainer.classList.remove('col-md-6');
  searchContainer.classList.add('col-md-12');
  detailContainer.classList.remove('opacity-100');
  detailContainer.classList.add('opacity-0');
  buttonContainer.classList.add('opacity-100');
  buttonContainer.classList.remove('opacity-0');
  document.querySelector('.edit-delete-event-section').classList.add('d-none');
  document.querySelector('.create-event-section').classList.add('d-none');
  window.selectedEventName = null;
}

function showEventDetails(event, detailElementsChange, searchContainer, detailContainer, buttonContainer) {
  window.selectedEventName = event.name;
  
  populateEventForm(event, detailElementsChange);
  loadPlacesAndTypesForEdit(event, detailElementsChange);
  updateUIForEventDetails(searchContainer, detailContainer, buttonContainer);
}

function populateEventForm(event, detailElementsChange) {
  detailElementsChange.nombre.value = event.name;
  detailElementsChange.fechaInicio.value = event.startDate;
  detailElementsChange.fechaFin.value = event.endDate;
  detailElementsChange.id.value = event.id;
  
  clearAndSetInitialSelects(event, detailElementsChange);
}

function clearAndSetInitialSelects(event, detailElementsChange) {
  // Limpia los selects antes de agregar la opción actual
  detailElementsChange.selectPlace.innerHTML = "";
  detailElementsChange.selectType.innerHTML = "";
  
  setInitialPlaceOption(event, detailElementsChange);
  setInitialTypeOption(event, detailElementsChange);
}

function setInitialPlaceOption(event, detailElementsChange) {
  const place = document.createElement("option");
  place.value = event.placeId;
  place.textContent = event.place;
  detailElementsChange.selectPlace.appendChild(place);
}

function setInitialTypeOption(event, detailElementsChange) {
  const type = document.createElement("option");
  type.value = event.typeId;
  type.textContent = event.type;
  detailElementsChange.selectType.appendChild(type);
}

function loadPlacesAndTypesForEdit(event, detailElementsChange) {
  loadRemainingPlaces(event, detailElementsChange);
  loadRemainingTypes(event, detailElementsChange);
}

function loadRemainingPlaces(event, detailElementsChange) {
  fetch(`/manage_event/places/`)
    .then(response => response.json())
    .then(data => {
      data.places.forEach(place => {
        if (!(place.name == event.place)) {
          const option = document.createElement("option");
          option.value = place.id;
          option.textContent = place.name;
          detailElementsChange.selectPlace.appendChild(option);
        }
      });
    })
    .catch(error => {
      console.error("Error al filtrar eventos:", error);
    });
}

function loadRemainingTypes(event, detailElementsChange) {
  fetch(`/manage_event/types/`)
    .then(response => response.json())
    .then(data => {
      data.types.forEach(type => {
        if (!(type.name == event.type)) {
          const option = document.createElement("option");
          option.value = type.id;
          option.textContent = type.name;
          detailElementsChange.selectType.appendChild(option);
        }
      });
    })
    .catch(error => {
      console.error("Error al filtrar eventos:", error);
    });
}

function updateUIForEventDetails(searchContainer, detailContainer, buttonContainer) {
  searchContainer.classList.remove('col-md-12');
  searchContainer.classList.add('col-md-6');
  detailContainer.classList.remove('opacity-0');
  detailContainer.classList.add('opacity-100');
  buttonContainer.classList.add('opacity-100');
  buttonContainer.classList.remove('opacity-0');
  document.querySelector('.create-event-section').classList.add('d-none');
  document.querySelector('.edit-delete-event-section').classList.remove('d-none');
}

export function addEmployeeToSelectedList(button, clientValidation) {
  const container = button.closest("#pop-up-container");
  const employeeData = extractEmployeeDataFromButton(button);
  
  updatePeopleCreateButtons(container);
  
  if (checkIfEmployeeExists(container, employeeData.dni)) {
    handleEmployeeAlreadyExists(container, button);
    return;
  }

  if (checkClientValidationLimit(container, clientValidation)) {
    handleClientLimitExceeded(container, button);
    return;
  }

  createAndAddEmployeeToList(container, employeeData, button);
}

function extractEmployeeDataFromButton(button) {
  return {
    dni: button.getAttribute('data-dni'),
    name: button.getAttribute('data-name')
  };
}

function updatePeopleCreateButtons(container) {
  const desactivatePeopleCreateButton = container.querySelector(".desactivatePeopleCreateButton");
  const activatePeopleCreateButton = container.querySelector(".activatePeopleCreateButton");
  desactivatePeopleCreateButton.classList.add("d-none");
  activatePeopleCreateButton.classList.remove("d-none");
}

function checkIfEmployeeExists(container, dni) {
  const ul = container.querySelector('.selected-employees-list');
  return Array.from(ul.querySelectorAll('li span')).some(span => {
    return span.textContent.startsWith(`${dni} -`);
  });
}

function handleEmployeeAlreadyExists(container, button) {
  adjustUIForSelectedEmployees(container, button);
  showMessage("danger", "Esta persona ya ha sido añadida.");
}

function checkClientValidationLimit(container, clientValidation) {
  const ul = container.querySelector('.selected-employees-list');
  const currentCount = ul.querySelectorAll('li').length;
  return clientValidation && currentCount === 1;
}

function handleClientLimitExceeded(container, button) {
  adjustUIForSelectedEmployees(container, button);
  showMessage("danger", "Solo puede seleccionar un cliente, primero debe eliminar al cliente ya asignado.");
}

function adjustUIForSelectedEmployees(container, button) {
  container.querySelector('.selected_employees_list').classList.remove('d-none');
  container.querySelector('.selected_employees_list').classList.add('col-md-6');
  const searchPeopleContainer = button.closest(".search-people-container");
  searchPeopleContainer.classList.add('col-md-6');
  searchPeopleContainer.classList.remove('col-md-12');
  container.querySelector('.create-person-section').classList.add('d-none');
}

function createAndAddEmployeeToList(container, employeeData, button) {
  const ul = container.querySelector('.selected-employees-list');
  const li = createEmployeeListItem(employeeData, button);
  ul.appendChild(li);
  searchWidthAdjust(button);
}

function createEmployeeListItem(employeeData, button) {
  const li = document.createElement('li');
  li.className = 'selected-employees list-group-item d-flex justify-content-between align-items-center';

  const span = createEmployeeSpan(employeeData);
  const div = createEmployeeControls(button);

  li.appendChild(span);
  li.appendChild(div);

  return li;
}

function createEmployeeSpan(employeeData) {
  const span = document.createElement('span');
  span.textContent = `${employeeData.dni} - ${employeeData.name}`;
  return span;
}

function createEmployeeControls(button) {
  const div = document.createElement('div');
  div.className = "d-flex align-items-center";
  
  const select = createRoleSelect();
  const deleteBtn = createDeleteButton(button);
  
  div.appendChild(select);
  div.appendChild(deleteBtn);
  
  return div;
}

function createRoleSelect() {
  const select = document.createElement('select');
  select.name = "typeEvent";
  select.className = "little-form mb-2";

  loadRolesIntoSelect(select);
  
  return select;
}

function loadRolesIntoSelect(select) {
  fetch('/manage_event/roles/')
    .then(response => response.json())
    .then(data => {
      data.roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar roles:", error);
    });
}

function createDeleteButton(button) {
  const deleteBtn = document.createElement('button');
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark fa-beat"></i>`;
  deleteBtn.onclick = function() {
    const li = deleteBtn.closest('li');
    if (li) li.remove();
    searchWidthAdjust(button);
  };
  return deleteBtn;
}

function searchWidthAdjust(button) {
  const container = button.closest("#pop-up-container");
  const searchPeopleContainer = button.closest(".search-people-container");
  const ul = container.querySelector('.selected-employees-list');
  const items = ul.querySelectorAll('li').length;
  
  adjustSearchContainerWidth(searchPeopleContainer, items);
  adjustSelectedEmployeesListVisibility(container, items);
}

function adjustSearchContainerWidth(searchPeopleContainer, items) {
  searchPeopleContainer.classList.remove('col-md-6', 'col-md-12');
  if (items > 0) {
    searchPeopleContainer.classList.add('col-md-6');
  } else {
    searchPeopleContainer.classList.add('col-md-12');
  }
}

function adjustSelectedEmployeesListVisibility(container, items) {
  const selectedEmployeesList = container.querySelector('.selected_employees_list');
  const createPersonSection = container.querySelector('.create-person-section');
  
  if (items > 0) {
    selectedEmployeesList.classList.remove('d-none');
    selectedEmployeesList.classList.add('col-md-6');
    createPersonSection.classList.add('d-none');
  } else {
    selectedEmployeesList.classList.add('d-none');
    selectedEmployeesList.classList.remove('col-md-6');
  }
}

// Llenar el select con roles desde la base de datos
function showRoles(button) {
  const container = button.closest("#pop-up-container");
  const select = button.parentElement.querySelector('select');
  
  fetch('manage_event/roles/')
    .then(response => response.json())
    .then(data => {
      populateRoleSelect(select, data.roles);
      select.focus();
    })
    .catch(error => {
      console.error("Error al cargar roles:", error);
    });
}

function populateRoleSelect(select, roles) {
  select.innerHTML = '';
  roles.forEach(role => {
    const option = document.createElement('option');
    option.value = role.id;
    option.textContent = role.nombre;
    select.appendChild(option);
  });
}

// Eliminar persona de la lista
function deletePersonFromList(button) {
  const li = button.closest('li');
  if (li) li.remove();
  console.log("Eliminando, ajustando ancho...");
  searchWidthAdjust(button);
}

export function showMessage(type, text, duration = 3000) {
  const container = document.getElementById("js-messages-container");
  if (!container) return;

  const alert = createMessageAlert(type, text);
  container.appendChild(alert);

  scheduleMessageRemoval(alert, duration);
}

function createMessageAlert(type, text) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = text;
  return alert;
}

function scheduleMessageRemoval(alert, duration) {
  setTimeout(() => {
    alert.remove();
  }, duration);
}

// Window object assignments
window.showMessage = showMessage;
window.deletePersonFromList = deletePersonFromList;
window.showRoles = showRoles;
window.addEmployeeToSelectedList = addEmployeeToSelectedList;

window.showEventDetails = function (button) {
  const { detailElementsChange, searchContainer, detailContainer, buttonContainer } = window.eventGlobals;
  showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer);
};