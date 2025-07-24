"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const trpc_1 = require("./trpc");
const context_1 = require("./context");
const fetch_1 = require("@trpc/server/adapters/fetch");
// tRPC API handler
exports.api = functions.https.onRequest(async (req, res) => {
    const handler = (0, fetch_1.fetchRequestHandler)({
        endpoint: '/api/trpc',
        req: req,
        router: trpc_1.appRouter,
        createContext: context_1.createContext,
    });
    const response = await handler(req, res);
    return response;
});
// Health check endpoint
exports.health = functions.https.onRequest((req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
//# sourceMappingURL=index.js.map