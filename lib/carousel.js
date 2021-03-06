/*
 * This file is part of the Brickrouge package.
 *
 * (c) Olivier Laviale <olivier.laviale@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Animates a carousel.
 */
Brickrouge.Carousel = new Class({

	Implements: [ Options, Events ],

	options: {

		autodots: false,
		autoplay: false,
		delay: 6000,
		method: 'fade'
	},

	initialize: function(el, options)
	{
		this.element = el = document.id(el)
		this.setOptions(options)
		this.inner = el.getElement('.carousel-inner')
		this.slides = this.inner.getChildren()
		this.limit = this.slides.length
		this.position = 0
		this.timer = null

		if (this.options.method)
		{
			this.setMethod(this.options.method)

			if (this.method.initialize)
			{
				this.method.initialize.apply(this)
			}
		}

		if (this.options.autodots)
		{
			this.setDots(this.slides.length)
		}

		this.dots = el.getElements('.carousel-dots .dot')

		if (!this.dots.length)
		{
			this.dots = null
		}

		if (this.dots)
		{
			this.dots[0].addClass('active')
		}

		el.addEvents({

			'click:relay([data-slide="prev"])': function(ev) {

				ev.stop()
				this.prev()

			}.bind(this),

			'click:relay([data-slide="next"])': function(ev) {

				ev.stop()
				this.next()

			}.bind(this),

			'click:relay([data-position])': function(ev, el) {

				ev.stop()
				this.setPosition(el.get('data-position'))

			}.bind(this),

			'click:relay([data-link])': function(ev, el) {

				var link = el.get('data-link')

				if (!link) return

				document.location = link
			},

			mouseenter: this.pause.bind(this),
			mouseleave: this.resume.bind(this)

		})

		this.resume()
	},

	setDots: function(number)
	{
		var dots = new Element('div.carousel-dots')
		, replaces = this.element.getElement('.carousel-dots')

		for (var i = 0 ; i < number ; i++)
		{
			dots.adopt(new Element('div.dot', { html: '&bull;', 'data-position': i }))
		}

		if (replaces)
		{
			dots.replaces(replaces)
		}
		else
		{
			this.element.adopt(dots)
		}
	},

	setMethod: function(method)
	{
		if (typeOf(method) == 'string')
		{
			var m = Brickrouge.Carousel.Methods[method]

			if (m === undefined)
			{
				throw new Error('Carousel method is not defined: ' + method)
			}

			method = m
		}

		this.method = method

		if (method.next) this.next = method.next
		if (method.prev) this.prev = method.prev
	},

	play: function()
	{
		if (this.timer) return

		this.timer = (function() {

			this.setPosition(this.position + 1)

		}).periodical(this.options.delay, this)

		this.fireEvent('play', { position: this.position, slide: this.slides[this.position] })
	},

	pause: function()
	{
		if (!this.timer) return

		clearInterval(this.timer)
		this.timer = null

		this.fireEvent('pause', { position: this.position, slide: this.slides[this.position] })
	},

	resume: function()
	{
		if (!this.options.autoplay) return

		this.play()
	},

	setPosition: function(position, direction)
	{
		position = position % this.limit

		if (position == this.position) return

		this.method.go.apply(this, [ position, direction ])

		if (this.dots)
		{
			this.dots.removeClass('active')
			this.dots[position].addClass('active')
		}

		this.fireEvent('position', { position: this.position, slide: this.slides[this.position] })
	},

	prev: function()
	{
		this.setPosition(this.position ? this.position - 1 : this.limit - 1, -1)
	},

	next: function()
	{
		this.setPosition(this.position == this.limit ? 0 : this.position + 1, 1)
	}
})

/**
 * Carousel methods.
 */
