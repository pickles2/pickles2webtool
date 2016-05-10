$(window).load(function(){

	var params = window.main.parseUriParam(window.location.href);
	// console.log(params);

	var $canvas = $('#canvas');
	var serverConfig;

	/**
	* window.resized イベントハンドラ
	*/
	var windowResized = function(callback){
		callback = callback || function(){};
		$canvas
			.height( $(window).height() - 0 )
		;
		callback();
		return;
	}

	var pickles2ContentsEditor = new Pickles2ContentsEditor();

	$.ajax({
		"url": "/apis/applock",
		"type": 'post',
		'data': {
			"method": 'lock',
			"page_path": params.page_path
		},
		"success": function(lockResult){
			console.log(lockResult);
			if( !lockResult.result ){
				alert('このコンテンツは編集中です。');
				return;
			}

			$.ajax({
				"url": "/apis/getServerConf",
				"type": 'get',
				'data': {},
				"success": function(_serverConfig){
					serverConfig = _serverConfig;

					windowResized(function(){
						pickles2ContentsEditor.init(
							{
								'page_path': params.page_path ,
								'elmCanvas': $canvas.get(0),
								'preview':{
									'origin': serverConfig.px2server.origin
								},
								'gpiBridge': function(input, callback){
									// GPI(General Purpose Interface) Bridge
									// broccoliは、バックグラウンドで様々なデータ通信を行います。
									// GPIは、これらのデータ通信を行うための汎用的なAPIです。
									$.ajax({
										"url": "/apis/pickles2ContentsEditorGpi",
										"type": 'POST',
										'data': {'page_path':params.page_path, 'data':JSON.stringify(input)},
										"success": function(data){
											// console.log(data);
											callback(data);
										}
									});
									return;
								},
								'complete': function(){
									$.ajax({
										"url": "/apis/applock",
										"type": 'post',
										'data': {
											"method": 'unlock',
											"page_path": params.page_path
										},
										"success": function(lockResult){
											console.log(lockResult);
											if( !lockResult.result ){
												alert('[ERROR] 編集状態の解除に失敗しました。');
												return;
											}
											alert('完了しました。');
											window.close();

										}
									});
								},
								'onClickContentsLink': function( uri, data ){
									alert('編集: ' + uri);
								},
								'onMessage': function( message ){
									// ユーザーへ知らせるメッセージを表示する
									console.info('message: '+message);
									// alert(message);
								}
							},
							function(){

								$(window).resize(function(){
									// このメソッドは、canvasの再描画を行います。
									// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
									windowResized(function(){
										pickles2ContentsEditor.redraw();
									});
								});

								console.info('standby!!');
							}
						);

					});
				}
			});

		}
	});

});
