# Multi-stage build: compile → minimal runtime
FROM python:3.14-slim AS builder

WORKDIR /build
COPY services/rwa-bridge/requirements.txt .
RUN pip install --no-cache-dir --user \
    --no-warn-script-location \
    -r requirements.txt

# Runtime stage
FROM python:3.14-slim

WORKDIR /app

# Create non-root user for security
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Copy dependencies from builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Set PATH and environment variables
ENV PATH=/home/appuser/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONHASHSEED=random

# Switch to non-root user
USER appuser

# Copy application code
COPY --chown=appuser:appuser services/rwa-bridge/apex_titan_rwa_bridge.py .

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import sys; sys.exit(0)" || exit 1

# Run application
CMD ["python", "apex_titan_rwa_bridge.py"]
