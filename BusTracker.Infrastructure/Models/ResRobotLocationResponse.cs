using System.Text.Json.Serialization;

namespace BusTracker.Infrastructure.Models;

public class ResRobotLocationResponse
{
    [JsonPropertyName("stopLocationOrCoordLocation")]
    public List<StopLocationWrapper>? StopLocationOrCoordLocation { get; set; }
}

public class StopLocationWrapper
{
    [JsonPropertyName("StopLocation")]
    public ResRobotStopLocation? StopLocation { get; set; }
}

public class ResRobotStopLocation
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("extId")]
    public string ExtId { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("lon")]
    public double Lon { get; set; }

    [JsonPropertyName("lat")]
    public double Lat { get; set; }
}
