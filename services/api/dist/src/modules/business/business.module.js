"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessModule = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const auth_module_1 = require("../auth/auth.module");
const roles_guard_1 = require("../../guards/roles.guard");
const categories_controller_1 = require("./categories.controller");
let BusinessModule = class BusinessModule {
};
exports.BusinessModule = BusinessModule;
exports.BusinessModule = BusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [products_controller_1.ProductsController, categories_controller_1.CategoriesController],
        providers: [products_service_1.ProductsService, roles_guard_1.RolesGuard],
    })
], BusinessModule);
//# sourceMappingURL=business.module.js.map