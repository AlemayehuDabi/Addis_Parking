import { All, Controller, Req, Res } from "@nestjs/common";
import { auth } from "lib/auth"; // path to your auth.ts
import { toNodeHandler } from "better-auth/node"; // Import this helper
import type { Request, Response } from "express"; // Use 'import type' to fix TS(1272)

@Controller('auth')
export class AuthController {
  @All(["", "/*"])
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Use toNodeHandler to fix TS(2554)
    return toNodeHandler(auth)(req, res);
  }
}