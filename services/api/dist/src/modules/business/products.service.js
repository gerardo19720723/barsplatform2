"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(user, createProductDto) {
        return this.prisma.product.create({
            data: {
                name: createProductDto.name,
                price: createProductDto.price,
                categoryId: createProductDto.categoryId,
                tenantId: user.tenantId,
            },
        });
    }
    async findAll(user) {
        return this.prisma.product.findMany({
            where: { tenantId: user.tenantId },
            include: {
                category: true,
                ingredients: {
                    include: {
                        ingredient: true
                    }
                }
            },
        });
    }
    async addIngredientToRecipe(data) {
        return this.prisma.productIngredient.create({
            data: {
                productId: data.productId,
                ingredientId: data.ingredientId,
                quantity: data.quantity,
            },
            include: {
                ingredient: true
            }
        });
    }
    async removeIngredientFromRecipe(productId, ingredientId) {
        return this.prisma.productIngredient.deleteMany({
            where: {
                productId: productId,
                ingredientId: ingredientId,
            },
        });
    }
    async sellProduct(productId) {
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId },
                include: {
                    ingredients: { include: { ingredient: true } }
                }
            });
            if (!product)
                throw new Error('Producto no encontrado');
            for (const item of product.ingredients) {
                const currentIngredient = await tx.ingredient.findUnique({
                    where: { id: item.ingredientId }
                });
                if (!currentIngredient)
                    continue;
                const newStock = currentIngredient.stock - item.quantity;
                if (newStock < 0) {
                    throw new common_1.BadRequestException(`Stock insuficiente para: ${currentIngredient.name}. (Quedan ${currentIngredient.stock})`);
                }
                await tx.ingredient.update({
                    where: { id: item.ingredientId },
                    data: { stock: newStock }
                });
            }
            const order = await tx.order.create({
                data: {
                    total: product.price,
                    tenantId: product.tenantId,
                    items: {
                        create: {
                            productId: product.id,
                            quantity: 1,
                            price: product.price
                        }
                    }
                }
            });
            return {
                message: 'Venta registrada exitosamente',
                orderId: order.id
            };
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map