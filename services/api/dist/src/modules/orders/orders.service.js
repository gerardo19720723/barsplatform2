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
    async getStats(user, startDate, endDate) {
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            dateFilter.lt = end;
        }
        const result = await this.prisma.order.aggregate({
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
        });
        const revenue = result._sum.total || 0;
        const cost = result._sum.totalCost || 0;
        return {
            totalRevenue: revenue,
            totalCost: cost,
            totalProfit: revenue - cost,
            totalOrders: result._count.id || 0,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map