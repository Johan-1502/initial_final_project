from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("index", views.index, name="index"),
    path("edit_person/", views.edit_person, name="edit_person"),
    path("edit_event/", views.edit_event, name="edit_event"),
    path("delete_person/", views.delete_person, name="delete_person"),
    path("delete_event/", views.delete_event, name="delete_event"),
    path("manage_people/", views.manage_people, name="manage_people"),
    path("manage_event/", views.manage_event, name="manage_event"),
    path('filter-people/', views.filter_people, name='filter_people'),
    path('filter-events/', views.filter_events, name='filter_events'),
    path('places/', views.placesToSend, name='places'),
    path('types/', views.typesToSend, name='types'),
    path('people/', views.peopleToSend, name='people'),
]