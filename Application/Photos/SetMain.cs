using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());
                var photoCurrentMain = user.Photos.FirstOrDefault(x=>x.IsMain);
                var photoToBeMain = user.Photos.FirstOrDefault(x=>x.Id == request.Id);

                if(photoToBeMain == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Photo="Not found"});
                
                photoToBeMain.IsMain = true;

                if(photoCurrentMain != null)
                    photoCurrentMain.IsMain = false;

                var result = await _context.SaveChangesAsync();
                if (result > 0) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}