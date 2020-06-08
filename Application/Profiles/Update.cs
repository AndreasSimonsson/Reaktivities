using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
            public string Username { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Bio).MaximumLength(500);
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = _userAccessor.GetCurrentUserName();
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == currentUser);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { profile = "Not found" });

                user.DisplayName = request.DisplayName ?? user.DisplayName;
                user.Bio = request.Bio ?? user.Bio;

                var result = await _context.SaveChangesAsync();
                if (result > 0) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}