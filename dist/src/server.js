"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const usuario_routes_js_1 = __importDefault(require("./modules/usuario/usuario.routes.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/usuarios", usuario_routes_js_1.default);
app.listen(3000, () => {
    console.log(" Servidor rodando na porta 3000");
});
