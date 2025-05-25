from .models import Event
from .models import Place
from .models import TypeEvent
from .models import WorkersByEvent
from people_module.models import Person
from people_module.models import Role
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def createEvent(request):
    print(request.POST["name"])
    print(request.POST["startDate"])
    print(request.POST["endDate"])
    print(request.POST["place"])
    print(request.POST["typeEvent"])
    print(request.POST["client"])

    employees_json = request.POST.get("employees")
    employees = json.loads(employees_json)
    print("employees", employees)
    try:
        employeesToAssignRoles = []
        if employees_json:
            for employee in employees:
                person = Person.objects.get(dni=employee["dni"])
                role = Role.objects.get(id=employee["role"])
                if employee["salary"] == "":
                    raise ValidationError("Salario no digitado.")
                employeesToAssignRoles.append(
                    {
                        "person": person,
                        "role": role,
                        "salary": employee["salary"],
                    })

        event = Event(
            name=request.POST["name"],
            startDate=request.POST["startDate"],
            endDate=request.POST["endDate"],
            place=Place.objects.get(id=request.POST["place"]),
            typeEvent=TypeEvent.objects.get(id=request.POST["typeEvent"]),
            client=Person.objects.get(dni=request.POST["client"]),
        )
        event.full_clean()
        
        event.save()
        
        for employee in employeesToAssignRoles: 
            WorkersByEvent.objects.create(
                salary=employee["salary"],
                event=event,
                person=employee["person"],
                role=employee["role"],
            )
            
                

    except ValidationError as v:
        raise v
    except IntegrityError as i:
        raise i
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def getallPlaces():
    return Place.objects.all()


def getallTypes():
    return TypeEvent.objects.all()


def getAllEvents():
    return Event.objects.filter(isVisible=True)


def deleteEvent(id):
    events = Event.objects.filter(id=id)
    for event in events:
        event.isVisible = False
        event.save()


def editEvent(request):
    employees_json = request.POST.get("employees")
    employees = json.loads(employees_json)
    try:
        event = Event.objects.get(id=request.POST["id"])
        event.name = request.POST["name"]
        event.startDate = request.POST["startDate"]
        event.endDate = request.POST["endDate"]
        event.place = Place.objects.get(id=request.POST["place"])
        event.typeEvent = TypeEvent.objects.get(id=request.POST["typeEvent"])
        event.client = Person.objects.get(dni=request.POST["client"])
        event.full_clean()
        event.save()

        WorkersByEvent.objects.filter(event=event).delete()

        if employees_json:
            for employee in employees:
                try:
                    person = Person.objects.get(dni=employee["dni"])
                    role = Role.objects.get(id=employee["role"])
                    salary = employee["salary"]
                    WorkersByEvent.objects.create(
                        event=event, person=person, role=role, salary=salary
                    )
                except Person.DoesNotExist:
                    continue
    except ValidationError as v:
        raise v
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def filter_event_by(**kwargs):
    print("función filter_event_by")
    return Event.objects.filter(**kwargs)


def getEventById(id):
    try:
        return Event.objects.get(id=id)
    except Person.DoesNotExist:
        raise Person.DoesNotExist(f"No se encontró un evento con el id {id}")


def getEmployeesByEvent(id):
    print("función getEmployeesByEvent")
    print(id)
    try:
        event = Event.objects.get(id=id)
        employees = WorkersByEvent.objects.filter(event=event)
        return employees
    except Event.DoesNotExist:
        raise Event.DoesNotExist(f"No se encontró un evento con el id {id}")
