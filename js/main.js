var page = 0;
var nextURL = "";
var loading = false;

$(document).ready(function(){
	$.ajax({
		type: 'GET',
		url: 'http://www.reddit.com/r/fffffffuuuuuuuuuuuu/.json',
		jsonp: 'jsonp',
		dataType: 'jsonp',
		success: pageLoadSuccess
	});
});

$(window).scroll(function () {
	if (!loading) {
		var scrollPosition = window.pageYOffset;
		var windowSize     = window.innerHeight;
		var bodyHeight     = $(document).height();
		
		var distanceFromBottom = bodyHeight - (scrollPosition + windowSize);

		var comicsSelector = "#page" + page + " > li";

		var last3ComicsHeight = 0;
		var comics = $(comicsSelector);
		var numberOnPage = comics.size();
		var firstIndice = numberOnPage - 4;

		comics.slice(firstIndice, numberOnPage - 1).each(function (index) {
			last3ComicsHeight += $(this).height();
		});

		if (distanceFromBottom < last3ComicsHeight) {
			loading = true;
			$.ajax({
				type: 'GET',
				url: nextURL,
				jsonp: 'jsonp',
				dataType: 'jsonp',
				success: pageLoadSuccess
			});
		}
	}
});

var pageLoadSuccess = function(response) {
						var items = [];

						$.each(response.data.children, function(index, val) {
							if (val.data.domain === "imgur.com") {
								var imgURL = val.data.url;

								var extPos = val.data.url.lastIndexOf(".");
								if (extPos != -1 && extPos != 12) {
									imgURL = imgURL.substring(0, extPos);
								}

								imgURL = imgURL + ".png";
						    	items.push('<li class="comicContainer" id="' + index + '"><h3 class="comicTitle">' + val.data.title + '</h3><a class="commentsLink" href="http://www.reddit.com' + val.data.permalink + '">Comments (' + val.data.num_comments + ')</a><img src="' + imgURL + '"/></li>');
							}
						});

						page++;
						var ulID = 'page' + page;
						$('<ul/>', {
							'class': 'page',
						    html: items.join(''),
						    'id': ulID
						}).appendTo('#comicContainer');

						nextURL = "http://reddit.com/r/fffffffuuuuuuuuuuuu/.json?count=25&after=" + response.data.after;
						loading = false;
					}


