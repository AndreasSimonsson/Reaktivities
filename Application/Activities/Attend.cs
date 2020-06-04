using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class Attend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                var activity = await _context.Activities.FindAsync(request.Id);
                
                if(activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Activity = "Could not find activity"});
                
                var user = await _context.Users.SingleOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetCurrentUserName());

                //Check if user already is attending
                var attendance = await _context.UserActivities.SingleOrDefaultAsync(x => 
                    x.AppUserId == user.Id && x.ActivityId == activity.Id);

                if(attendance != null)
                    throw new RestException(HttpStatusCode.BadRequest, new {Attendance = "Already attending this activity"});


                
                activity.UserActivities.Add( new UserActivity{
                    Activity = activity,
                    AppUser = user,
                    // ActivityId = new Guid(),
                    DateJoined = DateTime.Now,
                    IsHost = false,
                    // AppUserId = user.Id
                });

                var result = await _context.SaveChangesAsync();

                if (result > 0) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}