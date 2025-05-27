from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("index", views.index, name="index"),
    path("edit_person/", views.edit_person, name="edit_person"),
    path("delete_person/", views.delete_person, name="delete_person"),
    path("manage_people/", views.manage_people, name="manage_people"),
    path('filter-people/', views.filter_people, name='filter_people'),
    path('person-report/', views.personReport, name='person_report'),
]