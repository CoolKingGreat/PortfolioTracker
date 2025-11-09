import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
    } | null;
}
export declare const protect: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map