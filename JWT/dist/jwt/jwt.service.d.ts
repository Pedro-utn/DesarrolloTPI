import { Payload } from 'src/interfaces/payload';
export declare class JwtService {
    config: {
        auth: {
            secret: string;
            expiresIn: string;
        };
        refresh: {
            secret: string;
            expiresIn: string;
        };
    };
    generateToken(payload: {
        email: string;
    }, type?: 'refresh' | 'auth'): string;
    refreshToken(refreshToken: string): {
        accessToken: string;
        refreshToken: string;
    };
    getPayload(token: string, type?: 'refresh' | 'auth'): Payload;
}
