using Authentification;
using ConfigPolicy;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MongoDBAccess;
using System;
using UsersService.Models;
using UsersService.Services;

namespace UsersService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            AuthConfig.Configure(services, Configuration);

            PolicyOrigin.ConfigureServicesPolicyUI(services, new String[] { "http://localhost:4200"});

            //Load mongodb settings in RestaurantDatabaseSetting where is in appsettings.json with name : RestaurantDatabaseSetting
            services.Configure<DatabaseSettings>(Configuration.GetSection(nameof(DatabaseSettings)));
            //Define an interface who serve setting mongodb access
            services.AddSingleton<IDatabaseSettings>(sp => sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);
            //Define Restaurant service data access 
            services.AddTransient<IMongoDBContext<Account>, MongoDBContext<Account, IDatabaseSettings>>();

            services.AddTransient<IJwtManager, JwtManager>();
            services.AddTransient<IUsersManager, UsersManager>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "UsersService", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UsersService v1"));
            }

            PolicyOrigin.ConfigureAppPolicyUI(app);

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
