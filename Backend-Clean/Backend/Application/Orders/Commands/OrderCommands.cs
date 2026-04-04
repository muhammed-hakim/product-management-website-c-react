using MediatR;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.Orders.Commands;

public record OrderItemRequest(int ProductId, int Quantity);

public record CreateOrderCommand(
    int CustomerId,
    List<OrderItemRequest> Items
) : IRequest<int>;

public record UpdateOrderStatusCommand(
    int Id,
    OrderStatus Status
) : IRequest;
