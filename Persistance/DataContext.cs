using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    //Adding Appuser is indata to  IdentityDbContext => no need for adding DbSet for AppUSer
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Domain.Value> Values {get;set;}
        public DbSet<Domain.Activity> Activities {get;set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>().HasData(
                new Value {Id = 1, Name = "101"},
                new Value {Id = 2, Name = "102"},
                new Value {Id = 3, Name = "104"}
            );
        }
    }
}
    