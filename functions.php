<?php
/**
 * Theme Functions
 *
 * Entire theme's function definitions.
 *
 * @since   1.0.0
 * @package WP
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Scripts & Styles.
 *
 * Frontend with no conditions, Add Custom styles to wp_head.
 *
 * @since  1.0.0
 */
function wpgt_scripts() {
	// Frontend scripts.
	if ( ! is_admin() ) {
		// Enqueue vendors first.
		wp_enqueue_script( 'wpgt_vendorsJs', get_template_directory_uri() . '/assets/js/vendors.min.js' );

		// Enqueue custom JS after vendors.
		wp_enqueue_script( 'wpgt_customJs', get_template_directory_uri() . '/assets/js/custom.min.js' );

		// Minified and Concatenated styles.
		wp_enqueue_style( 'wpgt_style', get_template_directory_uri() . '/style.min.css', array(), '1.0', 'all' );

		wp_enqueue_style('wp_fontawesome','https://use.fontawesome.com/releases/v5.8.2/css/all.css',array(),false, 'all');
		wp_enqueue_style('wp_fontawesome');
	}
}
// Hook.
add_action( 'wp_enqueue_scripts', 'wpgt_scripts' );



// Adding website logo
add_theme_support( 'custom-logo' );

function themename_custom_logo_setup() {
	$defaults = array(
	'height'      => 100,
	'width'       => 400,
	'flex-height' => true,
	'flex-width'  => true,
	'header-text' => array( 'site-title', 'site-description' ),
	);
	add_theme_support( 'custom-logo', $defaults );
   }
   add_action( 'after_setup_theme', 'themename_custom_logo_setup' );


//    Registering menu
function register_my_menu() {
	register_nav_menu('header-menu',__( 'Header Menu' ));
  }
  add_action( 'init', 'register_my_menu' );



use Carbon_Fields\Container;
use Carbon_Fields\Field;

