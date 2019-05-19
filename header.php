<?php
/**
 * Theme Header
 *
 * Header data.
 *
 * @since   1.0.0
 * @package WP
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<!-- Loading google font (Open Sans) -->
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,600,700,800" rel="stylesheet">

	<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

	<header class="<?php if(is_page( 'portfolio' )) print 'portfolio';?>">
		<div class="container">
		<div class="head">
			<div class="brand">
				<?php
	if ( function_exists( 'the_custom_logo' ) ) {
		the_custom_logo();
	   }
	?>
			</div>

			<div class="head-menu">
				<ul>
					<li> <?php wp_nav_menu( array( 'container_class' => 'main-nav', 'theme_location' => 'primary','theme_location' => 'header-menu' ) ); ?>
					</li>
				</ul>
			</div>

		</div>
	</div><!--/container-->
	</header>
