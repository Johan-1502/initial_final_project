from django.contrib import admin
from .models import Person
from .models import Event
from .models import WorkersByEvent
from .models import Role
from .models import Place
from .models import TypeEvent

# Register your models here.
admin.site.register(Person)
admin.site.register(Event)
admin.site.register(WorkersByEvent)
admin.site.register(Role)
admin.site.register(Place)
admin.site.register(TypeEvent)