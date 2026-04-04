using MediatR;

namespace SalesManagement.Application.Products.Commands;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity
) : IRequest<int>;

public record UpdateProductCommand(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity
) : IRequest;

public record DeleteProductCommand(int Id) : IRequest;
