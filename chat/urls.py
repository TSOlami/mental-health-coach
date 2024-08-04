from django.urls import path
from . import views

urlpatterns = [
    path('initialize/', views.initialize_chat, name='initialize_chat'),
    path('chat/', views.chat, name='chat'),
]