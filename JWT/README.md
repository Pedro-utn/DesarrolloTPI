# Existe la documentación !!!

Check localhost:3001/api/

Guía:

1. Levantar el docker

```bash
docker compose up -d
```

2. Correr el backend

```bash
npm run start:dev
```

3. Cargar la base de datos con lo básico

```bash
cat sql/init.sql | docker exec -i trabajojwt-db psql -U postgres -d postgres
```

Ahora te podes loguear como admin.

```bash
admin@sistema.com:admin123
```
