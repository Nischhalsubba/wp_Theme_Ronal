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

<?php
    // Start the loop.
	while ( have_posts() ) : the_post();
?>

<div class="bg-black">
	<div class="container">
		<div class="banner grid-2 grid-justify-item-end">
			<div class="frontpage-quote">
				<blockquote>
					<h1>
						<?php echo carbon_get_post_meta(get_the_ID(),'homepage_banner_title'); ?>
					</h1>
				</blockquote>

				<button type="button" class="btn-white">
					<a href="#">
						<h4>PORTFOLIO</h4>
					</a>
				</button>
			</div>

			<span class="image">
				<?php
					$attachment_id = carbon_get_post_meta(get_the_ID(),'homepage_banner_image');
					$image=wp_get_attachment_image_src($attachment_id,array(450,600));
					$alt_text = get_post_meta($attachment_id , '_wp_attachment_image_alt', true);
				?>
				<img src="<?php echo $image[0]; ?>" alt="<?php echo $alt_text; ?>" width="550px" height="650px" />
			</span>
		</div>
	</div>
</div>
<!-- /.wrap -->

<?php the_content();?>

<section class="container white-space">

	<div class="head">
		<h2>
			<?php echo carbon_get_post_meta(get_the_ID(),'homepage_services_main_title'); ?>
		</h2>
		<blockquote>
			<h3>
				<?php echo carbon_get_post_meta(get_the_ID(),'homepage_services_quote'); ?>
			</h3>
		</blockquote>
	</div>

	<div class="grid-4">
		<?php 
			$services=carbon_get_post_meta(get_the_ID(),'home_services_list');
		foreach($services as $service){
	?>
		<div class="service col">
			<div class="icon">
				<i class="fa <?php print $service['homepage_services_icon'];?>"></i>
			</div>
			<div class="service_title">
				<h4><?php print $service['homepage_services_title'];?> </h4>
			</div>
			<div class="service_description">
				<p> <?php print $service['homepage_services_text'];?></p>
			</div>
		</div>
		<?php } ?>
	</div>
</section>



<?php
endwhile;
?>



<section class="container white-space portfolio mt-60 mb-10">
	<div class="head">
		<h2>some of my recent work</h2>
	</div>
	<div class="grid-3">
		<?php
            $args = array(
			'post_type'=> 'portfolio',
			'posts_per_page' => 3
            );
            query_posts( $args );
            while ( have_posts() ) : the_post();
            ?>
		<div class="item col">

			<div class="overlay">
				<a href="#">
					<img src="<?php the_post_thumbnail_url() ?>" alt="">
				</a>

				<div class="caption">
					<i><?php echo wp_filter_nohtml_kses(get_the_excerpt());?></i>
					<h4><?php the_title();?></h4>
					<button>view project</button>
				</div>
			</div>

		</div>
		<?php
                endwhile;
            
                // Reset Query
                wp_reset_query();
                ?>
	</div>
</section>

<section class="bg-grey cta_infograph">
	<div class="container grid-2">
		<div class="info_seo dv-flex col">
			<div class="info_seo_graph grid-3">
				<div class="search col">
					<h5>95 <small>%</small> </h5> <i class="fas fa-search fa-2x"></i>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, ea?</p>
				</div>

				<div class="clients col">
					<h5>7 <small>+</small> </h5> <i class="fas fa-users fa-2x"></i>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, ea?</p>
				</div>

				<div class="globe col"> 
					<h5>15 <small>+</small> </h5> <i class="fas fa-globe-asia fa-2x"></i>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, ea?</p>
				</div>
			</div>

			<div class="title">
				<h2>
					why should we use <b>seo</b>? <br>
					<b>optimize</b> your website
				</h2>
			</div>
		</div>

		<div class="image">
			<img src="<?php echo get_template_directory_uri() ?>/assets/img/Image-1.jpg" alt="" width="400px" height="500px">
		</div>
	</div>
</section>

<?php get_footer(); ?>
