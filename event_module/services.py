from .models import Event
from .models import Place
from .models import TypeEvent
from people_module.models import Person
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def createEvent(request):
    try:
        event = Event.objects.create(
            name = request.POST["name"],
            startDate = request.POST["startDate"],
            endDate = request.POST["endDate"],
            place = Place.objects.get(id=request.POST["place"]),
            typeEvent = TypeEvent.objects.get(id=request.POST["typeEvent"]),
            client = Person.objects.get(dni=request.POST["client"]),
        )
        event.full_clean()
        event.save()
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
    try:
        event = Event.objects.get(id=request.POST["id"])
        event.name = request.POST["name"]
        event.startDate = request.POST["startDate"]
        event.endDate = request.POST["endDate"]
        event.place = Place.objects.get(id=request.POST["place"])
        event.typeEvent = TypeEvent.objects.get(id=request.POST["typeEvent"])
        event.full_clean()
        event.save()
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
