using Authentification;
using ConfigPolicy;
using ForumServices.Models;
using ForumsService.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MongoDBAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumsService
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

            PolicyOrigin.ConfigureServicesPolicyUI(services, new String[] { "http://localhost:4200" });

            //Load mongodb settings in RestaurantDatabaseSetting where is in appsettings.json with name : RestaurantDatabaseSetting
            services.Configure<DatabaseSettings>(Configuration.GetSection(nameof(DatabaseSettings)));
            //Define an interface who serve setting mongodb access
            services.AddSingleton<IDatabaseSettings>(sp => sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);
            //Define Restaurant service data access 
            services.AddTransient<IMongoDBContext<ForumObj>, MongoDBContext<ForumObj, IDatabaseSettings>>();

            services.AddSingleton<CacheUserWs>();
            services.AddTransient<IForumManagerView, ForumManager>();
            services.AddTransient<IForumManager, ForumManager>();
            services.AddTransient<IChannelManagerView, ChannelsManager>();
            services.AddTransient<IChannelManager, ChannelsManager>();
            services.AddTransient<IMessageManagerView, MessageManager>();
            services.AddTransient<IMessageManager, MessageManager>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ForumsService", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ForumsService v1"));
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
