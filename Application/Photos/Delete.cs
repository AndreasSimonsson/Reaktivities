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
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());
                var photo = user.Photos.FirstOrDefault(x=>x.Id == request.Id);

                if(photo == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Photo="Not found"});

                 if(photo.IsMain)
                    throw new RestException(HttpStatusCode.BadRequest, new {Photo="You cannot delete your main photo"});   
                
                var resultDelete = _photoAccessor.DeletePhoto(request.Id);

                if(resultDelete == null)
                    throw new Exception("Problem deleting the photo");

                user.Photos.Remove(photo);

                var result = await _context.SaveChangesAsync();

                if (result > 0) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}