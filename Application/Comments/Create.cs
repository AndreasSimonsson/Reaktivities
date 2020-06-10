using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string CommentingUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activityWithNewComment = await _context.Activities.FindAsync(request.ActivityId);

                if (activityWithNewComment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Activity not found" });

                var commentingUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.CommentingUserName);

                if (commentingUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });

                var newComment = new Comment
                {
                    // Id = new Guid(),
                    Body = request.Body,
                    Activity = activityWithNewComment,
                    Author = commentingUser,
                    CreatedAt = DateTime.Now
                };

                activityWithNewComment.Comments.Add(newComment);

                var newDtoComment = _mapper.Map<CommentDto>(newComment);


                var result = await _context.SaveChangesAsync();
                if (result > 0) return newDtoComment;
                throw new Exception("Problem saving changes");
            }
        }
    }
}