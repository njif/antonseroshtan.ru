$(document).ready(function() {

	/* --- Variables --- */

	var screen = 0,
		container = $('.maincontent'),
		pages = $('.page-section'),
		inscroll = false,
		touchStartY = 0,
		timer = null;

	/* --- Helper functions --- */

	var isSwipeDown = function (event) {
		if (!event)
			return false;
		if (event.deltaY != null)
			return event.deltaY < 0;
		if (event.originalEvent)
		{
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pageY = touch.pageY;
			touch.pageY = 0;
			return pageY - touchStartY;
		}
		return false;
	};

	var checkInScroll = function() {
		if (inscroll)
			return true;

		inscroll = true;
		setTimeout(function(){
			inscroll = false;
		}, 1300);
	};

	var setCurrentScreen = function(event) {

		var activePage = pages.filter('.active');
		if (isSwipeDown(event)) {

			if (activePage.next().length) {
				screen++;
			}

		} else {

			if (activePage.prev().length) {
				screen--;
			}
		}

		pages.eq(screen).addClass('active').siblings().removeClass('active');
	};

	/* --- Setup --- */

	$('.page-section:first-child').addClass('active');

	/* --- Attach events --- */

	$('body').on('touchstart', function(event) {
		var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
		touchStartY = touch.pageY;
	}).on('mousewheel touchmove', function(event) {
		if (checkInScroll())
			return;
		setCurrentScreen(event);

		var position = (-screen * 100) + '%';
		container.css('top', position);
	});

});