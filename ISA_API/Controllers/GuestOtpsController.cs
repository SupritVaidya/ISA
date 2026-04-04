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
    public class GuestOtpsController : ControllerBase
    {
        private readonly IsaContext _context;

        public GuestOtpsController(IsaContext context)
        {
            _context = context;
        }

        // GET: api/GuestOtps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GuestOtp>>> GetGuestOtps()
        {
            return await _context.GuestOtps.ToListAsync();
        }

        // GET: api/GuestOtps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GuestOtp>> GetGuestOtp(int id)
        {
            var guestOtp = await _context.GuestOtps.FindAsync(id);

            if (guestOtp == null)
            {
                return NotFound();
            }

            return guestOtp;
        }

        // PUT: api/GuestOtps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGuestOtp(int id, GuestOtp guestOtp)
        {
            if (id != guestOtp.Id)
            {
                return BadRequest();
            }

            _context.Entry(guestOtp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuestOtpExists(id))
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

        // POST: api/GuestOtps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GuestOtp>> PostGuestOtp(GuestOtp guestOtp)
        {
            _context.GuestOtps.Add(guestOtp);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGuestOtp", new { id = guestOtp.Id }, guestOtp);
        }

        // DELETE: api/GuestOtps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuestOtp(int id)
        {
            var guestOtp = await _context.GuestOtps.FindAsync(id);
            if (guestOtp == null)
            {
                return NotFound();
            }

            _context.GuestOtps.Remove(guestOtp);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GuestOtpExists(int id)
        {
            return _context.GuestOtps.Any(e => e.Id == id);
        }
    }
}
