import { showMessage } from "./details.js";

export function setupEventCreate(
  activateCreateButton,
  detailElementsCreate,
  searchContainer,
  buttonContainer,
  detailContainer
) {
  activateCreateButton.addEventListener('click', function () {
    resetEventCreateForm(detailElementsCreate);
    updateUIForEventCreate(searchContainer, buttonContainer, detailContainer);
    loadPlacesAndTypes(detailElementsCreate);
  });
}

function resetEventCreateForm(detailElementsCreate) {
  document.querySelector('.edit-delete-event-section').classList.add('d-none');
  document.querySelector('.create-event-section').classList.remove('d-none');
  console.log(detailElementsCreate);
  detailElementsCreate.selectPlace.innerHTML = "";
  detailElementsCreate.selectType.innerHTML = "";
  detailElementsCreate.client.removeAttribute('style');

  detailElementsCreate.nombre.value = "";
  detailElementsCreate.id.style.display = 'none';
  detailElementsCreate.idLabel.style.display = 'none';
  detailElementsCreate.id.value = "";
  window.selectedEventName = null;
}

function updateUIForEventCreate(searchContainer, buttonContainer, detailContainer) {
  searchContainer.classList.remove('col-md-12');
  searchContainer.classList.add('col-md-6');
  buttonContainer.classList.add('opacity-0');
  buttonContainer.classList.remove('opacity-100');
  detailContainer.classList.remove('opacity-0');
  detailContainer.classList.add('opacity-100');
}

function loadPlacesAndTypes(detailElementsCreate) {
  loadPlaces(detailElementsCreate);
  loadTypes(detailElementsCreate);
}

