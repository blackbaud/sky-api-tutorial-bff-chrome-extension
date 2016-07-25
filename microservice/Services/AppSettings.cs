namespace Blackbaud.BFFTutorial.Services
{
    
    /// <summary>
    /// Stores app-wide configuration properties, mapped to appsettings.json.
    /// </summary>
    public class AppSettings
    {
        public string AuthBaseUri { get; set; }
        public string ClientId { get; set; }
        public string RedirectUri { get; set; }
        public string Secret { get; set; }
    }
}
