using AutoMapper;
using SalesManagement.Application.Customers.DTOs;
using SalesManagement.Application.Products.DTOs;
using SalesManagement.Domain.Entities;

namespace SalesManagement.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Customer, CustomerDto>();
        CreateMap<Product, ProductDto>();
    }
}
