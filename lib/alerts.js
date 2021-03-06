/*
 * This file is part of the Brickrouge package.
 *
 * (c) Olivier Laviale <olivier.laviale@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Destroy the alert message when its close icon is clicked.
 *
 * If the alert message is in a FORM element the "error" class is removed from its elements.
 */
document.body.addEvent('click:relay(.alert a.close)', function(ev, target) {

	var form = target.getParent('form')

	ev.stop()

	if (form) form.getElements('.error').removeClass('error')

	target.getParent('.alert').destroy()
})

document.body.addEvent('click:relay([data-dismiss="alert"])', function(ev, target) {

	var alert = target.getParent('.alert')
	var form = alert.getParent('form')

	ev.stop()

	if (form) form.getElements('.error').removeClass('error')

	alert.destroy()
})