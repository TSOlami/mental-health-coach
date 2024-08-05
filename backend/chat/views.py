from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from ai71 import AI71
import os
from dotenv import load_dotenv

# Load environment variable
load_dotenv()

# Get API key from environment variable
AI71_API_KEY = os.getenv("AI71_API_KEY")

if not AI71_API_KEY:
    raise ValueError(
        "API key not found. Please set the AI71_API_KEY environment variable."
    )

# Create a client
client = AI71(AI71_API_KEY)

def home(request):
    return HttpResponse("Welcome to the Mental Health Coach!")


@api_view(["POST"])
def initialize_chat(request):
    personality = request.data.get("personality")

    # Check if personality is provided and is a type string
    if not personality or not isinstance(personality, str):
        return Response(
            {"error": "Personality is required and must be a string."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Initialize the chat model with the selected personality
    messages = [
        {"role": "system", "content": f"{personality}"},
        {"role": "user", "content": "Hello!"},  # Initial user message
    ]

    # Create chat completion
    try:
        chat_completion = client.chat.completions.create(
            messages=messages, model="tiiuae/falcon-180B-chat", stream=False
        )
        
        content = chat_completion.choices[0].message.content
        print("Response: ", content)
        return Response({"response": content})

    except Exception as e:
        print("Error: ", e)
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def chat(request):
    message_history = request.data.get("message_history")
    user_message = request.data.get("message")

    # Check if message history is provided and is a type list
    if not message_history or not isinstance(message_history, list):
        return Response(
            {"error": "Message history is required and must be a list."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if user message is provided and is a type string
    if not user_message or not isinstance(user_message, str):
        return Response(
            {"error": "Message is required and must be a string."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Append user message to message history
    message_history.append({"role": "user", "content": user_message})

    # Create chat completion
    try:
        chat_completion = client.chat.completions.create(
            messages=message_history, model="tiiuae/falcon-180B-chat", stream=False
        )
        content = chat_completion.choices[0].message.content
        # Clean up the response content
        content = content.strip()  # Remove leading and trailing whitespace
        if content.endswith("\nUser:"):
            content = content[:-len("\nUser:")].strip()
        print("Response: ", content)
        return Response({"response": content})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
