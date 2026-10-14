
import json
from lambda_function import lambda_handler


# Тест үшін кіріс деректері
event = {
    "name": "Елнур"
}

# Lambda функциясын шақыру
result = lambda_handler(event, None)

# Нәтижені экранға шығару
print("HTTP Status Code:", result["statusCode"])
print("Функция нәтижесі:")
print(json.dumps(
    json.loads(result["body"]),
    ensure_ascii=False,
    indent=4
))
