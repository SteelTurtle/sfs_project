FROM python:3.9-alpine
LABEL maintainer='Daniele Mancuso'

ENV PYTHONUNBUFFERED 1
RUN pip install --upgrade pip

COPY requirements.txt /requirements.txt
RUN apk add --update --no-cache postgresql-client jpeg-dev
RUN apk add --update --no-cache --virtual .tmp-build-deps \
      gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev \
      python3-dev libffi libffi-dev
ENV LIBRARY_PATH=/lib:/usr/lib
WORKDIR /usr/src/app
COPY ./requirements.txt /usr/src/app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . /usr/src/app
RUN python manage.py collectstatic --noinput
