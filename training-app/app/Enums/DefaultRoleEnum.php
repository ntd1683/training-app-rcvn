<?php
namespace App\Enums;

use ValueError;

enum DefaultRoleEnum: int
{
    case REVIEWER = 0;
    case EDITOR = 1;
    case ADMIN = 2;
    case SUPER_ADMIN = 3;

    public static function fromValue(int $value): self
    {
        return match ($value) {
            0 => self::REVIEWER,
            1 => self::EDITOR,
            2 => self::ADMIN,
            3 => self::SUPER_ADMIN,
            default => throw new ValueError("Giá trị không hợp lệ cho DefaultRoleEnum: $value"),
        };
    }

    public static function getValueFromName(string $name): int
    {
        return match ($name) {
            'Reviewer' => self::REVIEWER->value,
            'Editor' => self::EDITOR->value,
            'Admin' => self::ADMIN->value,
            'SuperAdmin' => self::SUPER_ADMIN->value,
            default => 1,
        };
    }
}
