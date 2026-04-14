import { Request, Response } from 'express';
export declare const getSnippets: (req: Request, res: Response) => Promise<void>;
export declare const createSnippet: (req: Request, res: Response) => Promise<void>;
export declare const updateSnippet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSnippet: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=snippet.controller.d.ts.map