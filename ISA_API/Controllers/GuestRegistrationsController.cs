using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ISA_API.Models;

namespace ISA_API.Controllers
{
  public record SendOtpRequest(string Email, int EventId, string Name, string? Organization);
  public record VerifyOtpRequest(string Email, int EventId, string OtpCode, string Name, string? Organization);

  [Route("api/[controller]")]
    [ApiController]
    public class GuestRegistrationsController : ControllerBase
    {
        private readonly IsaContext _context;


    public GuestRegistrationsController(IsaContext context)
        {
            _context = context;
        }

        // GET: api/GuestRegistrations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GuestRegistration>>> GetGuestRegistrations()
        {
            return await _context.GuestRegistrations.ToListAsync();
        }

        // GET: api/GuestRegistrations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GuestRegistration>> GetGuestRegistration(int id)
        {
            var guestRegistration = await _context.GuestRegistrations.FindAsync(id);

            if (guestRegistration == null)
            {
                return NotFound();
            }

            return guestRegistration;
        }

        // PUT: api/GuestRegistrations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGuestRegistration(int id, GuestRegistration guestRegistration)
        {
            if (id != guestRegistration.Id)
            {
                return BadRequest();
            }

            _context.Entry(guestRegistration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuestRegistrationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/GuestRegistrations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GuestRegistration>> PostGuestRegistration(GuestRegistration guestRegistration)
        {
            _context.GuestRegistrations.Add(guestRegistration);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGuestRegistration", new { id = guestRegistration.Id }, guestRegistration);
        }

        // DELETE: api/GuestRegistrations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuestRegistration(int id)
        {
            var guestRegistration = await _context.GuestRegistrations.FindAsync(id);
            if (guestRegistration == null)
            {
                return NotFound();
            }

            _context.GuestRegistrations.Remove(guestRegistration);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
    {
      var alreadyRegistered = await _context.GuestRegistrations
          .AnyAsync(g => g.Email == request.Email && g.EventId == request.EventId);

      if (alreadyRegistered)
        return Conflict("This email is already registered for this event.");

      var otp = new Random().Next(100000, 999999).ToString();

      var oldOtps = _context.GuestOtps
          .Where(o => o.Email == request.Email && o.EventId == request.EventId);
      _context.GuestOtps.RemoveRange(oldOtps);

      _context.GuestOtps.Add(new GuestOtp
      {
        Email = request.Email,
        EventId = request.EventId,
        OtpCode = otp,
        ExpiresAt = DateTime.UtcNow.AddMinutes(10)
      });

      await _context.SaveChangesAsync();

      // Send email
      using var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
      {
        Credentials = new System.Net.NetworkCredential("suprit.vaidya@gmail.com", "kcxd wkbr kcoc spbh"),
        EnableSsl = true
      };

      var mail = new System.Net.Mail.MailMessage
      {
        From = new System.Net.Mail.MailAddress("suprit.vaidya@gmail.com", "ISA Koblenz"),
        Subject = "Your ISA Event Registration OTP",
        Body = $"Your OTP is: {otp}\n\nThis code expires in 10 minutes.",
        IsBodyHtml = false
      };
      mail.To.Add(request.Email);
      await smtp.SendMailAsync(mail);

      return Ok("OTP sent successfully.");
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
      var otpRecord = await _context.GuestOtps
          .FirstOrDefaultAsync(o => o.Email == request.Email && o.EventId == request.EventId);

      if (otpRecord == null)
        return NotFound("No OTP found. Please request a new one.");

      if (otpRecord.ExpiresAt < DateTime.UtcNow)
      {
        _context.GuestOtps.Remove(otpRecord);
        await _context.SaveChangesAsync();
        return BadRequest("OTP has expired. Please request a new one.");
      }

      if (otpRecord.OtpCode != request.OtpCode)
        return BadRequest("Invalid OTP.");

      var registration = new GuestRegistration
      {
        EventId = request.EventId,
        Name = request.Name,
        Email = request.Email,
        Organization = request.Organization,
        RegisteredAt = DateTime.UtcNow
      };

      _context.GuestRegistrations.Add(registration);
      _context.GuestOtps.Remove(otpRecord);
      await _context.SaveChangesAsync();

      var eventDetails = await _context.Events.FindAsync(request.EventId);

      var qrData = System.Text.Json.JsonSerializer.Serialize(new
      {
        name = request.Name,
        email = request.Email,
        organization = request.Organization,
        @event = eventDetails!.Title,
        date = eventDetails.EventDate.ToString("yyyy-MM-dd"),
        location = eventDetails.Location
      });

      using var qrGenerator = new QRCoder.QRCodeGenerator();
      var qrCodeData = qrGenerator.CreateQrCode(qrData, QRCoder.QRCodeGenerator.ECCLevel.Q);
      using var qrCode = new QRCoder.PngByteQRCode(qrCodeData);
      var qrBytes = qrCode.GetGraphic(10);
      var qrBytesCopy = qrBytes.ToArray();

      var guestName = request.Name;
      var guestEmail = request.Email;
      var eventTitle = eventDetails.Title;
      var eventDate = eventDetails.EventDate;
      var eventLocation = eventDetails.Location;

      _ = Task.Run(async () =>
      {
        try
        {
          using var ms = new System.IO.MemoryStream(qrBytesCopy);
          var linkedResource = new System.Net.Mail.LinkedResource(ms, "image/png") { ContentId = "qrcode" };

          var htmlBody = $@"
                <h2>You're registered!</h2>
                <p>Hi {guestName},</p>
                <p>Your registration for <strong>{eventTitle}</strong> is confirmed.</p>
                <p><strong>Date:</strong> {eventDate:MMMM d, yyyy}</p>
                <p><strong>Location:</strong> {eventLocation}</p>
                <p>Please show the QR code below at the event entrance:</p>
                <img src='cid:qrcode' alt='QR Code' style='width:250px;height:250px;'/>
                <br/><br/>
                <p>See you there!<br/>ISA Koblenz Team</p>
            ";

          var alternateView = System.Net.Mail.AlternateView.CreateAlternateViewFromString(htmlBody, null, "text/html");
          alternateView.LinkedResources.Add(linkedResource);

          using var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
          {
            Credentials = new System.Net.NetworkCredential("suprit.vaidya@gmail.com", "kcxd wkbr kcoc spbh"),
            EnableSsl = true
          };

          var mail = new System.Net.Mail.MailMessage
          {
            From = new System.Net.Mail.MailAddress("suprit.vaidya@gmail.com", "ISA Koblenz"),
            Subject = $"Registration Confirmed — {eventTitle}"
          };
          mail.AlternateViews.Add(alternateView);
          mail.To.Add(guestEmail);
          await smtp.SendMailAsync(mail);
        }
        catch (Exception ex)
        {
          Console.WriteLine($"Email failed: {ex.Message}");
        }
      });

      return Ok(registration);
    }



    [HttpGet("details")]
    public async Task<IActionResult> GetGuestRegistrationsWithDetails()
    {
      var registrations = await _context.GuestRegistrations
          .Include(r => r.Event)
          .Select(r => new {
            r.Id,
            r.Name,
            r.Email,
            r.Organization,
            r.RegisteredAt,
            Event = new { r.Event!.Title, r.Event.EventDate, r.Event.Location }
          })
          .ToListAsync();

      return Ok(registrations);
    }



    private bool GuestRegistrationExists(int id)
        {
            return _context.GuestRegistrations.Any(e => e.Id == id);
        }
    }
}
