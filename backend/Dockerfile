FROM python:3 as builder
ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
COPY backend/quadraticfundingapi/requirements.txt /backend/requirements.txt
WORKDIR /backend

RUN pip install --user -r requirements.txt


FROM python:3

COPY --from=builder /root/.local /root/.local

RUN mkdir /backend
COPY backend/quadraticfundingapi/ /backend
WORKDIR /backend

ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000
