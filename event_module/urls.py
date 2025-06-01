from django.urls import path, include
from . import views

urlpatterns = [
    path("edit_event/", views.edit_event, name="edit_event"),
    path("delete_event/", views.delete_event, name="delete_event"),
    path("", views.manage_event, name="manage_event"),
    path('filter-events/', views.filter_events, name='filter_events'),
    path('places/', views.placesToSend, name='places'),
    path('types/', views.typesToSend, name='types'),
    path('roles/', views.rolesToSend, name='roles'),
    path('people/', views.peopleToSend, name='people'),
    path('add_employee/', views.add_employee, name='add_employee'),
    path('add_place/', views.createPlace, name='add_place'),
    path('employees_event/', views.employeesOfAnEvent, name='employees_event'),
    path('event_report/', views.eventReport, name='event_report'),
]