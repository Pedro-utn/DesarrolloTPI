-- 1. Insertar permisos 
INSERT INTO PERMISSIONS (name) VALUES 
('getRole'), --id: 1
('createRole'), --id: 2
('updateRole'), --id: 3
('deleteRole'), --id: 4
('getPermission'), --id: 5
('createPermission'), --id: 6
('updatePermission'), --id: 7
('deletePermission'), --id: 8
--modificar permisos desde acá
('getDeliveries'), --id: 9
('createDelivery'), --id: 10
('createZone'), --id: 11
('getDeliveryFindByProximity'), --id: 12
('getDeliveryByZone'), --id: 13
('assignZone'), --id: 14
('getDelivery'), --id: 15
('updateDeliveryLocation'), --id: 16
('updateDeliveryStatus'), --id: 17
('updateDelivery'),
('deleteDelivery'),
('createDeliveryStatus'),
('getStatuses'),
('getStatus'),
('updateStatus'),
('deleteStatus'),
('getDeliveryZone'),
('deleteDeliveryZone'),
('createLocation'),
('getLocations'),
('getLocation'),
('updateLocation'),
('deleteLocation'),
('getZones'),
('getZone'),
('updateZone'),
('partialUpdate'),
('deleteZone');

-- 2. Crear el rol de administrador
INSERT INTO ROL (name) VALUES 
('admin'),
('user');

-- 3. Asociar todos los permisos al rol de administrador
INSERT INTO ROL_PERMISSIONS_PERMISSION ("rolId", "permissionId") VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(1, 9), (1, 10), (1, 11), (1, 12), (1, 13),
(1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19),
(1, 20), (1, 21), (1, 22), (1, 23), (1, 24), (1, 25),
(1, 26), (1, 27), (1, 28), (1, 29), (1, 30), (1, 31),
(1, 32), (1, 33), (1, 34), (1, 35), (1, 36)
ON CONFLICT ("rolId", "permissionId") DO NOTHING;

-- 4. Crear el usuario administrador

-- La contraseña es admin123
INSERT INTO USERS (email, password, "rolId") VALUES 
('admin@gmail.com', '$2b$10$0H2wiH6Pc6MipYulNWhwLeM0Cc6XaAR4/zXpLV.QhcU8DHZCZsmWK', 1)
ON CONFLICT (email) DO NOTHING;