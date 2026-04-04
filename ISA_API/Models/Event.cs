using System;
using System.Collections.Generic;

namespace ISA_API.Models;

public partial class Event
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime EventDate { get; set; }

    public string? Location { get; set; }

    public string? ImageUrl { get; set; }

    public int? MaxCapacity { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();

    public virtual ICollection<GuestRegistration> GuestRegistrations { get; set; } = new List<GuestRegistration>();
}
