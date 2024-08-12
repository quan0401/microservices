import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { authService } from '~/services/api/auth.service';

export class Password {
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.forgotPassword(req.body.email);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const response: AxiosResponse = await authService.resetPassword(req.params.token, password, confirmPassword);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
  public async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const response: AxiosResponse = await authService.changePassword(currentPassword, newPassword);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
