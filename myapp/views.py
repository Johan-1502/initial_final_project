from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from .forms import InputPersonData, SearchPerson, UpdatePersonForm
from . import services
from .models import Person
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.


def index(request):
    return render(request, "people.html")


def create_person(request):
    if request.method == "GET":
        return render(request, "create-people.html", {"form": InputPersonData()})
    else:
        services.createPerson(request)
        people = services.getAllPeople()
        return render(request, "search_person.html", {"people": people})


def search_person(request):
    if request.method == "GET":
        people = services.getAllPeople()
        return render(request, "search_person.html",  {"people": people})
    else:
        people = services.searchPerson(request.POST["dni"])
        return render(request, "search_person.html", {"people": people})

def search_person_to_edit(request):
    if request.method == "GET":
        people = services.getAllPeople()
        return render(request, "edite-people.html",  {"people": people})
    else:
        people = services.searchPerson(request.POST["dni"])
        return render(request, "edite-people.html", {"people": people})

def search_person_to_delete(request):
    if request.method == "GET":
        people = services.getAllPeople()
        return render(request, "delete_people.html",  {"people": people})
    else:
        people = services.searchPerson(request.POST["dni"])
        return render(request, "delete_people.html", {"people": people})


def show_people(request):
    people = services.getAllPeople()
    return render(request, "people.html", {"people": people})


def delete_person_by_id(request, id):
    print(id)
    services.deletePerson(id)
    people = services.getAllPeople()
    return render(request, "delete_people.html", {"people": people})


def delete_person_by_dni(request):
    if request.method == "GET":
        people = services.getAllPeople()
        return render(request, "delete_people.html", {"people": people})
    else:
        services.deletePerson(request.POST["dni"])
        people = services.getAllPeople()
        return render(request, "show_people.html", {"people": people})


def edit_person(request):
    if request.method == "GET":
        people = Person.objects.filter(isVisible=True)  # Obtiene todas las personas visibles
        return render(request, "edite-people.html", {"people": people, "form": UpdatePersonForm()})

    elif request.method == "POST":
        dni = request.POST.get("dni")
        person = get_object_or_404(Person, dni=dni)  # Buscar la persona por su DNI
        form = UpdatePersonForm(request.POST, instance=person)

        if form.is_valid():
            form.save()  # Guardar los cambios en la base de datos
            people = Person.objects.filter(isVisible(True))  # Actualizar la lista de personas
            return render(request, "edite-people.html", {"people": people, "form": form, "success": True})
        else:
            people = Person.objects.filter(isVisible=True)
            return render(request, "edite-people.html", {"people": people, "form": form, "error": True})


def get_person(request, dni):
    try:
        person = services.getPersonById(dni)  # Obtiene la persona por DNI
        data = {
            "name": person.name,
            "dni": person.dni,
            "phoneNumber": person.phoneNumber,
            "address": person.address,
            "email": person.email,
        }
        return JsonResponse(data)
    except Person.DoesNotExist:
        return JsonResponse({"error": "Persona no encontrada"}, status=404)


def confirm_changes(request):
    services.editPerson(request)
    people = services.searchPerson(request.POST["dni"])
    return render(request, "details_person.html", {"people": people})


def filter_people(request):
    if request.method == "GET":
        query = request.GET.get("query", "").strip().lower()
        if query:
            people = Person.objects.filter(dni__icontains=query, isVisible=True)
        else:
            people = Person.objects.filter(isVisible=True)

        data = [
            {
                "dni": person.dni,
                "name": person.name,
                "phoneNumber": person.phoneNumber,
                "address": person.address,
                "email": person.email,
            }
            for person in people
        ]
        return JsonResponse({"people": data})


@csrf_exempt
def update_person(request):
    if request.method == "POST":
        try:
            data = request.POST  # Cambiado para manejar datos enviados como FormData
            person = Person.objects.get(dni=data["dni"])  # Buscar la persona por su DNI
            person.name = data["name"]
            person.phoneNumber = data["phoneNumber"]
            person.address = data["address"]
            person.email = data["email"]
            person.save()  # Guardar los cambios en la base de datos
            return JsonResponse({"success": True, "person": {
                "dni": person.dni,
                "name": person.name,
                "phoneNumber": person.phoneNumber,
                "address": person.address,
                "email": person.email,
            }})
        except Person.DoesNotExist:
            return JsonResponse({"success": False, "error": "Persona no encontrada"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
