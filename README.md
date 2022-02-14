# Mail

This project was inspired by [CS50 Web Programming with Python and JavaScript](https://courses.edx.org/courses/course-v1:HarvardX+CS50W+Web/course/).

[Full project specification](https://cs50.harvard.edu/web/2020/projects/3/mail/).

## Setup

The first thing to do is clone this repository:
```bash
git clone https://github.com/dark-dave007/cs50w-mail
cd cs50w-mail
```

Install dependencies:
```bash
python3 -m pip install Django
```

Migrate:
```bash
python3 manage.py makemigrations mail
python3 manage.py migrate 
```

To run the development server:
```bash
python3 manage.py runserver
```

If you would like to create an admin user, run the following:
```bash
python3 manage.py createsuperuser
```
And follow the instructions given by Django.


### Details
The project I made is an email-client, where users can send mails to each other, archive and unarchive them.

This project was made using [Django](https://www.djangoproject.com/).

