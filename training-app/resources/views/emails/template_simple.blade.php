<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #0167F3;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            color: #fff;
            background-color: #081828;
            -webkit-box-shadow: 0px 4px 4px #0000000f;
            box-shadow: 0px 4px 4px #0000000f;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 12px;
            color: #6c757d;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="header">
    <div class="logo">{{ config('app.website_name') }}</div>
    <h1>Xác thực địa chỉ email</h1>
</div>

<div class="content">
    <h2>Xin chào {{ $user->name }},</h2>

    <p>{{ $content }}</p>

    <div style="text-align: center;">
        <a href="{{ $url }}" class="button">Xác thực Email</a>
    </div>

    <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
    <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
        {{ $url }}
    </p>

    <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 60 phút.</p>

    <div class="footer">
        <p>{{ $textPass }}</p>
        <p>© {{ date('Y') }} {{ config('app.website_name') }}. Tất cả quyền được bảo lưu.</p>
    </div>
</div>
</body>
</html>
