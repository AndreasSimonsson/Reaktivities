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

        public DbSet<Domain.Value> Values { get; set; }
        public DbSet<Domain.Activity> Activities { get; set; }
        public DbSet<Domain.UserActivity> UserActivities { get; set; }
        public DbSet<Domain.Photo> Photos {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>().HasData(
                new Value { Id = 1, Name = "101" },
                new Value { Id = 2, Name = "102" },
                new Value { Id = 3, Name = "104" }
            );

            builder.Entity<UserActivity>(
                x => x.HasKey(
                    ua => new
                    {
                        ua.AppUserId,
                        ua.ActivityId
                    }
                )
            );

            builder.Entity<UserActivity>()
            .HasOne(x=>x.AppUser)
            .WithMany(x=>x.UserAcvtivities)
            .HasForeignKey(x=>x.AppUserId);

            builder.Entity<UserActivity>()
            .HasOne(x=>x.Activity)
            .WithMany(x=>x.UserActivities)
            .HasForeignKey(x=>x.ActivityId);

        }
    }
}
