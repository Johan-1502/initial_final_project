export let editClientInput = null;

import { setupEventSearch, setupPeopleSearch } from './search.js';
import { setupEventCreate, setupPeopleCreate } from './create.js';
import { setupUpdate, setupDelete, showMessage } from './update_delete.js';
import { showDetails, setupPeopleSelect, addEmployeeToSelectedList, saveChangedEmployees, saveSelectedEmployees } from './details.js';
import { getClientId } from './details.js'

let createClientInput = null;

document.addEventListener("DOMContentLoaded", () => {
  handleSessionMessage();
});

window.addEventListener('DOMContentLoaded', () => {
  initializeEventManagement();
});

function handleSessionMessage() {
  const message = sessionStorage.getItem("successMessage");
  if (message) {
    showMessage(message, "success");
    sessionStorage.removeItem("successMessage");
  }
}

function initializeEventManagement() {
  const elements = getDOMElements();
  const detailElements = getDetailElements();
  const csrfToken = getCSRFToken();

  setupEventDetailsHandler(elements.detailElementsChange, elements.searchContainer, elements.detailContainer, elements.buttonContainer);
  setupCreateButtonsHandlers(elements);
  setupPopUpHandlers(elements);
  setupAllFunctionalities(elements, detailElements, csrfToken);
}

function getDOMElements() {
  createClientInput = document.getElementById('create-id-client');
  editClientInput = document.getElementById('change-id-client');

  return {
    resultsList: document.getElementById('resultsList'),
    searchInput: document.getElementById('searchInput'),
    searchPersonInput: document.getElementById('searchPersonInput'),
    updateButton: document.getElementById('update-button'),
    changeForm: document.getElementById('changeForm'),
    activateCreateButton: document.getElementById("activateEventCreateButton"),
    activatePeopleCreateButton: document.getElementById("activatePeopleCreateButton"),
    buttonContainer: document.getElementById("event-button-container"),
    searchContainer: document.getElementById("search-container"),
    desactivatePeopleCreateButton: document.getElementById("desactivatePeopleCreateButton"),
    detailContainer: document.getElementById("detail-container"),
    deleteButton: document.getElementById("delete-button"),
    editSelectClientButton: document.getElementById('change-detail-client'),
    changePlaceButton: document.getElementById('change-place'),
    createPlaceButton: document.getElementById('create-place'),
    editSelectEmployeeButton: document.getElementById('change-pop-up-detail-employees'),
    createSelectClientButton: document.getElementById('create-detail-client'),
    createSelectEmployeeButton: document.getElementById('create-pop-up-detail-employees'),
    showReportButton: document.getElementById('change-pop-up-report'),
    closeReportButton: document.getElementById('close-pop-up-report'),
    exportReportButton: document.getElementById('export-pdf-btn'),
    popUpEditClient: document.getElementById("edit-client-pop-up-main"),
    popUpEdit: document.getElementById("edit-pop-up-main"),
    popUpCreateClient: document.getElementById("create-client-pop-up-main"),
    popUpCreate: document.getElementById("create-pop-up-main"),
    popUpReport: document.getElementById("pop-up-report"),
    editPopUpPlace: document.getElementById("edit-pop-up-place"),
    createPopUpPlace: document.getElementById("create-pop-up-place"),
    closeEditClientPopUp: document.getElementById("close-edit-client-pop-up"),
    closeEditPopUp: document.getElementById("close-edit-pop-up"),
    closeCreateClientPopUp: document.getElementById("close-create-client-pop-up"),
    closeCreatePopUp: document.getElementById("close-create-pop-up"),
    confirmEditClientPopUp: document.getElementById("confirm-edit-client-pop-up"),
    confirmEditPopUp: document.getElementById("confirm-edit-pop-up"),
    confirmCreateClientPopUp: document.getElementById("confirm-create-client-pop-up"),
    confirmCreatePopUp: document.getElementById("confirm-create-pop-up"),
    detailElementsCreate: getCreateDetailElements(),
    detailElementsChange: getChangeDetailElements()
  };
}

function getDetailElements() {
  const detailElementsCreate = getCreateDetailElements();
  const detailElementsChange = getChangeDetailElements();

  logCreateElements(detailElementsCreate);

  return {
    create: detailElementsCreate,
    change: detailElementsChange
  };
}

