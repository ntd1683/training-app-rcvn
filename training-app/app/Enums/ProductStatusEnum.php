<?php
namespace App\Enums;

use ValueError;

/**
 * Enum representing the status of a product.
 *
 * @package    App\Enums
 * @author     Nguyen.Tan.Dung
 * @lastUpdate Nguyen.Tan.Dung
 */
enum ProductStatusEnum: int
{
    case STOPPED = 0;
    case SELLING = 1;
    case OUT_OF_STOCK = 2;
    case BOTH = 3; // Optional, if you want to show both selling and out of stock products

    public static function fromValue(int $value): self
    {
        return match ($value) {
            0 => self::STOPPED,
            1 => self::SELLING,
            2 => self::OUT_OF_STOCK,
            default => throw new ValueError("Giá trị $value không hợp lệ cho ProductStatus"),
        };
    }

    public static function getBoth(int $value): bool
    {
        return $value === self::BOTH->value;
    }
}
