using BusTracker.Domain.Entities;
using BusTracker.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BusTracker.Infrastructure.Seeders;

public static class DatabaseSeeder
{
    private static readonly PasswordHasher<User> _hasher = new();

    public static async Task SeedAsync(BusTrackerDbContext context)
    {
        // Skip only if the seeded events already exist
        if (await context.Events.AnyAsync(e => e.Title == "Liseberg Sommarkonsert")) return;

        // --- Users ---
        var admin = Make("Admin", "admin@bustrack.se", "Admin123!", UserRole.Admin);
        var all = new[]
        {
            admin,
            Make("Emma Lindqvist",   "emma@example.se",    "Pass123!"),
            Make("Oscar Bergström",  "oscar@example.se",   "Pass123!"),
            Make("Sofia Andersson",  "sofia@example.se",   "Pass123!"),
            Make("Lucas Johansson",  "lucas@example.se",   "Pass123!"),
            Make("Maja Eriksson",    "maja@example.se",    "Pass123!"),
            Make("Noah Nilsson",     "noah@example.se",    "Pass123!"),
            Make("Lina Gustafsson",  "lina@example.se",    "Pass123!"),
            Make("William Persson",  "william@example.se", "Pass123!"),
            Make("Ella Olsson",      "ella@example.se",    "Pass123!"),
            Make("Axel Svensson",    "axel@example.se",    "Pass123!"),
            Make("Klara Magnusson",  "klara@example.se",   "Pass123!"),
            Make("Filip Larsson",    "filip@example.se",   "Pass123!"),
        };

        foreach (var u in all)
            if (!await context.Users.AnyAsync(x => x.Email == u.Email))
                context.Users.Add(u);

        await context.SaveChangesAsync();

        // Reload with IDs
        var users = await context.Users.ToListAsync();
        User U(string email) => users.First(u => u.Email == email);

        // --- Events ---
        var events = new List<Event>
        {
            // --- Past events (with ratings) ---
            new() {
                Title = "Göteborgs Filmfestival",
                Description = "En av Nordens största filmfestivaler med premiärer, kortfilm och Q&A med regissörer. Visningar på 12 biografer i centrum.",
                EventDate = new DateTime(2026, 2, 1, 18, 0, 0, DateTimeKind.Utc),
                StopExtId = "740020752", StopId = "740020752", StopName = "Brunnsparken", Address = "Göteborg centrum",
                Category = EventCategory.Culture, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Gbg Half Marathon",
                Description = "Halvmaraton längs Göteborgs vackraste stråk — från Ullevi via Haga och Avenyn tillbaka. 3000 deltagare. Öppet för alla.",
                EventDate = new DateTime(2026, 3, 15, 9, 0, 0, DateTimeKind.Utc),
                StopExtId = "740025695", StopId = "740025695", StopName = "Ullevi Norra (Göteborg kn)", Address = "Ullevi, Göteborg",
                Category = EventCategory.Sports, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Vegansk Matmarknad Haga",
                Description = "Marknaden med 30+ veganska matproducenter, råvaror och street food. Livemusik och workshops. Barnvänligt.",
                EventDate = new DateTime(2026, 4, 18, 11, 0, 0, DateTimeKind.Utc),
                StopExtId = "740025634", StopId = "740025634", StopName = "Göteborg Hagakyrkan", Address = "Haga, Göteborg",
                Category = EventCategory.FoodMarket, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Techno Night @ Pustervik",
                Description = "Fyra internationella DJ:s, tre rum, tio timmar. Pustervik öppnar dörrarna kl 22 och stänger vid gryningen.",
                EventDate = new DateTime(2026, 4, 25, 22, 0, 0, DateTimeKind.Utc),
                StopExtId = "740015573", StopId = "740015573", StopName = "Järntorget (Göteborg kn)", Address = "Pustervik, Göteborg",
                Category = EventCategory.Music, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Vinterbad Frihamnen",
                Description = "Gemensam kallbadsdag i Frihamnen med bastu, uppvärmning och fika efteråt. Utrustning kan hyras på plats.",
                EventDate = new DateTime(2026, 1, 10, 10, 0, 0, DateTimeKind.Utc),
                StopExtId = "740025634", StopId = "740025634", StopName = "Göteborg Hagakyrkan", Address = "Frihamnen, Göteborg",
                Category = EventCategory.Outdoor, CreatedAt = DateTime.UtcNow
            },

            // --- Upcoming events ---
            new() {
                Title = "Liseberg Sommarkonsert",
                Description = "Stormig natt av livemusik under bar himmel på Liseberg med artister från hela Sverige. Ta med picknickfilt!",
                EventDate = new DateTime(2026, 6, 20, 19, 0, 0, DateTimeKind.Utc),
                StopExtId = "740015578", StopId = "740015578", StopName = "Korsvägen (Göteborg kn)", Address = "Liseberg, Göteborg",
                Category = EventCategory.Music, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Nordic Gaming Convention",
                Description = "Skandinaviens största gaming-event med turneringar, cosplay-tävling och demos från spelutvecklare. 3 dagar i rad.",
                EventDate = new DateTime(2026, 6, 14, 10, 0, 0, DateTimeKind.Utc),
                StopExtId = "740015578", StopId = "740015578", StopName = "Korsvägen (Göteborg kn)", Address = "Svenska Mässan, Göteborg",
                Category = EventCategory.Gaming, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Göteborg Street Food Festival",
                Description = "50+ matstånd, lokala bönder och street food från hela världen samlas på Järntorget. Gratis inträde.",
                EventDate = new DateTime(2026, 5, 30, 11, 0, 0, DateTimeKind.Utc),
                StopExtId = "740015573", StopId = "740015573", StopName = "Järntorget (Göteborg kn)", Address = "Järntorget, Göteborg",
                Category = EventCategory.FoodMarket, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Slottsskogen Naturlöpning",
                Description = "5 och 10 km löparrace genom Slottsskogen. Öppet för alla åldrar och nivåer. Medalj till alla finishers!",
                EventDate = new DateTime(2026, 6, 7, 9, 0, 0, DateTimeKind.Utc),
                StopExtId = "740015581", StopId = "740015581", StopName = "Linnéplatsen (Göteborg kn)", Address = "Slottsskogen, Göteborg",
                Category = EventCategory.Sports, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Göteborg Fashion Week",
                Description = "Nordisk modehelg med visningar från 30+ designers i Nordstans gallerier. VIP-tickets ger tillgång till afterparty.",
                EventDate = new DateTime(2026, 7, 12, 12, 0, 0, DateTimeKind.Utc),
                StopExtId = "740020752", StopId = "740020752", StopName = "Brunnsparken", Address = "Nordstan, Göteborg",
                Category = EventCategory.Fashion, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "IFK Göteborg vs BK Häcken",
                Description = "Allsvenskt stadsderby på Ullevi! Blåvitt möter Häcken i en av vårens hetaste matcher. Fansen väntas fylla arenan.",
                EventDate = new DateTime(2026, 5, 24, 15, 0, 0, DateTimeKind.Utc),
                StopExtId = "740025695", StopId = "740025695", StopName = "Ullevi Norra (Göteborg kn)", Address = "Ullevi, Göteborg",
                Category = EventCategory.Sports, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Kulturkalas Göteborg",
                Description = "Fyra dagar av fri kultur, gatukonst, musik och performance i stadens hjärta. Hundratals artister, helt gratis!",
                EventDate = new DateTime(2026, 8, 22, 14, 0, 0, DateTimeKind.Utc),
                StopExtId = "740020752", StopId = "740020752", StopName = "Brunnsparken", Address = "Göteborg centrum",
                Category = EventCategory.Culture, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Haga Antikvariat & Konst",
                Description = "Månadsmarknad med antika möbler, vintage-kläder, konstverk och loppisfynd längs Hagas pittoreska kullerstensgatorna.",
                EventDate = new DateTime(2026, 6, 28, 10, 0, 0, DateTimeKind.Utc),
                StopExtId = "740025634", StopId = "740025634", StopName = "Göteborg Hagakyrkan", Address = "Haga, Göteborg",
                Category = EventCategory.Other, CreatedAt = DateTime.UtcNow
            },
            new() {
                Title = "Outdoor Yoga & Wellness",
                Description = "Morgonyoga i soluppgången vid havet, följt av mindfulness och kallbadspass i havet. Instruktörer från hela Norden.",
                EventDate = new DateTime(2026, 7, 5, 7, 0, 0, DateTimeKind.Utc),
                StopExtId = "740025634", StopId = "740025634", StopName = "Göteborg Hagakyrkan", Address = "Saltholmen, Göteborg",
                Category = EventCategory.Outdoor, CreatedAt = DateTime.UtcNow
            },
        };

        context.Events.AddRange(events);
        await context.SaveChangesAsync();

        // Reload events with IDs
        var saved = await context.Events.ToListAsync();
        Event Ev(string title) => saved.First(e => e.Title == title);

        // --- Attendances ---
        var attendances = new List<EventAttendance>
        {
            // Filmfestival (past, with ratings)
            A(Ev("Göteborgs Filmfestival"), U("emma@example.se"),    AttendanceStatus.Going,    5, false),
            A(Ev("Göteborgs Filmfestival"), U("sofia@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Göteborgs Filmfestival"), U("klara@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Göteborgs Filmfestival"), U("lina@example.se"),    AttendanceStatus.Going,    3, false),
            A(Ev("Göteborgs Filmfestival"), U("oscar@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Göteborgs Filmfestival"), U("maja@example.se"),    AttendanceStatus.NotGoing, null, false),
            A(Ev("Göteborgs Filmfestival"), U("axel@example.se"),    AttendanceStatus.Going,    4, false),

            // Half Marathon (past, with ratings)
            A(Ev("Gbg Half Marathon"), U("lucas@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Gbg Half Marathon"), U("oscar@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Gbg Half Marathon"), U("axel@example.se"),    AttendanceStatus.Going,    4, false),
            A(Ev("Gbg Half Marathon"), U("noah@example.se"),    AttendanceStatus.Going,    4, false),
            A(Ev("Gbg Half Marathon"), U("william@example.se"), AttendanceStatus.Going,    3, false),
            A(Ev("Gbg Half Marathon"), U("filip@example.se"),   AttendanceStatus.NotGoing, null, false),

            // Vegansk Matmarknad (past, with ratings)
            A(Ev("Vegansk Matmarknad Haga"), U("maja@example.se"),    AttendanceStatus.Going,    5, false),
            A(Ev("Vegansk Matmarknad Haga"), U("lina@example.se"),    AttendanceStatus.Going,    4, false),
            A(Ev("Vegansk Matmarknad Haga"), U("ella@example.se"),    AttendanceStatus.Going,    5, false),
            A(Ev("Vegansk Matmarknad Haga"), U("sofia@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Vegansk Matmarknad Haga"), U("klara@example.se"),   AttendanceStatus.Going,    3, false),
            A(Ev("Vegansk Matmarknad Haga"), U("william@example.se"), AttendanceStatus.Maybe,    null, false),

            // Techno Night (past, with ratings)
            A(Ev("Techno Night @ Pustervik"), U("axel@example.se"),    AttendanceStatus.Going,    5, false),
            A(Ev("Techno Night @ Pustervik"), U("filip@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Techno Night @ Pustervik"), U("noah@example.se"),    AttendanceStatus.Going,    5, false),
            A(Ev("Techno Night @ Pustervik"), U("william@example.se"), AttendanceStatus.Going,    3, false),
            A(Ev("Techno Night @ Pustervik"), U("oscar@example.se"),   AttendanceStatus.NotGoing, null, false),
            A(Ev("Techno Night @ Pustervik"), U("emma@example.se"),    AttendanceStatus.Going,    4, false),

            // Vinterbad (past, with ratings)
            A(Ev("Vinterbad Frihamnen"), U("lina@example.se"),    AttendanceStatus.Going,    5, false),
            A(Ev("Vinterbad Frihamnen"), U("klara@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Vinterbad Frihamnen"), U("emma@example.se"),    AttendanceStatus.Going,    3, false),
            A(Ev("Vinterbad Frihamnen"), U("sofia@example.se"),   AttendanceStatus.NotGoing, null, false),
            A(Ev("Vinterbad Frihamnen"), U("axel@example.se"),    AttendanceStatus.Going,    5, false),

            // Liseberg Sommarkonsert
            A(Ev("Liseberg Sommarkonsert"), U("emma@example.se"),    AttendanceStatus.Going,    5, true),
            A(Ev("Liseberg Sommarkonsert"), U("oscar@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Liseberg Sommarkonsert"), U("sofia@example.se"),   AttendanceStatus.Maybe,    null, true),
            A(Ev("Liseberg Sommarkonsert"), U("lucas@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Liseberg Sommarkonsert"), U("maja@example.se"),    AttendanceStatus.NotGoing, null, false),
            A(Ev("Liseberg Sommarkonsert"), U("noah@example.se"),    AttendanceStatus.Going,    null, true),
            A(Ev("Liseberg Sommarkonsert"), U("lina@example.se"),    AttendanceStatus.Maybe,    null, true),
            A(Ev("Liseberg Sommarkonsert"), U("axel@example.se"),    AttendanceStatus.Going,    4, false),

            // Nordic Gaming Convention
            A(Ev("Nordic Gaming Convention"), U("axel@example.se"),    AttendanceStatus.Going,    5, true),
            A(Ev("Nordic Gaming Convention"), U("filip@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("Nordic Gaming Convention"), U("william@example.se"), AttendanceStatus.Going,    4, false),
            A(Ev("Nordic Gaming Convention"), U("oscar@example.se"),   AttendanceStatus.Maybe,    null, false),
            A(Ev("Nordic Gaming Convention"), U("lucas@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Nordic Gaming Convention"), U("ella@example.se"),    AttendanceStatus.NotGoing, null, false),
            A(Ev("Nordic Gaming Convention"), U("noah@example.se"),    AttendanceStatus.Going,    null, true),

            // Street Food
            A(Ev("Göteborg Street Food Festival"), U("sofia@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Göteborg Street Food Festival"), U("klara@example.se"),   AttendanceStatus.Going,    4, false),
            A(Ev("Göteborg Street Food Festival"), U("maja@example.se"),    AttendanceStatus.Going,    5, true),
            A(Ev("Göteborg Street Food Festival"), U("lina@example.se"),    AttendanceStatus.Going,    null, true),
            A(Ev("Göteborg Street Food Festival"), U("william@example.se"), AttendanceStatus.Maybe,    null, false),
            A(Ev("Göteborg Street Food Festival"), U("filip@example.se"),   AttendanceStatus.NotGoing, null, false),

            // Löpning
            A(Ev("Slottsskogen Naturlöpning"), U("lucas@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("Slottsskogen Naturlöpning"), U("oscar@example.se"),   AttendanceStatus.Going,    null, false),
            A(Ev("Slottsskogen Naturlöpning"), U("axel@example.se"),    AttendanceStatus.Going,    null, true),
            A(Ev("Slottsskogen Naturlöpning"), U("emma@example.se"),    AttendanceStatus.Maybe,    null, false),
            A(Ev("Slottsskogen Naturlöpning"), U("noah@example.se"),    AttendanceStatus.NotGoing, null, false),

            // Fashion
            A(Ev("Göteborg Fashion Week"), U("ella@example.se"),    AttendanceStatus.Going,    5, true),
            A(Ev("Göteborg Fashion Week"), U("klara@example.se"),   AttendanceStatus.Going,    4, true),
            A(Ev("Göteborg Fashion Week"), U("sofia@example.se"),   AttendanceStatus.Going,    5, false),
            A(Ev("Göteborg Fashion Week"), U("lina@example.se"),    AttendanceStatus.Maybe,    null, true),
            A(Ev("Göteborg Fashion Week"), U("maja@example.se"),    AttendanceStatus.Going,    null, false),
            A(Ev("Göteborg Fashion Week"), U("william@example.se"), AttendanceStatus.NotGoing, null, false),

            // IFK
            A(Ev("IFK Göteborg vs BK Häcken"), U("oscar@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("IFK Göteborg vs BK Häcken"), U("lucas@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("IFK Göteborg vs BK Häcken"), U("axel@example.se"),    AttendanceStatus.Going,    null, false),
            A(Ev("IFK Göteborg vs BK Häcken"), U("filip@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("IFK Göteborg vs BK Häcken"), U("noah@example.se"),    AttendanceStatus.Going,    null, false),
            A(Ev("IFK Göteborg vs BK Häcken"), U("william@example.se"), AttendanceStatus.Maybe,    null, false),
            A(Ev("IFK Göteborg vs BK Häcken"), U("emma@example.se"),    AttendanceStatus.NotGoing, null, false),

            // Kulturkalas
            A(Ev("Kulturkalas Göteborg"), U("emma@example.se"),    AttendanceStatus.Going,    null, false),
            A(Ev("Kulturkalas Göteborg"), U("sofia@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("Kulturkalas Göteborg"), U("klara@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("Kulturkalas Göteborg"), U("lina@example.se"),    AttendanceStatus.Maybe,    null, false),
            A(Ev("Kulturkalas Göteborg"), U("filip@example.se"),   AttendanceStatus.Maybe,    null, true),

            // Antikvariat
            A(Ev("Haga Antikvariat & Konst"), U("klara@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("Haga Antikvariat & Konst"), U("ella@example.se"),    AttendanceStatus.Going,    null, false),
            A(Ev("Haga Antikvariat & Konst"), U("maja@example.se"),    AttendanceStatus.Maybe,    null, true),
            A(Ev("Haga Antikvariat & Konst"), U("sofia@example.se"),   AttendanceStatus.Going,    null, false),

            // Yoga
            A(Ev("Outdoor Yoga & Wellness"), U("lina@example.se"),    AttendanceStatus.Going,    null, true),
            A(Ev("Outdoor Yoga & Wellness"), U("emma@example.se"),    AttendanceStatus.Going,    null, false),
            A(Ev("Outdoor Yoga & Wellness"), U("klara@example.se"),   AttendanceStatus.Going,    null, true),
            A(Ev("Outdoor Yoga & Wellness"), U("sofia@example.se"),   AttendanceStatus.Maybe,    null, false),
            A(Ev("Outdoor Yoga & Wellness"), U("maja@example.se"),    AttendanceStatus.NotGoing, null, false),
        };

        context.EventAttendances.AddRange(attendances);
        await context.SaveChangesAsync();
    }

    private static User Make(string name, string email, string password, UserRole role = UserRole.User)
    {
        var user = new User { Name = name, Email = email, Role = role };
        user.PasswordHash = _hasher.HashPassword(user, password);
        return user;
    }

    private static EventAttendance A(Event evt, User user, AttendanceStatus status, int? rating, bool lookingForCompany) => new()
    {
        EventId = evt.Id,
        UserId = user.Id,
        Status = status,
        Rating = rating,
        LookingForCompany = lookingForCompany,
        CreatedAt = DateTime.UtcNow
    };
}