function getCreateDetailElements() {
  return {
    nombre: document.getElementById('create-detail-nombre'),
    idLabel: document.getElementById('create-label-id'),
    fechaInicio: document.getElementById('create-detail-fecha-inicio'),
    fechaFin: document.getElementById('create-detail-fecha-fin'),
    id: document.getElementById('create-detail-id'),
    client: document.getElementById('create-detail-client'),
    selectPlace: document.getElementById('create-selectPlace'),
    selectType: document.getElementById('create-selectType'),
    createTypeButton: document.getElementById('create-type'),
    typeWritten: document.getElementById('create-write-type'),
    idClient: document.getElementById('create-id-client'),
  };
}

function getChangeDetailElements() {
  return {
    nombre: document.getElementById('change-detail-nombre'),
    fechaInicio: document.getElementById('change-detail-fecha-inicio'),
    fechaFin: document.getElementById('change-detail-fecha-fin'),
    id: document.getElementById('change-detail-id'),
    client: document.getElementById('change-detail-client'),
    selectPlace: document.getElementById('change-selectPlace'),
    selectType: document.getElementById('change-selectType'),
    createTypeButton: document.getElementById('change-type'),
    typeWritten: document.getElementById('change-write-type'),
    idClient: document.getElementById('change-id-client'),
    employees: document.getElementById('change-pop-up-detail-employees'),
  };
}

function logCreateElements(detailElementsCreate) {
  console.log("Elemento selectPlace (create):", detailElementsCreate.selectPlace);
  console.log('idLabel', detailElementsCreate.idLabel);
}

function getCSRFToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function setupEventDetailsHandler(detailElementsChange, searchContainer, detailContainer, buttonContainer) {
  window.showEventDetails = (button) => {
    console.log("Datos:" + button.getAttribute("data-name"));
    showDetails(
      button,
      detailElementsChange,
      searchContainer,
      detailContainer,
      buttonContainer
    );
  };
}

function setupPopUpHandlers(elements) {
  setupFormPlace(elements.editPopUpPlace, document.getElementById('edit-form-place'), elements.detailElementsChange);
  setupFormPlace(elements.createPopUpPlace, document.getElementById('create-form-place'), elements.detailElementsCreate);
  setupClosePopUpHandlers(elements);
  setupOpenPopUpHandlers(elements);
}

function setupCreateButtonsHandlers(elements) {

  elements.detailElementsChange.createTypeButton.addEventListener('click', () => {
    if (elements.detailElementsChange.createTypeButton.classList.contains('btn-icon-plus-blue')) {
      elements.detailElementsChange.createTypeButton.classList.remove("btn-icon-plus-blue");
      elements.detailElementsChange.createTypeButton.classList.add("btn-icon-plus-red");
      elements.detailElementsChange.createTypeButton.textContent = 'x';
      elements.detailElementsChange.selectType.classList.add("d-none");
      elements.detailElementsChange.typeWritten.classList.remove("d-none");
      elements.detailElementsChange.typeWritten.required = true;
      elements.detailElementsChange.typeWritten.focus();
    }else{
      elements.detailElementsChange.createTypeButton.classList.add("btn-icon-plus-blue");
      elements.detailElementsChange.createTypeButton.classList.remove("btn-icon-plus-red");
      elements.detailElementsChange.createTypeButton.textContent = '+';
      elements.detailElementsChange.typeWritten.textContent = "";
      elements.detailElementsChange.typeWritten.required = false;
      elements.detailElementsChange.typeWritten.classList.add("d-none");
      elements.detailElementsChange.selectType.classList.remove("d-none");
      elements.detailElementsChange.selectType.focus();
    }
  });

  elements.detailElementsCreate.createTypeButton.addEventListener('click', () => {
    if (elements.detailElementsCreate.createTypeButton.classList.contains('btn-icon-plus-blue')) {
      elements.detailElementsCreate.createTypeButton.classList.remove("btn-icon-plus-blue");
      elements.detailElementsCreate.createTypeButton.classList.add("btn-icon-plus-red");
      elements.detailElementsCreate.createTypeButton.textContent = 'x';
      elements.detailElementsCreate.selectType.classList.add("d-none");
      elements.detailElementsCreate.typeWritten.classList.remove("d-none");
      elements.detailElementsCreate.typeWritten.required = true;
      elements.detailElementsCreate.typeWritten.focus();
    }else{
      elements.detailElementsCreate.createTypeButton.classList.add("btn-icon-plus-blue");
      elements.detailElementsCreate.createTypeButton.classList.remove("btn-icon-plus-red");
      elements.detailElementsCreate.createTypeButton.textContent = '+';
      elements.detailElementsCreate.typeWritten.textContent = "";
      elements.detailElementsCreate.typeWritten.required = false;
      elements.detailElementsCreate.typeWritten.classList.add("d-none");
      elements.detailElementsCreate.selectType.classList.remove("d-none");
      elements.detailElementsCreate.selectType.focus();
    }
  });

}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
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

