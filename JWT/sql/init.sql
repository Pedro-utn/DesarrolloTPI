-- 1. Insertar permisos 
INSERT INTO PERMISSION (id, name, description) VALUES 
(1, 'getRole', 'Visualizar roles'),
(2, 'createRole', 'Crear roles'),
(3, 'updateRole', 'Actualizar roles'),
(4, 'deleteRole', 'Borrar roles'),
(5, 'getPermission', 'Visualizar permisos'),
(6, 'createPermission', 'Crear permisos'),
(7, 'updatePermission', 'Actualizar permisos'),
(8, 'deletePermission', 'Borrar permisos'),
(9, 'getDeliveries', 'Visualizar Deliveries'),
(10, 'createDelivery', 'Crear Deliveries'),
(11, 'createZone', 'Crear Zonas'),
(12, 'getDeliveryFindByProximity', 'Muestra Deliveries por location'),
(13, 'getDeliveryByZone', 'Muestra Delivery por zonas'),
(14, 'assignZone', 'Asignar zona a un delivery'),
(15, 'getDelivery', 'Obtener información de un delivery'),
(16, 'updateDeliveryLocation', 'Actualizar ubicación de un delivery'),
(17, 'updateDeliveryStatus', 'Actualizar estado de un delivery'),
(18, 'updateDelivery', 'Actualizar información de un delivery'),
(19, 'deleteDelivery', 'Eliminar un delivery'),
(20, 'createDeliveryStatus', 'Crear estado para un delivery'),
(21, 'getStatuses', 'Obtener estados disponibles'),
(22, 'getStatus', 'Obtener estado específico'),
(23, 'updateStatus', 'Actualizar estado'),
(24, 'deleteStatus', 'Eliminar estado'),
(25, 'getDeliveryZone', 'Obtener zona de un delivery'),
(26, 'deleteDeliveryZone', 'Eliminar zona de un delivery'),
(27, 'createLocation', 'Crear ubicación'),
(28, 'getLocations', 'Obtener ubicaciones'),
(29, 'getLocation', 'Obtener ubicación específica'),
(30, 'updateLocation', 'Actualizar ubicación'),
(31, 'deleteLocation', 'Eliminar ubicación'),
(32, 'getZones', 'Obtener zonas'),
(33, 'getZone', 'Obtener zona específica'),
(34, 'updateZone', 'Actualizar zona'),
(35, 'partialUpdate', 'Actualización parcial de zona'),
(36, 'deleteZone', 'Eliminar zona');

-- 2. Crear el rol de administrador
INSERT INTO ROL (id, code, name, description) VALUES 
(1, 'admin', 'Administrador', 'Rol con acceso completo al sistema'),
(2, 'user', 'Usuario', 'Rol del usuario, carece de permisos');

-- 3. Asociar todos los permisos al rol de administrador
INSERT INTO ROL_PERMISSIONS_PERMISSION ("rolId", "permissionId") VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(1, 9), (1, 10), (1, 11), (1, 12), (1, 13),
(1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19),
(1, 20), (1, 21), (1, 22), (1, 23), (1, 24), (1, 25),
(1, 26), (1, 27), (1, 28), (1, 29), (1, 30), (1, 31),
(1, 32), (1, 33), (1, 34), (1, 35), (1, 36); 

-- 4. Crear el usuario administrador
-- La contraseña es admin123
INSERT INTO USERS (id, email, password, "rolId") VALUES 
(1, 'admin@sistema.com', '$2b$10$MfHtev23g1zjSx7.JAd9h.a4pFzw3FBmBF0dQ4jzE7FOOTPoLJd6W', 1);

