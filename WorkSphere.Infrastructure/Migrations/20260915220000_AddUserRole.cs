using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkSphere.Infrastructure.Migrations;

[Migration("20260915220000_AddUserRole")]
public partial class AddUserRole : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Role",
            table: "Users",
            type: "nvarchar(20)",
            maxLength: 20,
            nullable: false,
            defaultValue: "Admin");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "Role",
            table: "Users");
    }
}
