using Microsoft.EntityFrameworkCore;
using PlacementPortalAPI.Data;
using PlacementPortalAPI.Models;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<PlacementPortalContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();
app.UseCors("AllowReact");

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();

    return forecast;
})
.WithName("GetWeatherForecast");

app.MapGet("/api/students",
    async (PlacementPortalContext db) =>
        await db.StudentDetails.ToListAsync());
app.MapGet("/api/jobs",
    async (PlacementPortalContext db) =>
        await db.Jobs.ToListAsync());
app.MapGet("/api/applications",
    async (PlacementPortalContext db) =>
        await db.ApplicationTrackers.ToListAsync());
app.MapGet("/api/students/{id}",
    async (int id, PlacementPortalContext db) =>
    {
        var student = await db.StudentDetails
            .FirstOrDefaultAsync(s => s.StudentID == id);

        return student is not null
            ? Results.Ok(student)
            : Results.NotFound();
    });
app.MapPut("/api/students/{id}",
async (
    int id,
    UpdateStudentRequest request,
    PlacementPortalContext db
) =>
{
    var student = await db.StudentTables
        .FirstOrDefaultAsync(
            s => s.StudentID == id
        );

    if (student == null)
    {
        return Results.NotFound();
    }

    student.CGPA = request.CGPA;
    student.GraduationYear =
        request.GraduationYear;

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        Message = "Profile updated"
    });
});
app.MapGet("/api/jobs/{id}",
    async (int id, PlacementPortalContext db) =>
    {
        var job = await db.Jobs
            .FirstOrDefaultAsync(j => j.JobID == id);

        return job is not null
            ? Results.Ok(job)
            : Results.NotFound();
    });
app.MapGet("/api/dashboard",
    async (PlacementPortalContext db) =>
    {
        var dashboard = new DashboardSummary
        {
            TotalStudents = await db.StudentDetails.CountAsync(),

            TotalJobs = await db.Jobs.CountAsync(),

            TotalApplications = await db.ApplicationTrackers.CountAsync(),

            TotalOffers = await db.ApplicationTrackers
                .CountAsync(a => a.Status == "Offer")
        };

        return dashboard;
    });
app.MapGet("/api/recommendations/{studentId}",
async (int studentId, PlacementPortalContext db) =>
{
    var recommendations =
        from ss in db.StudentSkills
        join js in db.JobSkills
            on ss.SkillName equals js.SkillName
        join j in db.Jobs
            on js.JobID equals j.JobID
        where ss.StudentID == studentId
        group j by new
        {
            j.JobID,
            j.JobTitle,
            j.CompanyName
        }
        into g
        orderby g.Count() descending
        select new
        {
            g.Key.JobID,
            g.Key.JobTitle,
            g.Key.CompanyName,
            MatchingSkills = g.Count()
        };

    return await recommendations.ToListAsync();
});
app.MapGet("/api/student/by-name/{name}", async (
    string name,
    PlacementPortalContext db) =>
{
    var student = await db.StudentDetails
        .FirstOrDefaultAsync(
            s => s.FullName == name
        );

    return student is null
        ? Results.NotFound()
        : Results.Ok(student);
});
app.MapGet("/api/dashboard/students/count",
async (PlacementPortalContext db) =>
{
    return await db.StudentDetails.CountAsync();
});
app.MapGet("/api/dashboard/jobs/count",
async (PlacementPortalContext db) =>
{
    return await db.Jobs.CountAsync();
});
app.MapGet("/api/dashboard/applications/count",
async (PlacementPortalContext db) =>
{
    return await db.ApplicationTrackers.CountAsync();
});
app.MapGet("/api/dashboard/offers/count",
async (PlacementPortalContext db) =>
{
    return await db.ApplicationTrackers
        .CountAsync(a => a.Status == "Offer");
});
app.MapGet("/api/faculty",
    async (PlacementPortalContext db) =>
    {
        var faculty = from f in db.Faculty
                      join u in db.Users
                      on f.UserID equals u.UserID
                      select new
                      {
                          f.FacultyID,
                          u.FullName,
                          f.Department
                      };

        return await faculty.ToListAsync();
    });
