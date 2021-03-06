(function(module){
	var $ = require('jquery');
	var $msgBox = $('<div class="theme_ui_px_message">');
	$(function(){
		$('body').append($msgBox);
	});

	module.exports = function( message, opt ) {

		opt = opt || {};
		opt.complete = opt.complete || function(){};
		var $newMsg = $('<div>')
			.text(message)
			.css({
				'background': '#ffd',
				'text-align': 'center',
				'border': '1px solid #f93',
				'color': '#f93',
				'padding': 4,
				'margin': "10px 40px"
			})
			.hide()
		;
		$msgBox.append(
			$newMsg
				.hide()
				.fadeIn('slow', function(){
					setTimeout(function(){
						$newMsg
							.animate({
								"font-size": 0 ,
								"opacity": 0.5 ,
								"height": 0 ,
								'padding': 0,
								'margin-bottom': 0
							}, {
								duration: "slow",
								easing: "linear",
								complete: function(){
									$newMsg.remove();
									opt.complete();
								}
							})
						;
					}, 3000);
				})
		);
		return this;

	}

})(module);
