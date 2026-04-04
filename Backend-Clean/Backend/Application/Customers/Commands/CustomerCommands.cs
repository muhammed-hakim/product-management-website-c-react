using MediatR;

namespace SalesManagement.Application.Customers.Commands;

public record CreateCustomerCommand(
    string FirstName,
    string LastName,
    string Email,
    string Phone
) : IRequest<int>;

public record UpdateCustomerCommand(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Phone
) : IRequest;

public record DeleteCustomerCommand(int Id) : IRequest;
