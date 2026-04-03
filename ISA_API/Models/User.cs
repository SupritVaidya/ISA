using System;
using System.Collections.Generic;

namespace ISA_API.Models;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? StudentId { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? PasswordHash { get; set; }

    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();
}
