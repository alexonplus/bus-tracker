using System.Text.Json.Serialization;

namespace BusTracker.Infrastructure.Models;

public class ResRobotDepartureResponse
{
    [JsonPropertyName("Departure")]
    public List<ResRobotDeparture>? Departure { get; set; }
}

public class ResRobotDeparture
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("transportNumber")]
    public string TransportNumber { get; set; } = string.Empty;

    [JsonPropertyName("transportCategory")]
    public string TransportCategory { get; set; } = string.Empty;

    [JsonPropertyName("stop")]
    public string Stop { get; set; } = string.Empty;

    [JsonPropertyName("stopid")]
    public string StopId { get; set; } = string.Empty;

    [JsonPropertyName("time")]
    public string Time { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("rtTime")]
    public string? RtTime { get; set; }

    [JsonPropertyName("rtDate")]
    public string? RtDate { get; set; }

    [JsonPropertyName("direction")]
    public string Direction { get; set; } = string.Empty;

    [JsonPropertyName("JourneyDetailRef")]
    public JourneyDetailRef? JourneyDetailRef { get; set; }
}

public class JourneyDetailRef
{
    [JsonPropertyName("ref")]
    public string Ref { get; set; } = string.Empty;
}
