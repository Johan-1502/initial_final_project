import { setupEventSearch, setupPeopleSearch } from './search.js';
import { setupEventCreate, setupPeopleCreate } from './create.js';
import { setupUpdate, setupDelete, showMessage } from './update_delete.js';
import { showDetails, setupPeopleSelect, addEmployeeToSelectedList, saveChangedEmployees, saveSelectedEmployees } from './details.js';
import { getClientId } from './details.js'

let createClientInput = null;
let editClientInput = null;

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
    editSelectEmployeeButton: document.getElementById('change-pop-up-detail-employees'),
    createSelectClientButton: document.getElementById('create-detail-client'),
    createSelectEmployeeButton: document.getElementById('create-pop-up-detail-employees'),
    popUpEditClient: document.getElementById("edit-client-pop-up-main"),
    popUpEdit: document.getElementById("edit-pop-up-main"),
    popUpCreateClient: document.getElementById("create-client-pop-up-main"),
    popUpCreate: document.getElementById("create-pop-up-main"),
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
  setupClosePopUpHandlers(elements);
  setupOpenPopUpHandlers(elements);
}

function setupClosePopUpHandlers(elements) {
  elements.closeEditClientPopUp.addEventListener('click', () => {
    closePopUp(elements.popUpEditClient);
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

  elements.editSelectEmployeeButton.addEventListener('click', () => {
    openPopUp(elements.popUpEdit);
  });

  elements.createSelectClientButton.addEventListener('click', () => {
    openPopUp(elements.popUpCreateClient);
  });

  elements.createSelectEmployeeButton.addEventListener('click', () => {
    openPopUp(elements.popUpCreate);
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