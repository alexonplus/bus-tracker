using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLookingForCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "LookingForCompany",
                table: "EventAttendances",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LookingForCompany",
                table: "EventAttendances");
        }
    }
}
