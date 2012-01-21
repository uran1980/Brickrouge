<?php

$lib = $path . 'lib' . DIRECTORY_SEPARATOR;
$element = $lib . 'element' . DIRECTORY_SEPARATOR;
$renderer = $lib . 'renderer' . DIRECTORY_SEPARATOR;
$widget = $lib . 'widget' . DIRECTORY_SEPARATOR;

return array
(
	'autoload' => array
	(
		'BrickRouge\A' => $element . 'a.php',
		'BrickRouge\AlertMessage' => $element . 'alert-message.php',
		'BrickRouge\Button' => $element . 'button.php',
		'BrickRouge\Date' => $element . 'date.php',
		'BrickRouge\DateRange' => $element . 'date-range.php',
		'BrickRouge\DateTime' => $element . 'date-time.php',
		'BrickRouge\Document' => $lib . 'document.php',
		'BrickRouge\Element' => $element . 'element.php',
		'BrickRouge\File' => $element . 'file.php',
		'BrickRouge\Form' => $element . 'form.php',
		'BrickRouge\Form\Templated' => $element . 'form.templated.php',
		'BrickRouge\Group' => $element . 'group.php',
		'BrickRouge\Pager' => $element . 'pager.php',
		'BrickRouge\Popover' => $element . 'popover.php',
		'BrickRouge\PopoverWidget' => $element . 'popover.php',
		'BrickRouge\Ranger' => $element . 'ranger.php',
		'BrickRouge\Salutation' => $element . 'salutation.php',
		'BrickRouge\Searchbox' => $widget . 'searchbox.php',
		'BrickRouge\Text' => $element . 'text.php',
		'BrickRouge\Element\Templated' => $element . 'element.templated.php',
		'BrickRouge\Renderer\Simple' => $renderer . 'simple.php',
		'BrickRouge\Validator' => $lib . 'validator.interface.php'
	)
	+ (defined('ICanBoogie\VERSION') ? array() : array
	(
		'ICanBoogie\Errors' => $lib . 'icanboogie/errors.php',
		'ICanBoogie\Object' => $lib . 'icanboogie/object.php'
	)),

	'cache assets' => false
);