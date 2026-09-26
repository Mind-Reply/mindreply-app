FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY services/ingestion/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy ingestion script
COPY services/ingestion/kafka_neo4j_consumer.py .

# Create logs directory
RUN mkdir -p /app/logs && chmod 755 /app/logs

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=2 \
  CMD python -c "import sys; sys.exit(0)"

# Run consumer
ENTRYPOINT ["python", "-u", "kafka_neo4j_consumer.py"]
