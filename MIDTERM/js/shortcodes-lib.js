jQuery(document).ready(function($) {



	$(".magz-tabs").tabs();

	

	$(".magz-toggle").each( function () {

		if($(this).attr('data-id') == 'closed') {

			$(this).accordion({ header: '.magz-toggle-title', collapsible: true, active: false  });

		} else {

			$(this).accordion({ header: '.magz-toggle-title', collapsible: true});

		}

	});

	

	

});