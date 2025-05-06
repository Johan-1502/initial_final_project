from django.urls import path
from . import views

urlpatterns = [
    path("", views.show_people, name="show_people"),  # Página principal
    path("create-person/", views.create_person, name="create_person"),
    path("search-person/", views.search_person, name="search_person"),
    path("delete-person/<int:id>/", views.delete_person, name="delete_person"),
    path("edit-person/", views.edit_person, name="edit_person"),
    path("get-person/<int:dni>/", views.get_person, name="get_person"),
    path("filter-people/", views.filter_people, name="filter_people"),  # Nueva ruta
]