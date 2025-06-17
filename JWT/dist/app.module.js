"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const jwt_service_1 = require("./jwt/jwt.service");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                database: 'db.sql',
                entities: entities_1.entities,
                type: 'sqlite',
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature(entities_1.entities),
        ],
        controllers: [app_controller_1.AppController, users_controller_1.UsersController],
        providers: [auth_middleware_1.AuthGuard, jwt_service_1.JwtService, users_service_1.UsersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map