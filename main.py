from ai71 import AI71
import os
from dotenv import load_dotenv

# Load environment variable
load_dotenv()

# Import the AI personalities
from ai_personalities import personality

# Define the default prompt
default_prompt = (
    "You must respond briefly and concisely and adhere to the personality traits provided. Only provide positive, encouraging and supportive responses. "
    "Ensure that your replies are human-toned: conversational, personable, and relatable. Use natural language that feels warm and engaging. "
    "Tailor the interaction based on user inputs, preferences, or mood data."
)

# Ask user to choose one of the available personalities
print("Please choose a personality: ")
for key in personality:
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

if not AI71_API_KEY:
    raise ValueError("API key not found. Please set the AI71_API_KEY environment variable.")

# print(AI71_API_KEY)

# Create a client
client = AI71(AI71_API_KEY)

system_prompt = f"{personality[personality_choice]} {default_prompt}"
print(system_prompt)

# Initialize chat with the chosen personality
messages = [{"role": "system", "content": f"{system_prompt}"}]

# Start streaming chat
while True:
    user_input = input("User: ")
    messages.append({"role": "user", "content": user_input})
    print(f"Falcon:", sep="", end="", flush=True)
    content = ""

    try:
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

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        break
