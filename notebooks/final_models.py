

from openai import OpenAI
import pickle
import requests
import measure
from measure import baitness_measure


with open("../file_path.txt", 'r') as file:
    file_path = file.read()

with open(file_path, 'r') as file:
    api_key = file.read()

client = OpenAI(
    api_key=api_key,
)


def return_embeddings_chat(prompt):
    res = requests.post(f"https://api.openai.com/v1/embeddings",
        headers = {
          "Content-Type": "application/json",
          "Authorization": f"Bearer {api_key}"
        },
        json={
          "model": "text-embedding-3-large",
          "dimensions": 1000,
          "input": f"{prompt}"
        }).json()
    return res["data"][0]["embedding"]


def get_probability_of_clickbait_title(model_path, title):

    with open(model_path, 'rb') as rf_file:
        loaded_model = pickle.load(rf_file)
        
    input_to_model = return_embeddings_chat(title)

    for function_name, function in metrics_functions.items():
        input_to_model.append(function(title))

    return loaded_model.predict_proba([input_to_model])[0][1]