<?php
/**
 * Protfolio Template
 *
 *
 * @since   1.0.0
 * @package WP
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header(); ?>

<div class="contact_me hero">
	<div class="container">
		<h1> <u> CONTACT ME</u></h1>
	</div>
</div>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>


<div class="ptb-40">
	<div class="container grid-col-2 grid-gap-40 grid-align-item-center contact-area">
		<div class="contact-area-lt">
			<div class="contact_area_info">
				<div class="img_holder">
					<img src="<?php echo get_template_directory_uri() ?>/assets/img/ronal.jpg" alt="">
				</div>
				<h1 class="mt-25">Ronal Chhetri</h1>
				<h2>SEO Analyst</h2>
				<h3>9842552348</h3>
				<h3>ronalchhetri@gmail.com</h3>
				<h4>2+ year expierence</h4>
			</div>
		</div>
		<!-- pulling contact form -->
		<div class="contact-area-rt bg-black">
			<?php the_content(); ?>
		</div>

	</div>
</div>

<section class="contact_services bg-grey ptb-40">
	<div class="container">
		<div class="grid-col-4">
			<?php
            $args = array(
			'post_type'=> 'services',
			'posts_per_page' => 4
            );
			query_posts( $args );
            while ( have_posts() ) : the_post();
        ?>
			<div class="box box-border text-center contact-us-service">

				<div class="box_icon">
					<i class="fa <?php print carbon_get_post_meta(get_the_ID(),'contact_me_service_icon');?>"></i>
				</div>

				<div class="box_title mt-25">
					<?php the_title();?>
				</div>
			</div>
			<?php		
            endwhile;    
            // Reset Query
            wp_reset_query();
        ?>
		</div>
	</div>
</section>
<?php endwhile; else : ?>
<p><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></p>
<?php endif; ?>

<?php get_footer(); ?>
