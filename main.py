from ai71 import AI71

# Load API key from environment variable
import os
from dotenv import load_dotenv
load_dotenv()

# Import the AI personalities
from ai_personalities import personality

# Ask user to choose one of the available personalities
print("Choose a personality:")
for key, value in personality.items():
    print(f"{key}")
personality_choice = input("Enter the personality you would like to choose: ")

# Check if the user's choice is valid
while personality_choice not in personality:
    print("Invalid personality choice. Please choose from the available personalities.")
    personality_choice = input("Enter the personality you would like to choose: ")

# Print the chosen personality
print(f"You have chosen the personality: {personality_choice}")

# Get API key from environment variable
AI71_API_KEY = os.getenv("AI71_API_KEY")

# print(AI71_API_KEY)

# Create a client
client = AI71(AI71_API_KEY)

# Streaming chatbot:
messages = [{"role": "system", "content": f"{personality[personality_choice]}"}]

while True:
    content = input(f"User:")
    messages.append({"role": "user", "content": content})
    print(f"Falcon:", sep="", end="", flush=True)
    content = ""

    for chunk in client.chat.completions.create(
        messages=messages,
        model="tiiuae/falcon-180B-chat",
        stream=True,
    ):
        delta_content = chunk.choices[0].delta.content
        if delta_content:
            print(delta_content, sep="", end="", flush=True)
            content += delta_content
    
    messages.append({"role": "assistant", "content": content})
    print("\n")