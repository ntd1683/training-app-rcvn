<?php

/**
 * Helper functions for HTML sanitization and purification.
 *
 * @package App\Helpers
 * @author LastName.FirstName
 * @version 1.0
 */

/**
 * Get HTMLPurifier configuration object with predefined safe settings.
 *
 * @return HTMLPurifier_Config The configured HTMLPurifier config object
 * @author Nguyen.Tan.Dung
 * @lastupdate Nguyen.Tan.Dung
 */

if (!function_exists('getHTMLPurifierConfig')) {
    function getHTMLPurifierConfig(): HTMLPurifier_Config
    {
        $config = HTMLPurifier_Config::createDefault();

        // Safe HTML tags for content formatting
        $config->set('HTML.Allowed', 'p,br,strong,em,u,h1,h2,h3,ul,ol,li,a, img');

        // Safe attributes for links
        $config->set(
            'HTML.AllowedAttributes',
            'a.href,a.target,a.rel,img.src,img.alt, img.width,img.height, img.class'
        );

        $config->set('HTML.SafeIframe', true);
        $config->set('URI.SafeIframeRegexp', '%^(https?:)?//%');

        // Dangerous elements that should never be allowed
        $config->set('HTML.ForbiddenElements', 'script,object,embed,form,input,iframe');

        // Dangerous attributes that can execute JavaScript
        $config->set('HTML.ForbiddenAttributes', 'onerror,onload,onclick,onmouseover');

        return $config;
    }
}

/**
 * Sanitize a filename by removing special characters and trimming whitespace.
 *
 * @param string $filename The original filename
 * @return string The sanitized filename
 * @author Nguyen.Tan.Dung
 * @lastupdate Nguyen.Tan.Dung
 */
if (!function_exists('sanitizeFilename')) {
    function sanitizeFilename(string $filename): string
    {
        // Remove special characters except for alphanumeric, underscores, dashes, and dots
        $sanitized = preg_replace('/[^\w\-.]/', '', $filename);
        // Trim whitespace
        return trim($sanitized);
    }
}
