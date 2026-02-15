export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    tableNumber: string;
    items: OrderItemDto[];
}
