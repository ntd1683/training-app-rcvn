<?php
namespace App\Enums;

use ValueError;

/**
 * Enum representing the status of a order timeline.
 *
 * @package    App\Enums
 * @author     Nguyen.Tan.Dung
 * @lastUpdate Nguyen.Tan.Dung
 */
enum OrderTimelineStatusEnum: int
{
    case PENDING = 0;
    case PROCESSING = 1;
    case COMPLETED = 2;
    case PAID = 3;
    case FAILED = 4;

    public static function fromValue(int $value): self
    {
        return match ($value) {
            0 => self::PENDING,
            1 => self::PROCESSING,
            2 => self::COMPLETED,
            3 => self::PAID,
            4 => self::FAILED,
            default => throw new ValueError("Giá trị $value không hợp lệ cho OrderStatus"),
        };
    }

    public static function allValues(): array
    {
        return [
            self::PENDING->value,
            self::PROCESSING->value,
            self::COMPLETED->value,
            self::PAID->value,
            self::FAILED->value,
        ];
    }
}
