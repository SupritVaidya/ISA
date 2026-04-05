using Microsoft.AspNetCore.Mvc;

namespace ISA_API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ContactController : ControllerBase
  {
    private readonly IConfiguration _config;

    public ContactController(IConfiguration config)
    {
      _config = config;
    }

    public class ContactRequest
    {
      public string Name { get; set; } = "";
      public string Email { get; set; } = "";
      public string Message { get; set; } = "";
    }

    [HttpPost]
    public IActionResult SendContact([FromBody] ContactRequest request)
    {
      var recipient = _config["Email:ContactRecipient"] ?? "suprit.vaidya@gmail.com";

      _ = Task.Run(async () =>
      {
        try
        {
          var htmlBody = $@"
                        <h2>New Contact Form Message</h2>
                        <p><strong>From:</strong> {request.Name} ({request.Email})</p>
                        <p><strong>Message:</strong></p>
                        <p>{request.Message}</p>
                    ";

          using var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
          {
            Credentials = new System.Net.NetworkCredential("suprit.vaidya@gmail.com", "kcxd wkbr kcoc spbh"),
            EnableSsl = true
          };

          var mail = new System.Net.Mail.MailMessage
          {
            From = new System.Net.Mail.MailAddress("suprit.vaidya@gmail.com", "ISA Koblenz"),
            Subject = $"Contact Form — {request.Name}",
            Body = htmlBody,
            IsBodyHtml = true
          };
          mail.To.Add(recipient);
          mail.ReplyToList.Add(new System.Net.Mail.MailAddress(request.Email, request.Name));

          await smtp.SendMailAsync(mail);
        }
        catch (Exception ex)
        {
          Console.WriteLine($"Contact email failed: {ex.Message}");
        }
      });

      return Ok();
    }
  }
}
