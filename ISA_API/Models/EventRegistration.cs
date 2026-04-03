using System;
using System.Collections.Generic;

namespace ISA_API.Models;

public partial class EventRegistration
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int EventId { get; set; }

    public DateTime RegisteredAt { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
