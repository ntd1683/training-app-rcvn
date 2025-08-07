<?php
namespace App\Enums;

use ValueError;

/**
 * Enum representing the status of a payment.
 *
 * @package    App\Enums
 * @author     Nguyen.Tan.Dung
 * @lastUpdate Nguyen.Tan.Dung
 */
enum PaymentStatusEnum: int
{
    case PENDING = 0;
    case PROCESSING = 1;
    case COMPLETED = 2;

    public static function fromValue(int $value): self
    {
        return match ($value) {
            0 => self::PENDING,
            1 => self::PROCESSING,
            2 => self::COMPLETED,
            default => throw new ValueError("Giá trị $value không hợp lệ cho PaymentStatus"),
        };
    }

    public static function allValues(): array
    {
        return [
            self::PENDING->value,
            self::PROCESSING->value,
            self::COMPLETED->value,
        ];
    }
}
