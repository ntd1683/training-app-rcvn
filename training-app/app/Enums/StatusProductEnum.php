<?php
namespace App\Enums;

use ValueError;

enum StatusProductEnum: int
{
    case STOPPED = 0;
    case SELLING = 1;
    case OUT_OF_STOCK = 2;

    public static function fromValue(int $value): self
    {
        return match ($value) {
            0 => self::STOPPED,
            1 => self::SELLING,
            2 => self::OUT_OF_STOCK,
            default => throw new ValueError("Giá trị $value không hợp lệ cho ProductStatus"),
        };
    }
}
