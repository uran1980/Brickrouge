<?php

/*
 * This file is part of the Brickrouge package.
 *
 * (c) Olivier Laviale <olivier.laviale@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Brickrouge;

/**
 * The ROOT directory of the Brickrouge framework.
 *
 * @var string
 */
defined('Brickrouge\ROOT') or define('Brickrouge\ROOT', __DIR__ . DIRECTORY_SEPARATOR);

/**
 * The DOCUMENT_ROOT directory used by the Brickrouge framework.
 *
 * We ensure that the directory separator is indeed the directory separator used by the file
 * system. e.g. "c:path/to/my/root" is changed to "c:path\to\my\root" if the directory
 * separator is "\".

 * @var string
 */
if (!defined('Brickrouge\DOCUMENT_ROOT'))
{
	if (defined('ICanBoogie\DOCUMENT_ROOT'))
	{
		define('Brickrouge\DOCUMENT_ROOT', \ICanBoogie\DOCUMENT_ROOT);
	}
	else
	{
		define('Brickrouge\DOCUMENT_ROOT', rtrim(strtr($_SERVER['DOCUMENT_ROOT'], DIRECTORY_SEPARATOR == '/' ? '\\' : '/', DIRECTORY_SEPARATOR), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR);
	}
}

/**
 * Path to the Brickrouge's assets directory.
 *
 * @var string
 */
define('Brickrouge\ASSETS', ROOT . 'assets' . DIRECTORY_SEPARATOR);

/**
 * Path to the directory used to stored files which are not web accessible, such as the assets in
 * the Phar. The {@link Document::resolve_url()} method use this directory to make files
 * files web accessible.
 *
 * @var string
 */
defined('Brickrouge\ACCESSIBLE_ASSETS') or define('Brickrouge\ACCESSIBLE_ASSETS', DOCUMENT_ROOT . 'public' . DIRECTORY_SEPARATOR . 'brickrouge' . DIRECTORY_SEPARATOR);

/**
 * Charset used by the Brickrouge framework.
 *
 * @var string
 */
if (!defined('Brickrouge\CHARSET'))
{
	define('Brickrouge\CHARSET', 'utf-8');
}

/*
 * Add package path to ICanBoogie so that it can discover our config and locale messages.
 */
if (class_exists('ICanBoogie\Core', true))
{
	\ICanBoogie\Core::add_path(__DIR__);
}