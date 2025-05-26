from django.forms import ValidationError
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from . import services
from people_module import services as people_services
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import json

# Create your views here.


@csrf_exempt  # Solo si no usas el token CSRF, pero es mejor enviarlo desde JS
def add_employee(request):
    if request.method == "POST":
        form_type = request.POST.get("form_type")
        if form_type == "create_person":
            try:
                person = people_services.createPerson(request)
                print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                return JsonResponse(
                    {"success": True, "message": "Persona registrada correctamente."}
                )
            except Exception as e:
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Ocurrió un error al crear la persona: El dni se encuentra asignado a otra persona.",
                    }
                )
    # Si no es POST o no es create_person
    return JsonResponse(
        {"success": False, "message": "Petición inválida.", "new_person_id": person.id}
    )


def manage_event(request):
    print("manage_event")
    events = services.getAllEvents()
    people = people_services.getAllPeople()

    if request.method == "GET":
        return render(request, "manage_event.html", {"events": events, "people": people})

    form_type = request.POST.get("form_type")
    if form_type == "create_person":
        try:
            services.createEvent(request)
            messages.success(request, "Evento registrado correctamente.")
            return redirect("/manage_event/")
        except ValidationError:
            employees_json = request.POST.get("employees")
            employees = json.loads(employees_json) if employees_json else []
            if any(employee.get("salary", "") == "" for employee in employees):
                messages.error(request, "Debe asignarle un salario a cada empleado del evento.")
            else:
                messages.error(request, "La fecha de finalización no puede ser anterior a la fecha de inicio.")
            return redirect("/manage_event/")
        except Exception as e:
            employees_json = request.POST.get("employees")
            client = request.POST.get("client")
            errorFound = False

            employees = json.loads(employees_json) if employees_json else []
            if employees_json and len(employees) == 0:
                messages.error(request, "Debe seleccionar al menos un empleado para el evento.")
                errorFound = True

            if any(employee.get("role") == "null" for employee in employees):
                messages.error(request, "Debe seleccionar un rol para cada empleado.")
                errorFound = True

            if not client:
                messages.error(request, "Debe seleccionar un cliente para el evento.")
                errorFound = True

            if not employees_json:
                messages.error(request, "Debe seleccionar al menos un empleado para el evento.")
                errorFound = True

            if not errorFound:
                messages.error(request, "Error al crear el evento")

            print("Error: ", e)
            return redirect("/manage_event/")

    return render(request, "manage_event.html", {"events": events, "people": people})


def delete_event(request):
    services.deleteEvent(request.POST["id"])
    messages.success(request, f"Evento eliminado correctamente.")
    events = services.getAllEvents()
    return render(request, "manage_event.html", {"events": events})


def edit_event(request):
    try:
        if "id" not in request.POST:
            return JsonResponse({"success": False, "error": "Falta el DNI"})

        #EJEMPLO, borrar luego
        event_id = 2
        empleados = services.getEmployeesDataByEvent(event_id)
        print("--------------------------------------")
        print("Empleados del evento con id=2:")
        for empleado in empleados:
            print(empleado)
        #FIN EJEMPLO

        services.editEvent(request)
        updated_event = services.getEventById(request.POST["id"])

        return JsonResponse(
            {
                "success": True,
                "event": {
                    "id": updated_event.id,
                    "name": updated_event.name,
                },
            }
        )
    except Exception as e:
        print(e)
        messages.error(
            request,
            f"Ocurrio un error al actualizar la información. Intenta nuevamente mas tarde.",
        )
        return JsonResponse({"success": False, "error": str(e)})


def filter_events(request):
    if request.method == "GET":
        query = request.GET.get("query", "").strip().lower()
        if query:
            events = services.filter_event_by(name__icontains=query, isVisible=True)
        else:
            events = services.filter_event_by(isVisible=True)

        data = [
            {
                "name": event.name,
                "startDate": event.startDate.strftime("%Y-%m-%d"),
                "endDate": event.endDate.strftime("%Y-%m-%d"),
            }
            for event in events
        ]
        return JsonResponse({"events": data})


def rolesToSend(request):
    roles = list(people_services.getAllRoles().values("id", "name"))
    return JsonResponse({"roles": roles})


def placesToSend(request):
    if request.method == "GET":
        places = services.getallPlaces()

        data = [
            {
                "id": place.id,
                "name": place.name,
            }
            for place in places
        ]
        return JsonResponse({"places": data})


def typesToSend(request):
    if request.method == "GET":
        types = services.getallTypes()

        data = [
            {
                "id": type.id,
                "name": type.type,
            }
            for type in types
        ]
        return JsonResponse({"types": data})


def peopleToSend(request):
    print("peopleToSend")
    if request.method == "GET":
        people = people_services.getAllPeople()

        data = [
            {
                "dni": person.dni,
                "name": person.name,
            }
            for person in people
        ]
        return JsonResponse({"people": data})


def employeesOfAnEvent(request):
    print("employeesOfAnEvent")
    if request.method == "GET":
        event_id = request.GET.get("id")
        employees = services.getEmployeesByEvent(event_id)
        print("employeesOfAnEvent", employees)
        data = [
            {
                "dni": employee.person.dni,
                "name": employee.person.name,
                "salary": employee.salary,
                "roleName": employee.role.name,
                "roleId": employee.role.id,
            }
            for employee in employees
        ]
        return JsonResponse({"employees": data})