function loadPlaces(detailElementsCreate) {
  fetch(`/manage_event/places/`)
    .then(response => response.json())
    .then(data => {
      data.places.forEach(place => {
        const option = document.createElement("option");
        option.value = place.id;
        option.textContent = place.name;
        detailElementsCreate.selectPlace.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al filtrar lugares:", error);
    });
}

function loadTypes(detailElementsCreate) {
  fetch(`/manage_event/types/`)
    .then(response => response.json())
    .then(data => {
      data.types.forEach(type => {
        const option = document.createElement("option");
        option.value = type.id;
        option.textContent = type.name;
        detailElementsCreate.selectType.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al filtrar tipos:", error);
    });
}

export function setupPeopleCreate(
  rootContainer,
  detailElementsCreate,
  detailContainer, 
  prefix
) {
  console.log("rootContainer:", rootContainer);
  console.log("rootContainer.innerHTML:", rootContainer.innerHTML);
  console.log("CC Element:", rootContainer.querySelector('.create-detail-cc'));
  
  const resultPersonList = rootContainer.querySelector('.resultPersonList');
  const detailPersonElementsCreate = getDetailPersonElements(rootContainer);
  const activatePeopleCreateButton = rootContainer.querySelector(".activatePeopleCreateButton");
  const desactivatePeopleCreateButton = rootContainer.querySelector(".desactivatePeopleCreateButton");
  
  setupPeopleCreateEventListeners(
    rootContainer, 
    detailPersonElementsCreate, 
    activatePeopleCreateButton, 
    desactivatePeopleCreateButton, 
    detailContainer
  );
  
  setupPersonFormSubmission(
    rootContainer, 
    detailElementsCreate, 
    resultPersonList, 
    prefix
  );
}

function getDetailPersonElements(rootContainer) {
  return {
    cc: rootContainer.querySelector('.create-detail-cc'),
    nombre: rootContainer.querySelector('.create-detail-nombre'),
    telefono: rootContainer.querySelector('.create-detail-telefono'),
    direccion: rootContainer.querySelector('.create-detail-direccion'),
    correo: rootContainer.querySelector('.create-detail-correo'),
  };
}

function setupPeopleCreateEventListeners(
  rootContainer, 
  detailPersonElementsCreate, 
  activatePeopleCreateButton, 
  desactivatePeopleCreateButton, 
  detailContainer
) {
  activatePeopleCreateButton.addEventListener('click', function () {
    activatePeopleCreateMode(rootContainer, detailPersonElementsCreate, activatePeopleCreateButton, desactivatePeopleCreateButton, detailContainer);
  });

  desactivatePeopleCreateButton.addEventListener('click', function () {
    deactivatePeopleCreateMode(rootContainer, detailPersonElementsCreate, activatePeopleCreateButton, desactivatePeopleCreateButton);
  });
}

function activatePeopleCreateMode(rootContainer, detailPersonElementsCreate, activatePeopleCreateButton, desactivatePeopleCreateButton, detailContainer) {
  rootContainer.querySelector('.selected_employees_list').classList.add('d-none');
  rootContainer.querySelector('.create-person-section').classList.remove('d-none');
  rootContainer.querySelector('.create-person-section').classList.add('col-md-6');

  clearPersonFormFields(detailPersonElementsCreate);

  activatePeopleCreateButton.classList.add("d-none");
  desactivatePeopleCreateButton.classList.remove("d-none");

  const searchPeopleContainer = rootContainer.querySelector(".search-people-container");
  searchPeopleContainer.classList.remove('col-md-12');
  searchPeopleContainer.classList.add('col-md-6');
  detailContainer.classList.remove('opacity-0');
  detailContainer.classList.add('opacity-100');
  window.selectedPersonDni = null;
}

function deactivatePeopleCreateMode(rootContainer, detailPersonElementsCreate, activatePeopleCreateButton, desactivatePeopleCreateButton) {
  rootContainer.querySelector('.selected_employees_list').classList.add('d-none');
  rootContainer.querySelector('.create-person-section').classList.add('d-none');
  rootContainer.querySelector('.create-person-section').classList.add('col-md-0');

  clearPersonFormFields(detailPersonElementsCreate);

  activatePeopleCreateButton.classList.remove("d-none");
  desactivatePeopleCreateButton.classList.add("d-none");

  const searchPeopleContainer = rootContainer.querySelector(".search-people-container");
  searchPeopleContainer.classList.remove('col-md-6');
  searchPeopleContainer.classList.add('col-md-12');
  window.selectedPersonDni = null;
}

function clearPersonFormFields(detailPersonElementsCreate) {
  detailPersonElementsCreate.cc.value = "";
  detailPersonElementsCreate.nombre.value = "";
  detailPersonElementsCreate.telefono.value = "";
  detailPersonElementsCreate.direccion.value = "";
  detailPersonElementsCreate.correo.value = "";
}

function setupPersonFormSubmission(rootContainer, detailElementsCreate, resultPersonList, prefix) {
  const formPersona = rootContainer.querySelector('.createPersonForm');
  if (formPersona) {
    formPersona.addEventListener('submit', function (e) {
      handlePersonFormSubmit(e, formPersona, detailElementsCreate, resultPersonList, prefix, rootContainer);
    });
  }
}

function handlePersonFormSubmit(e, formPersona, detailElementsCreate, resultPersonList, prefix, rootContainer) {
  e.preventDefault();
  const formData = new FormData(formPersona);
  formData.append('form_type', 'create_person');

  fetch('add_employee/', {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCookie('csrftoken', rootContainer)
    }
  })
    .then(response => response.json())
    .then(data => {
      handlePersonFormResponse(data, formPersona, detailElementsCreate, resultPersonList, prefix);
    });
}

function handlePersonFormResponse(data, formPersona, detailElementsCreate, resultPersonList, prefix) {
  if (data.success) {
    handlePersonCreationSuccess(data, formPersona, detailElementsCreate, resultPersonList, prefix);
  } else {
    showMessage("danger", "Ocurrió un error al crear la persona: El dni se encuentra asignado a otra persona.");
  }
}

function handlePersonCreationSuccess(data, formPersona, detailElementsCreate, resultPersonList, prefix) {
  showMessage("success", "Se creó la persona con éxito.");
  formPersona.reset();
  const newPersonId = data.new_person_id;

  updateClientSelect(detailElementsCreate, newPersonId);
  updatePersonList(resultPersonList, prefix);
}

function updateClientSelect(detailElementsCreate, newPersonId) {
  detailElementsCreate.client.innerHTML = "";
  fetch('/manage_event/people/')
    .then(response => response.json())
    .then(dataPeople => {
      dataPeople.people.forEach(person => {
        const option = document.createElement("option");
        option.value = person.id;
        option.textContent = person.name;
        if (String(person.id) === String(newPersonId)) {
          option.selected = true;
        }
        detailElementsCreate.client.appendChild(option);
      });
    });
}

function updatePersonList(resultPersonList, prefix) {
  fetch(`/filter-people/?query=`)
    .then(response => response.json())
    .then(data => {
      populatePersonList(data, resultPersonList, prefix);
      selectLastPersonInList(resultPersonList);
    })
    .catch(error => {
      console.error("Error al filtrar personas:", error);
    });
}

function populatePersonList(data, resultPersonList, prefix) {
  resultPersonList.innerHTML = "";
  const isClient = (prefix === 'edit-client' || prefix === 'create-client');
  data.people.forEach(person => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${person.dni} - ${person.name}</span>
      <button class="btn btn-sm btn-outline-primary view-button"
              onclick="addEmployeeToSelectedList(this, ${isClient})"
              data-dni="${person.dni}"
              data-name="${person.name}"
              data-phone="${person.phoneNumber}"
              data-address="${person.address}"
              data-email="${person.email}">
        Seleccionar
      </button>
    `;
    resultPersonList.appendChild(li);
  });
}

function selectLastPersonInList(resultPersonList) {
  const lastListItem = resultPersonList.querySelector('li:last-child');
  if (lastListItem) {
    const lastButton = lastListItem.querySelector('.view-button');
    if (lastButton) {
      lastButton.click();
    }
  }
}

function getCookie(name, rootContainer) {
  let cookieValue = null;
  if (rootContainer.cookie && rootContainer.cookie !== '') {
    const cookies = rootContainer.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}