function get_list_of_fa_icons(){

	$icon_json='
		["fa-500px","fa-adjust","fa-adn","fa-align-center","fa-align-justify","fa-align-left","fa-align-right","fa-amazon","fa-ambulance","fa-anchor","fa-android","fa-angellist","fa-angle-double-down","fa-angle-double-left","fa-angle-double-right","fa-angle-double-up","fa-angle-down","fa-angle-left","fa-angle-right","fa-angle-up","fa-apple","fa-archive","fa-area-chart","fa-arrow-circle-down","fa-arrow-circle-left","fa-arrow-circle-o-down","fa-arrow-circle-o-left","fa-arrow-circle-o-right","fa-arrow-circle-o-up","fa-arrow-circle-right","fa-arrow-circle-up","fa-arrow-down","fa-arrow-left","fa-arrow-right","fa-arrow-up","fa-arrows","fa-arrows-alt","fa-arrows-h","fa-arrows-v","fa-asterisk","fa-at","fa-automobile","fa-backward","fa-balance-scale","fa-ban","fa-bank","fa-bar-chart","fa-bar-chart-o","fa-barcode","fa-bars","fa-battery-0","fa-battery-1","fa-battery-2","fa-battery-3","fa-battery-4","fa-battery-empty","fa-battery-full","fa-battery-half","fa-battery-quarter","fa-battery-three-quarters","fa-bed","fa-beer","fa-behance","fa-behance-square","fa-bell","fa-bell-o","fa-bell-slash","fa-bell-slash-o","fa-bicycle","fa-binoculars","fa-birthday-cake","fa-bitbucket","fa-bitbucket-square","fa-bitcoin","fa-black-tie","fa-bluetooth","fa-bluetooth-b","fa-bold","fa-bolt","fa-bomb","fa-book","fa-bookmark","fa-bookmark-o","fa-briefcase","fa-btc","fa-bug","fa-building","fa-building-o","fa-bullhorn","fa-bullseye","fa-bus","fa-buysellads","fa-cab","fa-calculator","fa-calendar","fa-calendar-check-o","fa-calendar-minus-o","fa-calendar-o","fa-calendar-plus-o","fa-calendar-times-o","fa-camera","fa-camera-retro","fa-car","fa-caret-down","fa-caret-left","fa-caret-right","fa-caret-square-o-down","fa-caret-square-o-left","fa-caret-square-o-right","fa-caret-square-o-up","fa-caret-up","fa-cart-arrow-down","fa-cart-plus","fa-cc","fa-cc-amex","fa-cc-diners-club","fa-cc-discover","fa-cc-jcb","fa-cc-mastercard","fa-cc-paypal","fa-cc-stripe","fa-cc-visa","fa-certificate","fa-chain","fa-chain-broken","fa-check","fa-check-circle","fa-check-circle-o","fa-check-square","fa-check-square-o","fa-chevron-circle-down","fa-chevron-circle-left","fa-chevron-circle-right","fa-chevron-circle-up","fa-chevron-down","fa-chevron-left","fa-chevron-right","fa-chevron-up","fa-child","fa-chrome","fa-circle","fa-circle-o","fa-circle-o-notch","fa-circle-thin","fa-clipboard","fa-clock-o","fa-clone","fa-close","fa-cloud","fa-cloud-download","fa-cloud-upload","fa-cny","fa-code","fa-code-fork","fa-codepen","fa-codiepie","fa-coffee","fa-cog","fa-cogs","fa-columns","fa-comment","fa-comment-o","fa-commenting","fa-commenting-o","fa-comments","fa-comments-o","fa-compass","fa-compress","fa-connectdevelop","fa-contao","fa-copy","fa-copyright","fa-creative-commons","fa-credit-card","fa-credit-card-alt","fa-crop","fa-crosshairs","fa-css3","fa-cube","fa-cubes","fa-cut","fa-cutlery","fa-dashboard","fa-dashcube","fa-database","fa-dedent","fa-delicious","fa-desktop","fa-deviantart","fa-diamond","fa-digg","fa-dollar","fa-dot-circle-o","fa-download","fa-dribbble","fa-dropbox","fa-drupal","fa-edge","fa-edit","fa-eject","fa-ellipsis-h","fa-ellipsis-v","fa-empire","fa-envelope","fa-envelope-o","fa-envelope-square","fa-eraser","fa-eur","fa-euro","fa-exchange","fa-exclamation","fa-exclamation-circle","fa-exclamation-triangle","fa-expand","fa-expeditedssl","fa-external-link","fa-external-link-square","fa-eye","fa-eye-slash","fa-eyedropper","fa-facebook","fa-facebook-f","fa-facebook-official","fa-facebook-square","fa-fast-backward","fa-fast-forward","fa-fax","fa-feed","fa-female","fa-fighter-jet","fa-file","fa-file-archive-o","fa-file-audio-o","fa-file-code-o","fa-file-excel-o","fa-file-image-o","fa-file-movie-o","fa-file-o","fa-file-pdf-o","fa-file-photo-o","fa-file-picture-o","fa-file-powerpoint-o","fa-file-sound-o","fa-file-text","fa-file-text-o","fa-file-video-o","fa-file-word-o","fa-file-zip-o","fa-files-o","fa-film","fa-filter","fa-fire","fa-fire-extinguisher","fa-firefox","fa-flag","fa-flag-checkered","fa-flag-o","fa-flash","fa-flask","fa-flickr","fa-floppy-o","fa-folder","fa-folder-o","fa-folder-open","fa-folder-open-o","fa-font","fa-fonticons","fa-fort-awesome","fa-forumbee","fa-forward","fa-foursquare","fa-frown-o","fa-futbol-o","fa-gamepad","fa-gavel","fa-gbp","fa-ge","fa-gear","fa-gears","fa-genderless","fa-get-pocket","fa-gg","fa-gg-circle","fa-gift","fa-git","fa-git-square","fa-github","fa-github-alt","fa-github-square","fa-gittip","fa-glass","fa-globe","fa-google","fa-google-plus","fa-google-plus-square","fa-google-wallet","fa-graduation-cap","fa-gratipay","fa-group","fa-h-square","fa-hacker-news","fa-hand-grab-o","fa-hand-lizard-o","fa-hand-o-down","fa-hand-o-left","fa-hand-o-right","fa-hand-o-up","fa-hand-paper-o","fa-hand-peace-o","fa-hand-pointer-o","fa-hand-rock-o","fa-hand-scissors-o","fa-hand-spock-o","fa-hand-stop-o","fa-hashtag","fa-hdd-o","fa-header","fa-headphones","fa-heart","fa-heart-o","fa-heartbeat","fa-history","fa-home","fa-hospital-o","fa-hotel","fa-hourglass","fa-hourglass-1","fa-hourglass-2","fa-hourglass-3","fa-hourglass-end","fa-hourglass-half","fa-hourglass-o","fa-hourglass-start","fa-houzz","fa-html5","fa-i-cursor","fa-ils","fa-image","fa-inbox","fa-indent","fa-industry","fa-info","fa-info-circle","fa-inr","fa-instagram","fa-institution","fa-internet-explorer","fa-intersex","fa-ioxhost","fa-italic","fa-joomla","fa-jpy","fa-jsfiddle","fa-key","fa-keyboard-o","fa-krw","fa-language","fa-laptop","fa-lastfm","fa-lastfm-square","fa-leaf","fa-leanpub","fa-legal","fa-lemon-o","fa-level-down","fa-level-up","fa-life-bouy","fa-life-buoy","fa-life-ring","fa-life-saver","fa-lightbulb-o","fa-line-chart","fa-link","fa-linkedin","fa-linkedin-square","fa-linux","fa-list","fa-list-alt","fa-list-ol","fa-list-ul","fa-location-arrow","fa-lock","fa-long-arrow-down","fa-long-arrow-left","fa-long-arrow-right","fa-long-arrow-up","fa-magic","fa-magnet","fa-mail-forward","fa-mail-reply","fa-mail-reply-all","fa-male","fa-map","fa-map-marker","fa-map-o","fa-map-pin","fa-map-signs","fa-mars","fa-mars-double","fa-mars-stroke","fa-mars-stroke-h","fa-mars-stroke-v","fa-maxcdn","fa-meanpath","fa-medium","fa-medkit","fa-meh-o","fa-mercury","fa-microphone","fa-microphone-slash","fa-minus","fa-minus-circle","fa-minus-square","fa-minus-square-o","fa-mixcloud","fa-mobile","fa-mobile-phone","fa-modx","fa-money","fa-moon-o","fa-mortar-board","fa-motorcycle","fa-mouse-pointer","fa-music","fa-navicon","fa-neuter","fa-newspaper-o","fa-object-group","fa-object-ungroup","fa-odnoklassniki","fa-odnoklassniki-square","fa-opencart","fa-openid","fa-opera","fa-optin-monster","fa-outdent","fa-pagelines","fa-paint-brush","fa-paper-plane","fa-paper-plane-o","fa-paperclip","fa-paragraph","fa-paste","fa-pause","fa-pause-circle","fa-pause-circle-o","fa-paw","fa-paypal","fa-pencil","fa-pencil-square","fa-pencil-square-o","fa-percent","fa-phone","fa-phone-square","fa-photo","fa-picture-o","fa-pie-chart","fa-pied-piper","fa-pied-piper-alt","fa-pinterest","fa-pinterest-p","fa-pinterest-square","fa-plane","fa-play","fa-play-circle","fa-play-circle-o","fa-plug","fa-plus","fa-plus-circle","fa-plus-square","fa-plus-square-o","fa-power-off","fa-print","fa-product-hunt","fa-puzzle-piece","fa-qq","fa-qrcode","fa-question","fa-question-circle","fa-quote-left","fa-quote-right","fa-ra","fa-random","fa-rebel","fa-recycle","fa-reddit","fa-reddit-alien","fa-reddit-square","fa-refresh","fa-registered","fa-remove","fa-renren","fa-reorder","fa-repeat","fa-reply","fa-reply-all","fa-retweet","fa-rmb","fa-road","fa-rocket","fa-rotate-left","fa-rotate-right","fa-rouble","fa-rss","fa-rss-square","fa-rub","fa-ruble","fa-rupee","fa-safari","fa-save","fa-scissors","fa-scribd","fa-search","fa-search-minus","fa-search-plus","fa-sellsy","fa-send","fa-send-o","fa-server","fa-share","fa-share-alt","fa-share-alt-square","fa-share-square","fa-share-square-o","fa-shekel","fa-sheqel","fa-shield","fa-ship","fa-shirtsinbulk","fa-shopping-bag","fa-shopping-basket","fa-shopping-cart","fa-sign-in","fa-sign-out","fa-signal","fa-simplybuilt","fa-sitemap","fa-skyatlas","fa-skype","fa-slack","fa-sliders","fa-slideshare","fa-smile-o","fa-soccer-ball-o","fa-sort","fa-sort-alpha-asc","fa-sort-alpha-desc","fa-sort-amount-asc","fa-sort-amount-desc","fa-sort-asc","fa-sort-desc","fa-sort-down","fa-sort-numeric-asc","fa-sort-numeric-desc","fa-sort-up","fa-soundcloud","fa-space-shuttle","fa-spinner","fa-spoon","fa-spotify","fa-square","fa-square-o","fa-stack-exchange","fa-stack-overflow","fa-star","fa-star-half","fa-star-half-empty","fa-star-half-full","fa-star-half-o","fa-star-o","fa-steam","fa-steam-square","fa-step-backward","fa-step-forward","fa-stethoscope","fa-sticky-note","fa-sticky-note-o","fa-stop","fa-stop-circle","fa-stop-circle-o","fa-street-view","fa-strikethrough","fa-stumbleupon","fa-stumbleupon-circle","fa-subscript","fa-subway","fa-suitcase","fa-sun-o","fa-superscript","fa-support","fa-table","fa-tablet","fa-tachometer","fa-tag","fa-tags","fa-tasks","fa-taxi","fa-television","fa-tencent-weibo","fa-terminal","fa-text-height","fa-text-width","fa-th","fa-th-large","fa-th-list","fa-thumb-tack","fa-thumbs-down","fa-thumbs-o-down","fa-thumbs-o-up","fa-thumbs-up","fa-ticket","fa-times","fa-times-circle","fa-times-circle-o","fa-tint","fa-toggle-down","fa-toggle-left","fa-toggle-off","fa-toggle-on","fa-toggle-right","fa-toggle-up","fa-trademark","fa-train","fa-transgender","fa-transgender-alt","fa-trash","fa-trash-o","fa-tree","fa-trello","fa-tripadvisor","fa-trophy","fa-truck","fa-try","fa-tty","fa-tumblr","fa-tumblr-square","fa-turkish-lira","fa-tv","fa-twitch","fa-twitter","fa-twitter-square","fa-umbrella","fa-underline","fa-undo","fa-university","fa-unlink","fa-unlock","fa-unlock-alt","fa-unsorted","fa-upload","fa-usb","fa-usd","fa-user","fa-user-md","fa-user-plus","fa-user-secret","fa-user-times","fa-users","fa-venus","fa-venus-double","fa-venus-mars","fa-viacoin","fa-video-camera","fa-vimeo","fa-vimeo-square","fa-vine","fa-vk","fa-volume-down","fa-volume-off","fa-volume-up","fa-warning","fa-wechat","fa-weibo","fa-weixin","fa-whatsapp","fa-wheelchair","fa-wifi","fa-wikipedia-w","fa-windows","fa-won","fa-wordpress","fa-wrench","fa-xing","fa-xing-square","fa-y-combinator","fa-y-combinator-square","fa-yahoo","fa-yc","fa-yc-square","fa-yelp","fa-yen","fa-youtube","fa-youtube-play","fa-youtube-square"]
	';
	$icon_json_parsed=json_decode($icon_json);
	$icon_json_parsed_new=array();
	foreach($icon_json_parsed as $s){
		$icon_json_parsed_new[$s]=$s;
	}

	//$icon_json_parsed=array('1'=>'Option 1','2'=>'Option 2');
	return $icon_json_parsed_new;
}


