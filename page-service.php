<?php
/**
 * Index
 *
 * Theme index.
 *
 * @since   1.0.0
 * @package WP
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header(); ?>

<div class="hero">
	<div class="container">
		<h1>A solution for every SEO Need</h1>
		<h2 class="mt-25">You can't rest on your #1 ranking because the website at #2 isn't resting. It's constantly
			improving it's
			website.</h2>
		<a href="#" class="btn btn-white-outline mt-25 w-250">CONTACT NOW</a>
	</div>
</div>

<section class="bg-grey services">
	<div class="container text-center">
		<h1 class="title"> <u>SERVICES</u></h1>

		<?php
            $args = array(
			'post_type'=> 'services',
            );
			query_posts( $args );
			$show_on_left=true;
            while ( have_posts() ) : the_post();
        ?>
		<div class="services-cards">
			<div class="services_box">

				<?php if($show_on_left){?>
					<?php echo get_the_post_thumbnail(); ?>
				<?php } ?>

				<div class="services_box_content">
					<h3 class="d-inline"><?php the_title();?></h3>
					<h4 class="mt-25"> <i>Do you want to increase your Business</i></h4>
					<p class="mt-15">
						<?php 
							$content = get_the_content();
							$trimmed = wp_trim_words(get_the_content(),60);
						?>
						<?php echo $trimmed; ?>	
					</p>
					<a href="#" class="btn btn-dark m-l-none d-block mt-60">Learn more</a>	
				</div>

				<?php if(!$show_on_left){?>
					<?php echo get_the_post_thumbnail(); ?>
				<?php $show_on_left=true; } else {
					$show_on_left=false;
				} ?>

			</div>
		</div>

		<?php
				
                endwhile;
            
                // Reset Query
                wp_reset_query();
        ?>
	</div>
</section>
<!-- service -->



<section class="testimonial">
	<div class="container">

		<h2 class="bg-black">testimonial</h2>
	</div>
</section>

<?php get_footer(); ?>
