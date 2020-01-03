/**
 * Main js for hexo-theme-Annie.
 *
 * @Author   Sariay
 * @DateTime 2018-08-26
 */
jQuery(document).ready(function($) {

	"use strict";

	/**
	 * Some global variables.
	 * loadAnimation：Loading animation for 'fun Annie_LoadPost()' & 'fun Annie_QueryPostsByTag()'
	 */
	const ANNIE = {
		scrollLimitG        : 500,
		scrollSpeedG        : 500,
		delayTimeG          : 500,
		headerH             : $('header').outerHeight(),
		postContentH        : $('#article-content').outerHeight(),
		mainH               : $('main').outerHeight(),
		investmentContainerH: $('.investment-container').outerHeight(),
		headerAId           : '#navigation-show a, #logo a',
		postPageId          : '.layout-post',
		postCoverId         : '#current-post-cover',
		postTocId           : '#catelog-list',
		paginationId        : '#pagination a',
		paginationContainer : '#layout-cart, #layout-pure',
		loadAnimation       : '<div class = "transition"><div class = "three-bounce1"> </div> <div class = "three-bounce2"> </div> <div class = "three-bounce3"> </div> </div> '
	};

	/**
	 * Preloader for html page. If the background image of header is loaded, it will remove the mask layer immediately, or else after 10 seconds at most!
	 *
	 * @method   Annie_Preloader
	 */
	const Annie_Preloader = function() {
		let mode = CONFIG_BGIMAGE.mode,
			curImgSrc = '22223eeddd',
			randomMax = CONFIG_BGIMAGE.randomMax,
			randomNum = 0,
			normalSrc = CONFIG_BGIMAGE.normalSrc,
			randomSrc = CONFIG_BGIMAGE.randomSrc;
		let postPageId = ANNIE.postPageId,
			postCoverId = ANNIE.postCoverId;

		if ($(postPageId).length && $(postCoverId).length) {
			mode = 'post';
		}

		switch (mode) {
			case 'random':
				{
					randomNum = Math.floor(Math.random() * (randomMax - 1) + 1);
					curImgSrc = randomSrc + randomNum + '.jpg';
				}
				break;
			case 'normal':
				{
					curImgSrc = normalSrc;
				}
				break;
			case 'post':
				{
					curImgSrc = $(postCoverId).attr('data-scr');
				}
				break;
			default:
				{
					//TODO: Maybe, it loads slowly!
					curImgSrc = 'https://source.unsplash.com/collection/954550/1920x1080';
				}
				break;
		}

		/**
		 * Html page scroll down to the height for header!
		 *
		 * @method   Annie_Scroll
		 */
		function Annie_Scroll() {
			let delayTime = ANNIE.delayTimeG,
				headerH = ANNIE.headerH,
				scrollTop = 0,
				scrollHeight = 0,
				scrollTime = 0;

			function getCookie(sName) {
				let aCookie = document.cookie.split("; ");
				for (let i = 0; i < aCookie.length; i++) {
					let aCrumb = aCookie[i].split("=");
					if (sName == aCrumb[0])
						return unescape(aCrumb[1]);
				}
				return 0;
			}

			function setCookie(sName, sValue) {
				document.cookie = sName + "=" + escape(sValue) + ";";
			}

			function pageScroll(scrollHeight, scrollTime) {
				$('html, body').delay(scrollTime).animate({
					scrollTop: scrollHeight
				}, scrollTime);
			}

			$(window).scroll( function() {
				scrollTop = $(document).scrollTop();

				setCookie('scrollTop', scrollTop);
			}).trigger('scroll');

			if (performance.navigation.type == 1) {
				scrollHeight = scrollTop || getCookie('scrollTop');
				scrollTime = delayTime * 0;
				console.info("This page is reloaded");
			} else {
				scrollHeight = headerH + 2;
				scrollTime = delayTime * 2;
			}
			pageScroll(scrollHeight, scrollTime);
		}

		/**
		 * To set & then remove the mask layer for html page!
		 *
		 * @method   Annie_Transition
		 */
		function Annie_Transition() {
			let delayTime = ANNIE.delayTimeG;

			$('#status').fadeOut();
			$('#preloader').delay(delayTime).fadeOut('slow');
			$('body').delay(delayTime);

			setTimeout(function() {
				$('html').removeClass('html-loading');
			}, delayTime);
		}

		/**
		 * To set the background of the header.
		 *
		 * @method   Annie_SetBg
		 * @param    {[type]}    imgSrc [description]
		 */
		function Annie_SetBg(imgSrc) {
			let backgroundImg = 'url(' + imgSrc + ')';
			$('header').css('background-image', backgroundImg);
		}


		/**
		 * We use "https://github.com/desandro/imagesloaded plugin" to check img.load status!
		 */
		let stop = setTimeout(function() {
			function timeoutCalled() {
				Annie_Transition();
				Annie_Scroll();
				console.log('timeout');
			}
			return timeoutCalled();
		}, ANNIE.delayTimeG * 20); // delayTime = ANNIE.delayTimeG * 20 = 10s

		Annie_SetBg(curImgSrc);

		$("header").imagesLoaded({background: true}, function() {
			// The background iamge of header is already loaded.
			if (stop) {
				clearTimeout(stop);

				Annie_Transition();

				if ($(postPageId).length) {
					Annie_Scroll()
				}
			}
		});
	};

	/**
	 * To set the current active item of nav.
	 *
	 * @method   Annie_Nav
	 */
	const Annie_Nav = function() {
		function currentNavStatus(element) {
			//some operation
			let urlStr = location.href,
				urlSta = false,
				homePage = ANNIE.paginationContainer,
				allLink = element + ' ' + '#global-nav a';

			$(allLink).each(function() {
				let currentUrl = $(this).attr('class');
				currentUrl = currentUrl.substr(10);

				if (urlStr.indexOf(currentUrl) > -1 && $(this).attr('href') != ' ') {
					$(this).addClass('active');
					urlSta = true;
				} else {
					$(this).removeClass('active');
				}
			});

			if (!urlSta && ($(homePage).length)) {
				$(allLink).eq(0).addClass('active');
			}
		}

		function toggleNav(bool) {
			$('.nav-container').toggleClass('is-visible', bool);
		}

		//open navigation
		$('.nav-trigger').on('click', function(event) {
			$('body').addClass('body-fixed');
			event.preventDefault();
			toggleNav(true);
		});

		//close navigation
		$('.nav-close').on('click', function(event) {
			event.preventDefault();
			toggleNav(false);
			$('body').removeClass('body-fixed');
		});

		currentNavStatus('#navigation-show');

		currentNavStatus('.nav-container');
	};

	/**
	 * Progress for page & post.
	 *
	 * @method   Annie_Progress
	 */
	const Annie_Progress = function() {
		let navBarId = "#navigation-hide",
			navBarHeight = $(navBarId).outerHeight();
		let postTitleH = $(".article-title").outerHeight(),
			postMetaH = $(".article-meta").outerHeight(),
			postContentH = ANNIE.postContentH,
			headerH = ANNIE.headerH,
			postPageId = ANNIE.postPageId,
			scrollLimit = ANNIE.scrollLimitG;

		$(window).scroll(function() {
			let scrollTop = $(document).scrollTop(),
				docHeight = $(document).height(),
				windowHeight = $(window).height(),
				scrollPercent = 0;

			if ($(postPageId).length) {
				// 80 = div.layout-post的padding-top
				scrollPercent = ((scrollTop - headerH) / (postContentH + postTitleH + postMetaH + 80 - windowHeight)) * 100;
			} else {
				scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100;
			}

			scrollPercent = scrollPercent.toFixed(1);

			if (scrollPercent > 100 || scrollPercent < 0) {
				scrollPercent = 100;
			}

			$('#progress-percentage h1').text(scrollPercent + "%");

			$("#progress-bar").attr("style", "width:" + (scrollPercent) +"%; display: block;");

			if (scrollTop >= ((scrollLimit > headerH) ? scrollLimit : headerH)) {
				$(navBarId).css({
					top: '0'
				}).show();
				$('.nav-trigger').show();
			} else {
				$(navBarId).css({
					top: '-' + navBarHeight + 'px'
				}).hide();
				$('.nav-trigger').hide();
			}

			//Current post or page title
			if (scrollTop >= headerH + 300) {
				$('#navigation-hide p').show();
			} else {
				$('#navigation-hide p').hide();
			}
		}).trigger('scroll');
	};

	/**
	 * Toc for post.
	 *
	 * @method   Annie_Toc
	 */
	const Annie_Toc = function() {
		let scrollSpeed = ANNIE.scrollSpeedG,
			upperLimit1 = ANNIE.headerH,
			upperLimit2 = ANNIE.mainH - ANNIE.investmentContainerH;
		let tocSwitchButton = ".switch-button",
			delayTime = ANNIE.delayTimeG,
			postTocId = ANNIE.postTocId,
			postPageId = ANNIE.postPageId;

		function fixedAndShowTocId() {
			$(window).scroll(function() {
				let scrollTop = $(document).scrollTop();

				if ((scrollTop >= upperLimit1) && (scrollTop < upperLimit2)) {
					//屏幕宽度<= 1024px时应隐藏
					$(postTocId).css('position', 'fixed').show().fadeIn(delayTime);

				} else {
					$(postTocId).hide().fadeOut(delayTime);
				}
			});
		}

		function generateToclist() {
			let katelogIns = new katelog({
				contentEl: 'article-content',
				catelogEl: 'catelog-list',
				linkClass: 'k-catelog-link',
				linkActiveClass: 'k-catelog-link-active',
				selector: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
				supplyTop: 20,
				active: function(el) {}
			});
			//TODO: 添加目录标题、层级标题
		}

		function adjustTocContainer() {
			let clickCount = 1;

			$(tocSwitchButton).on("click", function() {

				$(this).toggleClass("toc-switch-button-active");


				if (clickCount == 1) {
					$('main').toggleClass("inline-flex");
					setTimeout(function() {
						$('#layout-toc').toggleClass("show").fadeToggle();
					}, delayTime / 2); //delayTimeG = 500ms	



					clickCount = 2;
				} else {
					$('#layout-toc').toggleClass("show").fadeToggle();
					setTimeout(function() {
						$('main').toggleClass("inline-flex");


					}, delayTime / 2); //delayTimeG = 500ms


					clickCount = 1;
				}
			});
		}

		if ($(postPageId).length) {
			fixedAndShowTocId();
		}

		if ($(postTocId).length) {
			generateToclist();
		}

		if ($(postPageId).length && $(postTocId).length) {
			$(tocSwitchButton).show();

			adjustTocContainer();
		} else {
			$(tocSwitchButton).hide();
		}
	};

	/**
	 * Anchor for toTop and readMore.
	 *
	 * @method   Annie_ToAnchor
	 */
	const Annie_ToAnchor = function() {
		let scrollSpeed = ANNIE.scrollSpeedG,
			upperLimit = ANNIE.scrollLimitG,
			delayTime = ANNIE.delayTimeG,
			toTop = $('#totop'),
			readMore = $('#read-more');

		toTop.hide();

		$(window).scroll(function() {
			let scrollTop = $(document).scrollTop();

			if (scrollTop > upperLimit) {
				$(toTop).stop().fadeTo(delayTime, 1);
			} else {
				$(toTop).stop().fadeTo(delayTime, 0);
			}
		});

		$(toTop).click(function() {
			$('html, body').animate({
				scrollTop: 0
			}, scrollSpeed);
			return false;
		});

		$(readMore).click(function() {
			$('html, body').animate({
				scrollTop: $('main').offset().top + 2
			}, scrollSpeed);
			return false;
		});
	};

	/**
	 * Archive by year.
	 *
	 * @method   Annie_Archive
	 */
	const Annie_Archive = function() {
		if (window.location.pathname.indexOf("archive") == -1) {
			return;
		}
		let currentYear = "",
			Newy = "";
		$("#layout-archive-year  ul li").each(function(i) {
			let year = $(this).find("em").attr("year");
			if (year < currentYear || currentYear == "") {
				currentYear = year;
				if (Newy == "") {
					Newy = year
				}
				$(this).before("<h3 class = '" + currentYear + "'>" + currentYear + "<em>(" + $("[year = '" + currentYear + "']").length + "篇)</em></h3>");
			}
			$(this).attr("year", currentYear);
		});

		$("#layout-archive-year h3").each(function() {
			$("#layout-archive-year ul li[year = '" + $(this).attr("class") + "'").wrapAll("<div year = '" + $(this).attr("class") + "'></div>");
			$("h3." + $(this).attr("class")).click(function() {
				$(this).toggleClass("title-bg").next().slideToggle(300);

			})
		});
		$("#layout-archive-year ul div[year!= '" + Newy + "']").hide();
		$("h3." + Newy).addClass("title-bg");
		//TODO: Archive by month
	};

	/**
	 * InfiniteLoading to load more posts for index page！
	 *
	 * @method   Annie_LoadPost
	 */
	const Annie_LoadPost = function() {
		let paginationId = ANNIE.paginationId,
			loadAnimation = ANNIE.loadAnimation,
			delayTime = ANNIE.delayTimeG,
			paginationContainer = ANNIE.paginationContainer,
			leancloudCount = CONFIG_LEACLOUD_COUNT.enable || 'false';
		
		$('body').on('click', paginationId, function() {
			let thisUrl = $(this).attr("href");
			$(paginationId).text(" ").append(loadAnimation);

			$.ajax({
				type: "get",
				url: thisUrl,
				async: true,
				timeout: delayTime * 20, //10s
				error: function(event,xhr,options) {

					$(paginationId).attr("href", thisUrl).empty().text($(paginationId).attr('data-title'));

					alert("Error requesting " + options.url + ":  " + xhr.status + ",  " + xhr.statusText);

					console.log("Error requesting " + options.url + ":  " + xhr.status + ",  " + xhr.statusText)	
				},
				success: function(data) {
					let result = $(data).find("#post"),
						newhref = $(data).find(paginationId).attr("href");

					$(paginationContainer).append(result.fadeIn(delayTime).addClass('animation-zoom'));

					if (leancloudCount === 'true') {
						//FIX: ajax bug
						annieShowData();
					}

					$(paginationId).empty().text($(paginationId).attr('data-title'));

					if (newhref != undefined) {
						$(paginationId).attr("href", newhref);
					} else {
						$("#pagination").html("<span>" + $(paginationId).attr('data-status') + "</span>");
					}
				},
				complete: function() {
					// TODO
				}
			});

			return false;
		});
	};

	/**
	 * Tab to switch 'relate' or 'comment' module
	 *
	 * @method   Annie_Tab
	 */
	const Annie_Tab = function() {
		function tabs(tabTit, on, tabCon) {
			$(tabCon).each(function() {
				$(this).children().eq(0).show();
			});

			$(tabTit).each(function() {
				$(this).children().eq(0).addClass(on);
			});

			$(tabTit).children().click(function() {
				$(this).addClass(on).siblings().removeClass(on);
				let index = $(tabTit).children().index(this);
				$(tabCon).children().eq(index).show().siblings().hide();
			});
		}
		tabs(".investment-title-1", "on", ".investment-content");
	};

	/**
	 * Query the posts which have specified tag or category!
	 * TODO: We can use "Content filtering plugin" to instead this function!
	 *
	 * @method   Annie_QueryPostsByTag
	 */
	const Annie_QueryPostsByTag = function() {
		let loadAnimation = ANNIE.loadAnimation,
			delayTime = ANNIE.delayTimeG;

		$('.tags a, .category a').click(function() {
			$("#TCP-title").text("查询结果");
			//添加查询结果之前，清除容器中的内容
			$("#TCP-content").text("").append(loadAnimation);
			let href = $(this).attr("href");
			if (href != undefined) {
				$.ajax({
					url: href,
					type: "get",
					async: true,
					timeout: delayTime * 20, //10s
					error: function(event,xhr,options) {

						alert("Error requesting " + options.url + ": " + xhr.status + "," + xhr.statusText);

						console.log("Error requesting " + options.url + ": " + xhr.status + "," + xhr.statusText)	
					},
					success: function(data) {
						$("#TCP-content").empty();

						var result = $(data).find(".layout-archive");
						$('#TCP-content').append(result.fadeIn(delayTime).addClass('animation-zoom'));
						$(".layout-archive").css({
							'paddingTop': '0'
						});
						$(".layout-archive i").css({
							'marginTop': '5px',
							'marginBottom': '30px'
						});
					},
					complete: function() {
						// TODO
					}
				});
			}
			return false;
		});
	};

	/**
	 * PLUGIN: plugin/chinese/chinese.js
	 *
	 * @method   Annie_LanguageSet
	 */
	const Annie_LanguageSet = function() {
		zh_init();
	};

	/**
	 * PLUGIN: plugin/imgLazyLoader/yall.min.js
	 *
	 * @method   Annie_ImageLazyLoad
	 */
	const Annie_ImageLazyLoad = function() {
		yall({
			observeChanges: true
		});
	};

	/**
	 * Adjust the browser scroll bar for 'html body', 'code bloack'.
	 * PLUGIN: plugin/nicescroll/jquery.nicescroll.js
	 *
	 * @method   Annie_NiceScroll
	 */
	const Annie_NiceScroll = function() {
		const niceScrollId = 'body, .highlight',
			niceScrollSetting = $(niceScrollId).niceScroll({
				cursorborder: "none",
				autohidemode: true
			});

		// PLUGIN: js/resizediv.js
		$(niceScrollId).resize(function(event) {
			setTimeout(function() {
				niceScrollSetting.resize();
			}, 2);
		});
	};

	/**
	 * Other js functions. An function example might be as follows: 
	 */
	/*  
		const Annie_XXX = function(argument) {
			// body...
		};
	*/

	/* Initialize */
	(function Annie_Init() {
		Annie_Preloader();
		Annie_Nav();
		Annie_Progress();
		Annie_Toc();
		Annie_ToAnchor();
		Annie_Archive();
		Annie_LoadPost();
		Annie_Tab();
		Annie_QueryPostsByTag();
		Annie_LanguageSet();
		Annie_ImageLazyLoad();
		Annie_NiceScroll();
	})();
});

console.log("%c Github %c","background: #424c50; color: #ffffff", " ","https://github.com/Sariay/hexo-theme-Annie");