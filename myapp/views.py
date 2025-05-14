from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from . import services
from .models import Person
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import json

# Create your views here.

def index(request):
    return render(request, "index.html")

def manage_people(request):
    people = services.getAllPeople()
    if request.method == "GET":
        return render(request, "manage_people.html", {"people": people})
    else:
        form_type = request.POST.get("form_type")
        if form_type == "create_person":
            try:
                services.createPerson(request)
                messages.success(request, f"Persona registrada correctamente.")
            except Exception as e:
                messages.error(request, f"Ocurrió un error al crear la persona: El dni se encuentra asignado a otra persona.")
                return redirect("/manage_people/")
    return render(request, "manage_people.html", {"people": people})
    
def delete_person(request):
    services.deletePerson(request.POST["dni"])
    messages.success(request, f"Persona eliminada correctamente.")
    people = services.getAllPeople()
    return render(request, "manage_people.html", {"people": people})

def edit_person(request):
    try:
        if "dni" not in request.POST:
            return JsonResponse({"success": False, "error": "Falta el DNI"})

        services.editPerson(request)
        updated_person = services.getPersonById(request.POST["dni"])

        return JsonResponse({
            "success": True,
            "person": {
                "dni": updated_person.dni,
                "name": updated_person.name,
                "phoneNumber": updated_person.phoneNumber,
                "address": updated_person.address,
                "email": updated_person.email,
            }
        })
    except Exception as e:
            messages.error(request, f"Ocurrio un error al actualizar la información. Intenta nuevamente mas tarde.")
            return JsonResponse({"success": False, "error": str(e)})

def filter_people(request):
    if request.method == "GET":
        query = request.GET.get("query", "").strip().lower()
        if query:
            if query.isdigit():
                people = services.filter_people_by(dni__icontains=query, isVisible=True)
            else:
                people = services.filter_people_by(name__icontains=query, isVisible=True)
        else:
            people = services.filter_people_by(isVisible=True)

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
