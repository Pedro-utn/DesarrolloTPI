Para revisar los cambios en la base de datos. Tienen que identificar en nombre del contenedor el cual esta
levantando el servicio de postgres
Comando para ver los Docker levantados: "docker ps"
Ahora que tenemos el nombre del Docker nos conectamos desde la terminal de windoe directamente a la databasae
Comando para conectase a la db: "docker exec -it ´nombre_del_contenedor´ psql -U postgres -d ordenycompra
Para asegurarse que están entro usen "\dt" para listar las tablas que la base de datos debería terner.

Si ven que lo tiempos se guardan mal es por que el horario del contenedor normalmente es incorrencto. Si quieren que se guarden bien van a tener que ver la forma de hacer que el contenedor obtenga la hora correcta.