function setupFormPlace(popUp, form, detailElements) {
  const formPlace = form;
  if (formPlace) {
    formPlace.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(formPlace);

      fetch('add_place/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': getCookie('csrftoken')
        }
      })
        .then(response => response.json())
        .then(placeSent => {
          const place = document.createElement("option");
          place.value = placeSent.id;
          place.textContent = placeSent.name;
          console.log("lugar creado: " + placeSent.id + placeSent.name)
          while (detailElements.selectPlace.firstChild) {
            detailElements.selectPlace.removeChild(detailElements.selectPlace.firstChild);
          }
          detailElements.selectPlace.appendChild(place);
          fetch(`/manage_event/places/`)
            .then(response => response.json())
            .then(data => {
              data.places.forEach(place => {
                if (!(place.name == placeSent.name)) {
                  console.log("lugar enviado: " + place.id + place.name)
                  const option = document.createElement("option");
                  option.value = place.id;
                  option.textContent = place.name;
                  detailElements.selectPlace.appendChild(option);
                }
              });
            })
            .catch(error => {
              console.error("Error al filtrar eventos:", error);
            });
        });
      console.log("Metodo finalizado")
      closePopUp(popUp);
    });

  }
}

function setupClosePopUpHandlers(elements) {
  elements.closeEditClientPopUp.addEventListener('click', () => {
    closePopUp(elements.popUpEditClient);
  });

  elements.closeReportButton.addEventListener('click', () => {
    closePopUp(elements.popUpReport);
  });

  elements.closeEditPopUp.addEventListener('click', () => {
    closePopUp(elements.popUpEdit);
  });

  elements.closeCreateClientPopUp.addEventListener('click', () => {
    closePopUp(elements.popUpCreateClient);
  });

  elements.closeCreatePopUp.addEventListener('click', () => {
    closePopUp(elements.popUpCreate);
  });

  elements.confirmEditClientPopUp.addEventListener('click', () => {
    console.log("cerrando popup de editar cliente");
    console.log(getClientId());
    editClientInput.value = getClientId();
    console.log(editClientInput.value);
    closePopUp(elements.popUpEditClient);
  });

  elements.confirmEditPopUp.addEventListener('click', () => {
    saveChangedEmployees();
    closePopUp(elements.popUpEdit);
  });

  elements.confirmCreateClientPopUp.addEventListener('click', () => {
    console.log(createClientInput);
    console.log(getClientId());
    createClientInput.value = getClientId();
    closePopUp(elements.popUpCreateClient);
  });

  elements.confirmCreatePopUp.addEventListener('click', () => {
    saveSelectedEmployees();
    closePopUp(elements.popUpCreate);
  });
}

