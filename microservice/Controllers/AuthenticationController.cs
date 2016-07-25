using System;
using System.Net.Http;
using Blackbaud.BFFTutorial.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Blackbaud.BFFTutorial.Controllers 
{
    
    /// <summary>
    /// Contains endpoints that interact with the authorization provider.
    /// </summary>
    [Route("/")]
    public class AuthenticationController : Controller
    {
            
        private readonly IAuthenticationService _authService;
        
        public AuthenticationController(IAuthenticationService authService) 
        {
            _authService = authService;
        }


        /// <summary>
        /// Exchanges the code in the request for an access token.
        /// </summary>
        [HttpGet("token")]
        public ActionResult GetToken()
        {
            string code = Request.Query["code"];
            HttpResponseMessage response = _authService.ExchangeCodeForAccessToken(code);
            string jsonString = response.Content.ReadAsStringAsync().Result;
            return Json(JsonConvert.DeserializeObject<dynamic>(jsonString));
        }


        /// <summary>
        /// Redirects the client to the auth provider authorization URI.
        /// </summary>
        [HttpGet("authorization")]
        public ActionResult LogIn()
        {
            Uri address = _authService.GetAuthorizationUri();
            return Redirect(address.ToString());
        }


        /// <summary>
        /// Deliberately makes a call to the auth provider to refresh access token.
        /// </summary>
        [HttpGet("refresh-token")]
        public ActionResult RefreshToken()
        {
            string refreshToken = Request.Query["refresh_token"];
            HttpResponseMessage response = _authService.RefreshAccessToken(refreshToken);
            string jsonString = response.Content.ReadAsStringAsync().Result;
            return Json(JsonConvert.DeserializeObject<dynamic>(jsonString));
        }
    }
}