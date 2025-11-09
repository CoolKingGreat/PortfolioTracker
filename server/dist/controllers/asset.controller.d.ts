import { Response } from "express";
export declare const getUserAssets: (req: any, res: Response) => Promise<void>;
export declare const getUserCash: (req: any, res: Response) => Promise<void>;
export declare const getUserAssetInfo: (req: any, res: Response) => Promise<void>;
export declare const addUserAsset: (req: any, res: Response) => Promise<void>;
export declare const purchaseAsset: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sellAsset: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeUserAsset: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPortfolioSummary: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=asset.controller.d.ts.map