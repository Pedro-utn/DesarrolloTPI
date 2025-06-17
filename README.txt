Estructura del Poryecto:
Esta conformado por dos archivos:
    BackendTPI
    database
Sumandole el docker-compose.yml en el directorio raiz.

Para levantar el docker lo unico que es necesario hacer, es hacer un:

    docker compose up --build

Solo esto es necesario esto ya que el npm install se realiza de arranque en el docker compose up

Luego, en una cmd con Curl o si se quiere por otro metodo como ThunderClient(el cual utilizamos).
Se hacen las request que se quieran.

La url es:
http://localhost:3000/
                      order
                      payment

Las consultas habilitadas, son las mismas que se pidieron en el pdf del trabajo.