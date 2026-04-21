using System.Globalization;
using System.Net.Http.Json;
using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using BusTracker.Infrastructure.Models;
using Microsoft.Extensions.Configuration;

namespace BusTracker.Infrastructure.Services;

public class ResRobotService : IResRobotService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private const string BaseUrl = "https://api.resrobot.se/v2.1";

    public ResRobotService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["Trafiklab:ResRobotKey"]
            ?? throw new InvalidOperationException("ResRobotKey not configured");
    }

    public async Task<List<Stop>> SearchStopsAsync(string query)
    {
        var url = $"{BaseUrl}/location.name?input={Uri.EscapeDataString(query)}&accessId={_apiKey}&format=json&maxNo=10";
        var response = await _http.GetFromJsonAsync<ResRobotLocationResponse>(url);

        return response?.StopLocationOrCoordLocation?
            .Where(w => w.StopLocation != null)
            .Select(w => new Stop
            {
                Id = w.StopLocation!.Id,
                ExtId = w.StopLocation.ExtId,
                Name = w.StopLocation.Name,
                Latitude = w.StopLocation.Lat,
                Longitude = w.StopLocation.Lon
            }).ToList() ?? [];
    }

    public async Task<List<Departure>> GetDeparturesAsync(string stopExtId, int maxDepartures = 20)
    {
        var url = $"{BaseUrl}/departureBoard?id={stopExtId}&accessId={_apiKey}&format=json&maxJourneys={maxDepartures}&duration=120";
        var response = await _http.GetFromJsonAsync<ResRobotDepartureResponse>(url);

        return response?.Departure?
            .Select(d => new Departure

            {
                LineNumber = !string.IsNullOrEmpty(d.TransportNumber)
                ? d.TransportNumber
                : d.Name.Split(' ').LastOrDefault() ?? string.Empty,
                LineName = d.Name,
                Direction = d.Direction,
                TransportCategory = d.TransportCategory,
                StopId = d.StopId,
                TripId = ExtractTripId(d.JourneyDetailRef?.Ref),
                ScheduledTime = ParseDateTime(d.Date, d.Time),
                RealtimeTime = d.RtDate != null && d.RtTime != null
                    ? ParseDateTime(d.RtDate, d.RtTime)
                    : null
            })
            .OrderBy(d => d.DepartureTime)
            .ToList() ?? [];
    }

    private static DateTime ParseDateTime(string date, string time)
    {
        var combined = $"{date} {time}";
        return DateTime.ParseExact(combined, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
    }

    private static string ExtractTripId(string? refString)
    {
        if (string.IsNullOrEmpty(refString)) return string.Empty;
        // Extract journey ID from ref URL
        var match = System.Text.RegularExpressions.Regex.Match(refString, @"journeyId=([^&]+)");
        return match.Success ? match.Groups[1].Value : string.Empty;
    }
}
