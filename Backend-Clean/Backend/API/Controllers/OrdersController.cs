using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.Orders.Commands;
using SalesManagement.Application.Orders.Queries;
using SalesManagement.Domain.Enums;

namespace SalesManagement.API.Controllers;

[Authorize]
public class OrdersController : BaseController
{
    [HttpGet]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> GetAll()
    {
        var result = await Mediator.Send(new GetAllOrdersQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await Mediator.Send(new GetOrderByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
    {
        var id = await Mediator.Send(command);
        return Ok(new { id, message = "تم إنشاء الطلب بنجاح" });
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatus status)
    {
        await Mediator.Send(new UpdateOrderStatusCommand(id, status));
        return NoContent();
    }
}