app.MapPost("/api/apply",
async (
    ApplicationTable application,
    PlacementPortalContext db
) =>
{
    application.AppliedDate = DateTime.Now;
    application.Status = "Applied";

    db.ApplicationTables.Add(application);

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        Message = "Application submitted"
    });
});
app.MapGet("/api/faculty/{id}",
async (int id, PlacementPortalContext db) =>
{
    var faculty =
        (from f in db.Faculty
         join u in db.Users
         on f.UserID equals u.UserID
         where f.FacultyID == id
         select new
         {
             f.FacultyID,
             u.FullName,
             f.Department
         }).FirstOrDefault();

    if (faculty == null)
        return Results.NotFound();

    var students =
        await db.StudentDetails
            .Where(s => s.Department == faculty.Department)
            .Select(s => new
            {
                s.StudentID,
                s.FullName,
                s.CGPA
            })
            .ToListAsync();

    return Results.Ok(new
    {
        faculty.FacultyID,
        faculty.FullName,
        faculty.Department,
        Students = students
    });
});
app.MapPost("/api/register",
async (RegisterRequest request,
       PlacementPortalContext db) =>
{
    var existingUser = await db.UserTables
        .FirstOrDefaultAsync(u =>
            u.Email == request.Email);

    if (existingUser != null)
    {
        return Results.BadRequest(
            "Email already exists");
    }

    var faculty = await db.Faculty
        .FirstOrDefaultAsync(f =>
            f.Department == request.Department);

    if (faculty == null)
    {
        return Results.BadRequest(
            "No faculty found for department");
    }

    var user = new UserTable
    {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = request.Password,
        Role = "Student"
    };

    db.UserTables.Add(user);
    await db.SaveChangesAsync();

    var student = new StudentTable
    {
        UserID = user.UserID,
        FacultyID = faculty.FacultyID,
        Department = request.Department,
        CGPA = request.CGPA,
        GraduationYear = request.GraduationYear
    };

    db.StudentTables.Add(student);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        Message = "Registration successful"
    });
});
app.MapPost("/api/login",
async (LoginRequest request, PlacementPortalContext db) =>
{
    var user = await db.Users
        .FirstOrDefaultAsync(u =>
            u.Email == request.Email &&
            u.PasswordHash == request.Password);

    if (user == null)
    {
        return Results.Unauthorized();
    }

    int? facultyId = null;

    if (user.Role == "Faculty")
    {
        facultyId = await db.Faculty
            .Where(f => f.UserID == user.UserID)
            .Select(f => f.FacultyID)
            .FirstOrDefaultAsync();
    }

    return Results.Ok(new
    {
        user.UserID,
        user.FullName,
        user.Role,
        FacultyID = facultyId
    });
});
app.MapGet("/api/students/{id}/skills",
async (int id, PlacementPortalContext db) =>
{
    var skills = await db.StudentSkills
        .Where(s => s.StudentID == id)
        .ToListAsync();

    return Results.Ok(skills);
});
app.MapPost("/api/students/{id}/skills",
async (
    int id,
    StudentSkillTable skill,
    PlacementPortalContext db
) =>
{
    var newSkill = new StudentSkillTable
    {
        StudentID = id,
        SkillName = skill.SkillName
    };

    db.StudentSkillTables.Add(newSkill);

    await db.SaveChangesAsync();

    return Results.Ok(newSkill);
});
app.MapDelete("/api/students/{id}/skills/{skillId}",
async (
    int id,
    int skillId,
    PlacementPortalContext db
) =>
{
    var skill = await db.StudentSkillTables
        .FirstOrDefaultAsync(
            s =>
                s.SkillID == skillId &&
                s.StudentID == id
        );

    if (skill == null)
    {
        return Results.NotFound();
    }

    db.StudentSkillTables.Remove(skill);

    await db.SaveChangesAsync();

    return Results.Ok();
});

app.MapGet("/api/faculty/{id}/dashboard",
async (int id, PlacementPortalContext db) =>
{
    var faculty =
        (from f in db.Faculty
         join u in db.Users
         on f.UserID equals u.UserID
         where f.FacultyID == id
         select new
         {
             f.FacultyID,
             u.FullName,
             f.Department
         }).FirstOrDefault();

    if (faculty == null)
        return Results.NotFound();

    var students = await db.StudentDetails
        .Where(s => s.Department == faculty.Department)
        .ToListAsync();
    var studentIds = students
    .Select(s => s.StudentID)
    .ToList();

    var appliedCount = await db.ApplicationTrackers
        .CountAsync(a =>
            a.Status == "Applied" &&
            studentIds.Contains(a.StudentID));

    var interviewCount = await db.ApplicationTrackers
        .CountAsync(a =>
            a.Status == "Interview" &&
            studentIds.Contains(a.StudentID));

    var offerCount = await db.ApplicationTrackers
        .CountAsync(a =>
            a.Status == "Offer" &&
            studentIds.Contains(a.StudentID));

    var rejectedCount = await db.ApplicationTrackers
        .CountAsync(a =>
            a.Status == "Rejected" &&
            studentIds.Contains(a.StudentID));

    return Results.Ok(new
    {
        faculty.FacultyID,
        faculty.FullName,
        faculty.Department,
        StudentCount = students.Count,

        AppliedCount = appliedCount,
        InterviewCount = interviewCount,
        OfferCount = offerCount,
        RejectedCount = rejectedCount,

        Students = students.Select(s => new
        {
            s.StudentID,
            s.FullName,
            s.CGPA
        })
    });
});
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}