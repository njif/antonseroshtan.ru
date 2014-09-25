$(document).ready(function() {

	var screen = 0,
		container = $('.maincontent'),
		pages = $('.page-section'),
		inscroll = false,
		touchStartY = 0;

	$('body').on('touchstart', function(event) {
		var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
		touchStartY = touch.pageY;
	});

	var isSwipeDown = function (event) {
		if (event.deltaY != null)
			return event.deltaY > 0;
		if (event.originalEvent)
		{
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pageY = touch.pageY;
			touch.pageY = 0;
			return pageY - touchStartY;
		}
		return false;
	};

	$('.page-section:first-child').addClass('active');

	$('body').on('mousewheel touchmove', function(event) {

		var activePage = pages.filter('.active');

		if (!inscroll) {
			inscroll = true;

			if (isSwipeDown(event) > 0) {

				if (activePage.prev().length) {
					screen--;
				}

			} else {

				if (activePage.next().length) {
					screen++;
				}
			}
		}

		var position = (-screen * 100) + '%';

		pages.eq(screen).addClass('active').siblings().removeClass('active');
		container.css('top', position);

		setTimeout(function(){
			inscroll = false;
		}, 1300);
	});

});