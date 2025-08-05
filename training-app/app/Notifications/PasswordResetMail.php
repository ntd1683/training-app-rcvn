<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

class PasswordResetMail extends ResetPasswordBase
{
    /**
     * Get the verification URL for the given notifiable.
     *
     * @param mixed $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        $token = $this->token;
        return $frontendUrl . '/khoi-phuc-mat-khau/' . $token;
    }

    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        $content = "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
        Vui lòng nhấp vào nút bên dưới để tiến hành đặt lại mật khẩu:";
        $textPass = "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.";
        $title = "Khôi phục mật khẩu";
        $button = "Khôi phục mật khẩu";

        return (new MailMessage)
            ->subject('Khôi phục mật khẩu')
            ->view('emails.template_simple', [
                'title' => $title,
                'user' => $notifiable,
                'url' => $verificationUrl,
                'content' => $content,
                'textPass' => $textPass,
                'button' => $button,
            ]);
    }
}
