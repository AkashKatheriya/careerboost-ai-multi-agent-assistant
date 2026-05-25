FROM python:3.11-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Run on port 7860, which is the default port Hugging Face Spaces uses
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
