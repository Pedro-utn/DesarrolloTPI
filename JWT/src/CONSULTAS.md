# Consultas que se pueden hacer, despues mejoren esto q no se como hacerlo

Para entrar a la db: docker exec -it trabajojwt-db psql -U postgres -d postgres

1. POST http://localhost:3001/register

```bash
Request:
{
    "email": "usuario@gmail.com",
    "password": "usuario"
}
Response:
{
  "status": "created"
}
```

2. POST http://localhost:3001/login

```bash
Request:
{
    "email": "usuario@gmail.com",
    "password": "usuario"
}
Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW8yQGdtYWlsLmNvbSIsImlhdCI6MTc1MDIyMjc5MCwiZXhwIjoxNzUwMjIzNjkwfQ.9yrXqOywrWWpvgGSxKkkTUqs5VwFUEbfH1s2gkDptqw",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW8yQGdtYWlsLmNvbSIsImlhdCI6MTc1MDIyMjc5MCwiZXhwIjoxNzUwMzA5MTkwfQ.w1EtDQp-lkPuaG3mtGQ10cBnQJ_6phFMHcxrDi3tmuw"
}
```

3. 

```bash
Request:
aca lo dejé me dió sueño chupenla
Response:

```