Brickrouge.Carousel.Methods = {

	fade: {

		initialize: function()
		{
			this.slides.each(function(slide, i) {

				slide.setStyles({

					left: 0,
					top: 0,
					position: 'absolute',
					opacity: i ? 0 : 1,
					visibility: i ? 'hidden' : 'visible',
				})
			})
		},

		go: function(position)
		{
			var slideOut = this.slides[this.position]
			, slideIn = this.slides[position]

			slideIn.setStyles({ opacity: 0, visibility: 'visible' }).inject(slideOut, 'after').fade('in')

			this.position = position
		}
	},

	slide: {

		initialize: function()
		{
			var size = this.inner.getSize()
			, w = size.x
			, h = size.y
			, view = new Element('div', { styles: { position: 'absolute', left: 0, top: 0, width: w * 2, height: h }})

			this.w = w
			this.h = h
			this.view = view

			view.adopt(this.slides)
			view.set('tween', { property: 'left', onComplete: Brickrouge.Carousel.Methods.slide.onComplete.bind(this) })

			this.slides.each(function(slide, i) {

				slide.setStyles({ position: 'absolute', left: w * i, top: 0 })

				if (i)
				{
					slide.setStyle('display', 'none')
				}
			})

			this.inner.adopt(view)
		},

		go: function(position, direction)
		{
			var slideIn = this.slides[position]
			, slideOut = this.slides[this.position]

			if (!direction)
			{
				direction = position - this.position
			}

			this.view.setStyle('left', 0)
			slideOut.setStyle('left', 0)
			slideIn.setStyles({ display: '', left: direction > 0 ? this.w : -this.w })

			this.view.tween(direction > 0 ? -this.w : this.w)

			this.position = position
		},

		onComplete: function(ev)
		{
			var current = this.slides[this.position]

			this.slides.each(function(slide) {

				if (slide == current) return

				slide.setStyle('display', 'none')

			})
		}
	},

	columns: {

		initialize: function()
		{
			this.working = false
			this.fitting = 0
			this.childWidth = 0

			var offset = 0
			, totalWidth = 0
			, width = 0
			, visible_w = this.element.getSize().x

			this.view = new Element
			(
				'div',
				{
					'styles':
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: this.element.getStyle('height'),
					}
				}
			);

			this.view.adopt(this.slides);
			this.view.inject(this.inner);
			this.view.set('tween', { property: 'left' });

			this.slides.each
			(
				function(el)
				{
					if (el.get('data-url'))
					{
						el.setStyle('cursor', 'pointer')
					}

					var w = el.getSize().x + el.getStyle('margin-left').toInt() + el.getStyle('margin-right').toInt()

					el.setStyles
					({
						'position': 'absolute',
						'top': 0,
						'left': offset
					})

					offset += w
					totalWidth += w
					width = Math.max(width, w)
				},

				this
			);

			this.childWidth = width
			this.fitting = (visible_w / width).floor()
			this.view.setStyle('width', totalWidth)
		},

		go: function(position)
		{
			var n = this.limit
			, diff = this.position - position
			, to_uncover = null
			, left = 0

			if (this.working)
			{
				return;
			}

			this.working = true;

//				console.log('request position: %d (current: %d), diff: %d (count: %d)', position, this.position, diff, n);

			to_uncover = (diff < 0) ? this.position + this.fitting : this.position - diff

			if (to_uncover < 0)
			{
//					console.log('uncover out of range %d (%d)', to_uncover, n);

				to_uncover = n + to_uncover
			}
			else if (to_uncover > n - 1)
			{
//					console.log('uncover out of range %d (%d)', to_uncover, n);

				to_uncover = to_uncover - n
			}

			if (position < 0)
			{
				position = n - diff
			}
			else
			{
				position = position % n
			}

			this.position = position

//				console.log('final position: %d (%d), final uncover: %d', position, this.position, to_uncover);

			left = diff < 0 ? this.childWidth * this.fitting : -this.childWidth

//				console.log('left: ', left);

			this.slides[to_uncover].setStyle('left', left)

			this.view.get('tween').start(this.childWidth * diff).chain
			(
				function()
				{
					var i = position
					, offset = 0
					, w = this.childWidth

					for ( ; i < n ; i++, offset += w)
					{
						this.slides[i].setStyle('left', offset)
					}

					for (i = 0 ; i < position ; i++, offset += w)
					{
						this.slides[i].setStyle('left', offset);
					}

					this.view.setStyle('left', 0);

					this.working = false;
				}
				.bind(this)
			);
		},

		next: function()
		{
			this.setPosition(this.position + 1)
		},

		prev: function()
		{
			this.setPosition(this.position - 1)
		}
	}
}

Brickrouge.Widget.Carousel = new Class({

	Extends: Brickrouge.Carousel

})