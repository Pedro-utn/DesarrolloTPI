"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const dayjs = require("dayjs");
let JwtService = class JwtService {
    constructor() {
        this.config = {
            auth: {
                secret: 'authSecret',
                expiresIn: '15m',
            },
            refresh: {
                secret: 'refreshSecret',
                expiresIn: '1d',
            },
        };
    }
    generateToken(payload, type = 'auth') {
        return (0, jsonwebtoken_1.sign)(payload, this.config[type].secret, {
            expiresIn: this.config[type].expiresIn,
        });
    }
    refreshToken(refreshToken) {
        try {
            const payload = this.getPayload(refreshToken, 'refresh');
            const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), 'minute');
            return {
                accessToken: this.generateToken({ email: payload.email }),
                refreshToken: timeToExpire < 20
                    ? this.generateToken({ email: payload.email }, 'refresh')
                    : refreshToken
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    getPayload(token, type = 'auth') {
        return (0, jsonwebtoken_1.verify)(token, this.config[type].secret);
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)()
], JwtService);
//# sourceMappingURL=jwt.service.js.map