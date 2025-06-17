"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
const bcrypt_1 = require("bcrypt");
const jwt_service_1 = require("../jwt/jwt.service");
let UsersService = class UsersService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.repository = user_entity_1.UserEntity;
    }
    async refreshToken(refreshToken) {
        return this.jwtService.refreshToken(refreshToken);
    }
    canDo(user, permission) {
        const result = user.permissionCodes.includes(permission);
        if (!result) {
            throw new common_1.UnauthorizedException();
        }
        return true;
    }
    async register(body) {
        try {
            const user = new user_entity_1.UserEntity();
            Object.assign(user, body);
            user.password = (0, bcrypt_1.hashSync)(user.password, 10);
            await this.repository.save(user);
            return { status: 'created' };
        }
        catch (error) {
            throw new common_1.HttpException('Error de creacion', 500);
        }
    }
    async login(body) {
        const user = await this.findByEmail(body.email);
        if (user == null) {
            throw new common_1.UnauthorizedException();
        }
        const compareResult = (0, bcrypt_1.compareSync)(body.password, user.password);
        if (!compareResult) {
            throw new common_1.UnauthorizedException();
        }
        return {
            accessToken: this.jwtService.generateToken({ email: user.email }, 'auth'),
            refreshToken: this.jwtService.generateToken({ email: user.email }, 'refresh')
        };
    }
    async findByEmail(email) {
        return await this.repository.findOneBy({ email });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map