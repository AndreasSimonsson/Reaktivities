using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest 
        {
            public Guid Id {get;set;}
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if(activity == null)
                    throw new Exception("Could not find activity");
                
                _context.Activities.Remove(activity);

                var result = await _context.SaveChangesAsync();
                if(result > 0) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}