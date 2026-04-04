using System;
using System.Collections.Generic;

namespace ISA_API.Models;

public partial class GuestRegistration
{
    public int Id { get; set; }

    public int EventId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Organization { get; set; }

    public DateTime? RegisteredAt { get; set; }

    public virtual Event? Event { get; set; }
    
}
