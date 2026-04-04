using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.Customers.Commands;
using SalesManagement.Application.Customers.Queries;

namespace SalesManagement.API.Controllers;

[Authorize]
public class CustomersController : BaseController
{
    [HttpGet]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> GetAll()
    {
        var result = await Mediator.Send(new GetAllCustomersQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Manager,User")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await Mediator.Send(new GetCustomerByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateCustomerCommand command)
    {
        var id = await Mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerCommand command)
    {
        if (id != command.Id) return BadRequest("الـ ID غير متطابق");
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteCustomerCommand(id));
        return NoContent();
    }
}
