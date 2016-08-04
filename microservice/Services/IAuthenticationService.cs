using System;
using System.Net.Http;

namespace Blackbaud.BFFTutorial.Services
{
    public interface IAuthenticationService
    {   
        HttpResponseMessage ExchangeCodeForAccessToken(string code);
        Uri GetAuthorizationUri();
        HttpResponseMessage RefreshAccessToken(string refreshToken);
    }
}