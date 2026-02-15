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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(user) {
        return this.prisma.order.findMany({
            where: { tenantId: user.tenantId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    getStats(user, startDate, endDate) {
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            dateFilter.lt = end;
        }
        return this.prisma.order.aggregate({
            where: {
                tenantId: user.tenantId,
                createdAt: dateFilter
            },
            _sum: {
                total: true,
                totalCost: true
            },
            _count: {
                id: true,
            },
        }).then(result => {
            const revenue = result._sum.total || 0;
            const cost = result._sum.totalCost || 0;
            return {
                totalRevenue: revenue,
                totalCost: cost,
                totalProfit: revenue - cost,
                totalOrders: result._count.id || 0,
            };
        });
    }
    async createOrder(user, createOrderDto) {
        return this.prisma.$transaction(async (tx) => {
            let totalRevenue = 0;
            let totalCost = 0;
            const orderItemsToCreate = [];
            for (const item of createOrderDto.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                    include: { ingredients: { include: { ingredient: true } } }
                });
                if (!product)
                    throw new common_1.BadRequestException(`Producto no encontrado`);
                const itemTotal = product.price * item.quantity;
                totalRevenue += itemTotal;
                for (const recipeItem of product.ingredients) {
                    const neededQty = recipeItem.quantity * item.quantity;
                    const ingredient = await tx.ingredient.findUnique({
                        where: { id: recipeItem.ingredientId }
                    });
                    if (!ingredient)
                        continue;
                    if (ingredient.stock < neededQty) {
                        throw new common_1.BadRequestException(`Stock insuficiente para: ${ingredient.name}. (Quedan ${ingredient.stock}, Necesarios ${neededQty})`);
                    }
                    await tx.ingredient.update({
                        where: { id: ingredient.id },
                        data: { stock: { decrement: neededQty } }
                    });
                    totalCost += (neededQty * ingredient.cost);
                }
                orderItemsToCreate.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                });
            }
            const order = await tx.order.create({
                data: {
                    tableNumber: createOrderDto.tableNumber,
                    total: totalRevenue,
                    totalCost: totalCost,
                    tenantId: user.tenantId,
                    items: {
                        create: orderItemsToCreate
                    }
                },
                include: { items: true }
            });
            return order;
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map