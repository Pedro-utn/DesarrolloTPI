-- 1. Insertar permisos 
INSERT INTO PERMISSIONS (name) VALUES  -- id esta automatizado
('getRole'), --id: 1
('createRole'), --id: 2
('updateRole'), --id: 3
('deleteRole'), --id: 4
('getPermission'), --id: 5
('createPermission'), --id: 6
('updatePermission'), --id: 7
('deletePermission'), --id: 8

-- Permisos Payment
('createPayment'), --id: 9
('findAllPayment'), -- 10
('findOnePayment'), -- 11
('updateStatusPayment'), -- 12
('postRefundPayment'), -- 13
('deletePayment'), -- 14

-- Permisos ordenes
('createOrder'), -- 15
('findAllOrder'),  -- 16
('findOneOrder'), -- 17 
('putOrder'), -- 18
('patchOrder'), -- 19
('deleteOrder'), --20
('findMyOrders'); --21


-- 2. Crear Rol de admin y user
INSERT INTO ROL (name) VALUES 
('admin'), -- id : 1
('user');  -- id : 2

-- 3. Asociar todos los permisos al rol de administrador
INSERT INTO ROL_PERMISSIONS_PERMISSION ("rolId", "permissionId") VALUES 
-- Roles del administrador
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(1, 9), (1, 10), (1, 11), (1, 12), (1, 13),
(1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19),
(1, 20), 
-- Roles de Usuario
(2,9),(2,10),(2,11),(2,13),(2,15),(2,17),(2,20), (2,21); 

-- 4. Creamos Admin y un usuario normal
INSERT INTO USERS (email, password, "rolId") VALUES 
('admin@gmail.com', '$2b$10$0H2wiH6Pc6MipYulNWhwLeM0Cc6XaAR4/zXpLV.QhcU8DHZCZsmWK', 1), -- contraseña: admin123  (ROL ADMIN)
('usuario@gmail.com', '$2b$10$xp.hTt48OY9ZwbG/3r1Wo.GrhV0yVcH1d5cMM1oD3NSITlUf5FCc.', 2) -- contraseña: 123  (ROL USER)
ON CONFLICT (email) DO NOTHING;