using Blackbaud.BFFTutorial.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Blackbaud.BFFTutorial
{
    public class Startup
    {

        /// Stores app settings.
        public IConfiguration Configuration { get; }


        /// <summary>
        /// Injects app settings from a JSON file.
        /// </summary>
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configure app settings so we can inject it into other classes.
            services.AddOptions();
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            
            // Services to be injected.
            services.AddSingleton<IAuthenticationService, AuthenticationService>();

            // Allow cross-domain requests.
            services.AddCors();
            
            // Add MVC.
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            app.UseCors(
                builder => builder.WithOrigins("*").AllowAnyHeader()
            );
            app.UseMvc();
        }
    }
}