add_action( 'carbon_fields_register_fields', 'crb_attach_theme_options' );
function crb_attach_theme_options() {
	$page_home = get_page_by_path( 'home'); //setting to display only in homepage

	Container::make( 'post_meta', __( 'Settings' ) )
	->where( 'post_type', '=', 'page' )
	->where( 'post_id', '=', $page_home->ID )
	->add_tab( __( 'Banner' ), array(

		Field::make( 'text', 'homepage_banner_title',__('Quote') ),
		Field::make( 'image', 'homepage_banner_image', __( 'Image' ) ),
		Field::make( 'text', 'homepage_banner_link',__('Link') )

	))
	->add_tab( __( 'Services' ), array(
		Field::make( 'text', 'homepage_services_main_title', 'Title' ),
		Field::make( 'text', 'homepage_services_quote', 'Quote' ),

		Field::make( 'complex', 'home_services_list', __( 'Slider' ) )
    	->add_fields( array(
			Field::make( 'select', 'homepage_services_icon', __( 'Service Icon' ) )
			->add_options( 'get_list_of_fa_icons' )
			,
			Field::make( 'text', 'homepage_services_title', __( 'Service Title' ) ),
			Field::make( 'textarea', 'homepage_services_text', __( 'Service Content' ) ),
			
		))
	))
;}
	

