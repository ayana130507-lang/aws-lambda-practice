
import json
from datetime import datetime, timezone


def lambda_handler(event, context):
    """
    AWS Lambda функциясының негізгі обработчигі.
    event — кіріс деректері.
    context — орындау ортасы туралы ақпарат.
    """

    name = event.get("name", "Студент")
    message = f"Сәлем, {name}! AWS Lambda функциясы сәтті орындалды."

    response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json; charset=utf-8"
        },
        "body": json.dumps({
            "message": message,
            "service": "AWS Lambda",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, ensure_ascii=False)
    }

    return response
