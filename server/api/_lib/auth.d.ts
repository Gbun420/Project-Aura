export type AuthResult = {
    user: {
        id: string;
    };
} | {
    error: {
        status: number;
        message: string;
    };
};
export declare function requireUser(req: any): Promise<AuthResult>;
//# sourceMappingURL=auth.d.ts.map