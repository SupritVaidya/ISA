using System;
using System.Collections.Generic;

namespace ISA_API.Models;

public partial class GuestOtp
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public int EventId { get; set; }

    public string OtpCode { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public DateTime? CreatedAt { get; set; }
}
