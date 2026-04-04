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

        // POST: api/EventRegistrations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EventRegistration>> PostEventRegistration(EventRegistration eventRegistration)
        {
            _context.EventRegistrations.Add(eventRegistration);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEventRegistration", new { id = eventRegistration.Id }, eventRegistration);
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


    private bool EventRegistrationExists(int id)
        {
            return _context.EventRegistrations.Any(e => e.Id == id);
        }
    }
}
