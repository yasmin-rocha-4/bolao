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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const usuario_routes_1 = __importDefault(require("./modules/usuario/usuario.routes"));
const campanha_routes_1 = __importDefault(require("./modules/campanha/campanha.routes"));
const campanha_opcoes_routes_1 = __importDefault(require("./modules/campanhaOpcoes/campanha.opcoes.routes"));
const aposta_routes_1 = __importDefault(require("./modules/aposta/aposta.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const openapi_1 = require("./utils/openapi");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use("/usuarios", usuario_routes_1.default);
app.use("/campanhas", auth_middleware_1.authMiddleware, campanha_routes_1.default);
app.use("/campanha-opcoes", auth_middleware_1.authMiddleware, campanha_opcoes_routes_1.default);
app.use("/apostas", auth_middleware_1.authMiddleware, aposta_routes_1.default);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi_1.openApiDocument));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});
