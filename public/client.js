$(document).ready(function() {
	let parsedUrl = new URL(window.location.href);
	let link = parsedUrl.pathname.slice(1);
	$('#' + link).css('border-bottom', '.25rem solid white');

	bsCustomFileInput.init();
});

$('body').on('click', '[data-editable]', function() {
	var $el = $(this);

	var $input = $('<input/>').val($el.text());
	$el.replaceWith($input);

	var save = function() {
		//console.log('Nuevo valor: ', $input.val(), ' de campo ', $el.attr('id'));
		var $p = $('<span data-editable id=' + $el.attr('id') + '/>').text($input.val());
		$input.replaceWith($p);

		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			}
		};
		xhr.open('POST', '/updateList', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({ text: $input.val(), id: $el.attr('id') }));
	};
	$input.one('blur', save).focus();
});

$(function() {
	$('[data-toggle="popover"]').popover();
});
$('.popover-dismiss').popover({
	trigger: 'focus'
});