function setupOpenPopUpHandlers(elements) {
  elements.editSelectClientButton.addEventListener('click', () => {
    openPopUp(elements.popUpEditClient);
  });

  elements.changePlaceButton.addEventListener('click', () => {
    openPopUp(elements.editPopUpPlace);
  });

  elements.createPlaceButton.addEventListener('click', () => {
    openPopUp(elements.createPopUpPlace);
  });

  elements.editSelectEmployeeButton.addEventListener('click', () => {
    openPopUp(elements.popUpEdit);
  });

  elements.createSelectClientButton.addEventListener('click', () => {
    openPopUp(elements.popUpCreateClient);
  });

  elements.createSelectEmployeeButton.addEventListener('click', () => {
    openPopUp(elements.popUpCreate);
  });

  elements.exportReportButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Informe de Nómina', 14, 20);

    const fecha = document.getElementById('fecha-actual').textContent;
    const evento = document.getElementById('evento-nombre').textContent;
    const cliente = document.getElementById('cliente-nombre').textContent;
    doc.setFontSize(12);
    doc.text(`Fecha de informe: ${fecha}`, 14, 30);
    doc.text(`Evento: ${evento}`, 14, 38);
    doc.text(`Cliente: ${cliente}`, 14, 46);

    doc.autoTable({
      html: '#report-table',
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [0, 157, 204] }
    });

    doc.save('informe_nomina.pdf');
  });

  elements.showReportButton.addEventListener('click', () => {
    console.log("Mostrando reporte");
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('fecha-actual').textContent =
      fecha.toLocaleDateString('es-ES', opciones);

    const idEvent = document.getElementById('change-detail-id').value;
    console.log("ID del evento:", idEvent);

    const nameEvent = document.getElementById('change-detail-nombre').value;
    document.getElementById('evento-nombre').textContent = nameEvent;

    const nameClient = document.getElementById('change-detail-client').textContent.trim();
    document.getElementById('cliente-nombre').textContent = nameClient;

    const tbody = document.querySelector('#report-table tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
    fetch(`/manage_event/event_report/?id=${idEvent}`)
      .then(response => response.json())
      .then(data => {
        data.employees.forEach(employee => {
          const newRow = document.createElement('tr');
          // Formatear el salario como número con separador de miles y dos decimales
          const formattedSalary = Number(employee.salary).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          newRow.innerHTML = `
        <td>${employee.id}</td>
        <td>${employee.name}</td>
        <td>${employee.role}</td>
        <td>${formattedSalary}</td>
        `;
          tbody.appendChild(newRow);
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });


    openPopUp(elements.popUpReport);
  });
}

function closePopUp(popUpElement) {
  popUpElement.classList.add("d-none");
}

function openPopUp(popUpElement) {
  popUpElement.classList.remove("d-none");
}


function setupAllFunctionalities(elements, detailElements, csrfToken) {
  setupSearchFunctionalities(elements);
  setupEventCreateFunctionality(elements, detailElements);
  setupUpdateDeleteFunctionalities(elements, detailElements, csrfToken);
  setupPeopleCreateFunctionalities(elements, detailElements);
}

function setupSearchFunctionalities(elements) {
  setupEventSearch(elements.resultsList, elements.searchInput);
  setupPeopleSearch(elements.popUpEditClient, "edit-client");
  setupPeopleSearch(elements.popUpEdit, "edit");
  setupPeopleSearch(elements.popUpCreateClient, "create-client");
  setupPeopleSearch(elements.popUpCreate, "create");
}

function setupEventCreateFunctionality(elements, detailElements) {
  setupEventCreate(
    elements.activateCreateButton,
    detailElements.create,
    elements.searchContainer,
    elements.buttonContainer,
    elements.detailContainer
  );
}

function setupUpdateDeleteFunctionalities(elements, detailElements, csrfToken) {
  setupUpdate(
    elements.updateButton,
    elements.changeForm,
    detailElements.change,
    csrfToken
  );

  setupDelete(
    elements.deleteButton,
    elements.changeForm,
    csrfToken
  );
}

function setupPeopleCreateFunctionalities(elements, detailElements) {
  setupPeopleCreate(
    elements.popUpEditClient,
    detailElements.create,
    elements.detailContainer,
    "edit-client"
  );

  setupPeopleCreate(
    elements.popUpEdit,
    detailElements.create,
    elements.detailContainer,
    "edit"
  );

  setupPeopleCreate(
    elements.popUpCreateClient,
    detailElements.create,
    elements.detailContainer,
    "create-client"
  );

  setupPeopleCreate(
    elements.popUpCreate,
    detailElements.create,
    elements.detailContainer,
    "create"
  );
  setupPeopleSelect(elements.popUpEditClient);
  setupPeopleSelect(elements.popUpEdit);
  setupPeopleSelect(elements.popUpCreateClient);
  setupPeopleSelect(elements.popUpCreate);
}