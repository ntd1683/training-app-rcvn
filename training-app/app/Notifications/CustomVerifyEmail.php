<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmailBase implements ShouldQueue
{
    use Queueable;

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param mixed $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        $token = base64_encode(json_encode([
            'id' => $notifiable->getKey(),
            'hash' => sha1($notifiable->getEmailForVerification()),
            'expires' => Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60))->timestamp
        ]));

        return $frontendUrl . '/xac-thuc-email/' . $token;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        $content = "Cảm ơn bạn đã đăng ký tài khoản! Để hoàn tất quá trình đăng ký,
        vui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào nút bên dưới:";
        $textPass = "Nếu bạn không tạo tài khoản, vui lòng bỏ qua email này.";

        return (new MailMessage)
            ->subject('Xác thực địa chỉ email của bạn')
            ->view('emails.template_simple', [
                'user' => $notifiable,
                'url' => $verificationUrl,
                'content' => $content,
                'textPass' => $textPass,
            ]);
    }
}
