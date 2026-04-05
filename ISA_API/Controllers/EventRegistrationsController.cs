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
    [Route("api/[controller]")]
    [ApiController]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly IsaContext _context;

        public EventRegistrationsController(IsaContext context)
        {
            _context = context;
        }

        // GET: api/EventRegistrations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventRegistration>>> GetEventRegistrations()
        {
            return await _context.EventRegistrations.ToListAsync();
        }

        // GET: api/EventRegistrations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventRegistration>> GetEventRegistration(int id)
        {
            var eventRegistration = await _context.EventRegistrations.FindAsync(id);

            if (eventRegistration == null)
            {
                return NotFound();
            }

            return eventRegistration;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<EventRegistration>>> GetRegistrationsByUserId(int userId)
        {
            var registrations = await _context.EventRegistrations
                .Where(er => er.UserId == userId)
                .ToListAsync();

            return registrations;
        }

        // PUT: api/EventRegistrations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEventRegistration(int id, EventRegistration eventRegistration)
        {
            if (id != eventRegistration.Id)
            {
                return BadRequest();
            }

            _context.Entry(eventRegistration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventRegistrationExists(id))
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

        // DELETE: api/EventRegistrations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventRegistration(int id)
        {
            var eventRegistration = await _context.EventRegistrations.FindAsync(id);
            if (eventRegistration == null)
            {
                return NotFound();
            }

            _context.EventRegistrations.Remove(eventRegistration);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("details")]
        public async Task<IActionResult> GetRegistrationsWithDetails()
        {
          var registrations = await _context.EventRegistrations
              .Include(r => r.User)
              .Include(r => r.Event)
              .Select(r => new {
                r.Id,
                r.RegisteredAt,
                User = new { r.User!.FirstName, r.User.LastName, r.User.Email, r.User.StudentId },
                Event = new { r.Event!.Title, r.Event.EventDate, r.Event.Location }
              })
              .ToListAsync();

          return Ok(registrations);
        }

    [HttpPost]
    public async Task<ActionResult<EventRegistration>> PostEventRegistration(EventRegistration eventRegistration)
    {
      _context.EventRegistrations.Add(eventRegistration);
      await _context.SaveChangesAsync();

      var user = await _context.Users.FindAsync(eventRegistration.UserId);
      var eventDetails = await _context.Events.FindAsync(eventRegistration.EventId);

      if (user != null && eventDetails != null)
      {
        try
        {
          var qrData = System.Text.Json.JsonSerializer.Serialize(new
          {
            name = $"{user.FirstName} {user.LastName}",
            email = user.Email,
            studentId = user.StudentId,
            @event = eventDetails.Title,
            date = eventDetails.EventDate.ToString("yyyy-MM-dd"),
            location = eventDetails.Location
          });

          using var qrGenerator = new QRCoder.QRCodeGenerator();
          var qrCodeData = qrGenerator.CreateQrCode(qrData, QRCoder.QRCodeGenerator.ECCLevel.Q);
          using var qrCode = new QRCoder.PngByteQRCode(qrCodeData);
          var qrBytes = qrCode.GetGraphic(10);
          var qrBytesCopy = qrBytes.ToArray();

          var userName = user.FirstName;
          var userEmail = user.Email;
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
                        <p>Hi {userName},</p>
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
              mail.To.Add(userEmail);
              await smtp.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
              Console.WriteLine($"Email failed: {ex.Message}");
            }
          });
        }
        catch (Exception ex)
        {
          Console.WriteLine($"QR/Email setup failed: {ex.Message}");
        }
      }

      return CreatedAtAction("GetEventRegistration", new { id = eventRegistration.Id }, eventRegistration);
    }




    private bool EventRegistrationExists(int id)
        {
            return _context.EventRegistrations.Any(e => e.Id == id);
        }
    }
}