add_theme_support( 'post-thumbnails' );
    /* Custom Post Type Start */
    function create_posttype() {
		register_post_type( 'portfolio',
		// CPT Options
		array(
		  'labels' => array(
		   'name' => __( 'Portfolios' ),
		   'singular_name' => __( 'Portfolio' ),
		   'add_new' =>  __('Create New Portfolio'),
		   'add_new_item' => ('Add new Portfolio')
		  ),
		  'public' => true,
		  'rewrite' => array('slug' => 'portfolio'),
		  'supports'    => array( 'title','author', 'thumbnail','excerpt','editor','custom-fields'),
		 )
		);
		}
		// Hooking up our function to theme setup
		add_action( 'init', 'create_posttype' );
		/* Custom Post Type End */

		add_action('carbon_fields_register_fields', 'footer_image_theme_option');

		function footer_image_theme_option() {

			Container::make( 'theme_options', __( 'Theme Options', 'ronalThemeSettings' ) )
        ->add_fields( array(
					//Field::make('text','footer_images_title'),
					Field::make('text','footer_images_title',__('Footer Skill Title')),
					Field::make( 'complex', 'footer_images_list', __( 'Footer Skills Icons' ) )
					->add_fields( array(
						Field::make( 'image', 'footer_technology_used', __( 'Footer images' ) ),
					))
        ) );

		}

function create_services(){
	register_post_type('services',
	array(
		'labels' => array(
			'name'=>__('Services'),
			'singular_name' => __('service'),
			'add_new' =>  __('Create New Service'),
		   'add_new_item' => __('Add new Service')
		),
		'public' => true,
		'rewrite' => array('slug' => 'services'),
		'supports'    => array( 'title','author', 'thumbnail','excerpt','comments','editor'),
	)
	
	);
}

add_action( 'init', 'create_services' );

add_action( 'carbon_fields_register_fields', 'services_icon' );

function services_icon() {
Container::make( 'post_meta', __('Services Icon here') )
->where( 'post_type', '=', 'services' )
->add_tab( __('Profile'), array(
	Field::make( 'select', 'contact_me_service_icon', __( 'Service Icon' ) )
	->add_options( 'get_list_of_fa_icons' )
));
}




