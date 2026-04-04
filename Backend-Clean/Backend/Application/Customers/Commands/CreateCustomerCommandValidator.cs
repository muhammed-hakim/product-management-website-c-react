using FluentValidation;

namespace SalesManagement.Application.Customers.Commands;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("الاسم الأول مطلوب")
            .MaximumLength(50).WithMessage("الاسم الأول لا يتجاوز 50 حرف");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("الاسم الأخير مطلوب")
            .MaximumLength(50).WithMessage("الاسم الأخير لا يتجاوز 50 حرف");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("الايميل مطلوب")
            .EmailAddress().WithMessage("صيغة الايميل غير صحيحة");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("رقم الهاتف مطلوب")
            .MaximumLength(15).WithMessage("رقم الهاتف لا يتجاوز 15 رقم");
    }
}
