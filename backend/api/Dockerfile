FROM python:3.9-slim

WORKDIR /app

# Копируем файл с зависимостями
COPY requirements.txt .

# Обновляем pip перед установкой зависимостей
RUN python -m pip install --upgrade pip

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем оставшиеся файлы
COPY . .

# Открываем порт 8000
EXPOSE 8001

# Запускаем приложение с uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]



