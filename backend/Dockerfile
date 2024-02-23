FROM python:3.12

ENV TZ=America/Sao_Paulo \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /backend

EXPOSE 8000

COPY ./ /backend

COPY ./scripts/command.sh /scripts/command.sh
COPY ./requirements.txt /requirements.txt

RUN apt-get update && \
    apt-get install -y netcat-openbsd python3-venv && \
    python3 -m venv venv && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /requirements.txt && \
    chmod +x /scripts/command.sh && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/venv/bin:$PATH"
CMD ["ls", "/backend"]

CMD ["/scripts/command.sh"]