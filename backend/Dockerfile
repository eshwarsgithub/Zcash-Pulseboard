# Use official Python slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for DuckDB
RUN mkdir -p /app/data

# Copy and make startup script executable
COPY start.sh .
RUN chmod +x start.sh

# Expose port
EXPOSE 8000

# Use startup script that properly handles PORT variable
CMD ["./start.sh"]
