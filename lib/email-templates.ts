export function getPremiumEmailTemplate(title: string, content: string) {
  // A premium creative graphic/painted vintage roses background
  const outerBg = "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=1200";
  // A subtle elegant transparent floral motif pattern for the inner text areas
  const innerPattern = "https://www.transparenttextures.com/patterns/black-orchid.png";
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0410; -webkit-font-smoothing: antialiased;">
  <!-- Added outer background image with fallbacks -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #0a0410; background-image: url('${outerBg}'); background-size: cover; background-position: center; padding: 60px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: rgba(26, 11, 46, 0.96); border-radius: 16px; overflow: hidden; border: 1px solid #d4af37; box-shadow: 0 20px 40px rgba(0,0,0,0.7);">
          
          <!-- Header (Dark Purple + Gold) -->
          <tr>
            <td align="center" style="padding: 50px 20px; background-color: rgba(15, 5, 24, 0.95); border-bottom: 2px solid #d4af37; background-image: url('${innerPattern}');">
              <h1 style="color: #d4af37; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase;">
                Preserved Piece
              </h1>
              <p style="color: #d1c5e5; margin: 12px 0 0 0; font-size: 15px; letter-spacing: 2px; font-style: italic;">
                Where Memories Become Eternal Art
              </p>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 50px; color: #e2d9f3; font-size: 15px; line-height: 1.8; background-image: url('${innerPattern}');">
              <h2 style="color: #d4af37; margin-top: 0; margin-bottom: 25px; font-weight: 400; font-size: 24px; letter-spacing: 1px; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 15px;">
                ${title}
              </h2>
              
              <div style="margin-top: 25px;">
                ${content.replace(/<p>/g, '<p style="margin: 0 0 15px 0;">')}
              </div>
              
              <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid rgba(212, 175, 55, 0.3);">
                <p style="margin: 0; font-style: italic; color: #d1c5e5;">With eternal gratitude,</p>
                <p style="margin: 8px 0 0 0; color: #d4af37; font-weight: 600; letter-spacing: 1px; font-size: 16px;">The Preserved Piece Artisans</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: #0f0518; color: #8b7ca0; font-size: 12px; line-height: 1.6; border-top: 1px solid #d4af37;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Preserved Piece. All rights reserved.</p>
              <p style="margin: 0;">Handcrafted with passion to perfectly capture your timeless moments.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
