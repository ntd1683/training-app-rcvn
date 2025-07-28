<?php
namespace App\Enums;

use ValueError;

/**
 * Enum representing default roles in the application.
 *
 * @package App\Enums
 * @author Nguyen.Tan.Dung
 * @lastUpdate Nguyen.Tan.Dung
 */
enum DefaultRoleEnum: int
{
    case USER = -1; // Default user role, not used in the system
    case REVIEWER = 0;
    case EDITOR = 1;
    case ADMIN = 2;
    case SUPER_ADMIN = 3;

    /**
     * Get value from name.
     * @param string $name
     * @return int
     * @author Nguyen.Tan.Dung
     * @lastUpdate Nguyen.Tan.Dung
     */
    public static function getValueFromName(string $name): int
    {
        return match ($name) {
            'User' => self::USER->value,
            'Reviewer' => self::REVIEWER->value,
            'Editor' => self::EDITOR->value,
            'Admin' => self::ADMIN->value,
            'SuperAdmin' => self::SUPER_ADMIN->value,
            default => 1,
        };
    }
}
