var Cards = (function() {
	
	var view 	= $('.view');
	var vw 		= view.innerWidth();
	var vh	 	= view.innerHeight();
	var vo 		= view.offset();

	var card 	= $('.card__item');
	var cardfull = $('.card__full');

	var cardfulltop = cardfull.find('.card__full-top');
	var blogClose = cardfulltop.find('.blogClose');
	var cardnum = cardfulltop.find('.card__full-num');
	var cardhandle = cardfull.find('.card__full-handle');
	var cardinfo = cardfull.find('.card__full-info');

	var w 		= $(window);




	
	var data0 = [
		{
			num: 9,
			handle: 'ThreeJS',
			info: "腾讯科技讯 5月7日消息，据外电报道，如果你的密码只包含有六个小写字母，那么它只需要花费几秒钟就可以破解。"
		},
		{
			num: 18,
			handle: 'ThreeJS',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 12,
			handle: 'ThreeJS',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 7,
			handle: 'ThreeJS',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 9,
			handle: 'ThreeJS',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 18,
			handle: 'ThreeJS',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 'ThreeJS',
			handle: '@laishi',
			info: 'hereis three.js framework'
		}

	];


	
	var data1 = [
		{
			num: 3,
			handle: 'Blend4WEB',
			info: "本次课将讲解 MongoDB 的特殊索引，包括地理空间索引（2dsphere Index 和 2d Index）和全文索引。"
		},
		{
			num: 5,
			handle: 'Blend4WEB',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 1,
			handle: 'Blend4WEB',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 2,
			handle: 'Blend4WEB',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 5,
			handle: 'Blend4WEB',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 3,
			handle: 'Blend4WEB',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 'yes',
			handle: 'Blend4WEB',
			info: 'hereis three.js framework'
		}

	];



	var data2 = [
		{
			num: 4,
			handle: 'PlayCanvas',
			info: "MongoDB 背景知识和 MongoDB 在 Linux、Mac 系统下的安装与配置，并对 MongDB Shelly 进行了"
		},
		{
			num: 9,
			handle: 'PlayCanvas',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 8,
			handle: 'PlayCanvas',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 7,
			handle: 'PlayCanvas',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 2,
			handle: 'PlayCanvas',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 1,
			handle: 'PlayCanvas',
			info: 'This is some info about the player and sports.'
		},
		{
			num: 'data3',
			handle: 'PlayCanvas',
			info: 'hereis three.js framework'
		}

	];












	
	var moveCard = function() {

		var dataNum = $(this).parent().parent().parent().index();


		var self = $(this);
		var selfIndex = self.index();
		var selfO = self.offset();
		var ty = w.innerHeight()/2 - selfO.top -4;
		
		var color = self.css('border-top-color');
		cardfulltop.css('background-color', color);
		cardhandle.css('color', color);
		
		updateData(dataNum, selfIndex);
		
		self.css({
			'transform': 'translateY(' + ty + 'px)'
		});
				
		self.on('transitionend', function() {
			cardfull.addClass('active');
			self.off('transitionend');
		});

		return false;
	};








	
	var closeCard = function() {
		cardfull.removeClass('active');
		cardnum.hide();
		cardinfo.hide();
		cardhandle.hide();
		cardfull.on('transitionend', function() {
			card.removeAttr('style');
			cardnum.show();
			cardinfo.show();
			cardhandle.show();
			cardfull.off('transitionend');
		});
	};








	
	var updateData = function(dataNum, index) {

		var getData = eval("data" + dataNum);
		cardnum.text(getData[index].num);
		cardhandle.text(getData[index].handle);
		cardinfo.text(getData[index].info);
	};








	
	var bindActions = function() {

		card.on('click', moveCard);

		blogClose.on('click', closeCard);

		// $("body").on('click', closeCard);

		// $("body").bind("click",function(event){ 


		// 	event.stopPropagation();   //停止事件冒泡

		// 	closeCard

		// });


	};





	
	var init = function() {
		bindActions();
	};
	
	return {
		init: init
	};
	
}());

Cards.init();