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
	<div class="position-relative">
		<div class="frontpage-quote container">
			<h3>Creative SEO Specialist</h3>
			<blockquote class="mt-25">
				<h1>
					<?php echo carbon_get_post_meta(get_the_ID(),'homepage_banner_title'); ?>
				</h1>
			</blockquote>
			<a href="<?php echo carbon_get_post_meta(get_the_ID(),'homepage_banner_link'); ?>" class="btn btn-yellow">
				GET STARTED
			</a>
		</div>

		<div class="banner grid-row-1">

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

<section class="portfolio">
	<div class="container">
		<div class="head_title ptb-40">
			<h2 class="yellow_underline">some of my recent work.</h2>
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
	</div>
	<br>
	<br>
	<br>
</section>

<?php
endwhile;
?>

<section class="about_me bg-grey">
	<div class="container grid-col-2">
		<img src="<?php echo get_template_directory_uri(); ?>/assets/img/profile_pic.png" alt="">

		<div class="content_right">
			<div class="content_right_title">
				<h2>Introduction of Ronal chhetri</h2>
				<h3> <u>SEO Specialist</u></h3>
			</div>

			<div class="content_right_content">
				<p>
					A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring
					which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which
					was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the
					exquisite sense of mere tranquil existence, that I neglect my talents.
				</p>

				<ul>
					<li>Two year plus of expierence in SEO</li>
					<li>Generating SEO Report for the client</li>
					<li>On and Off page SEO With proper compititor analysis and trend</li>
					<li>Digital Marketer with latest market trends</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<section class="container white-space">
	<div class="head_title ptb-40">
		<h2>
			<u><?php echo carbon_get_post_meta(get_the_ID(),'homepage_services_main_title'); ?></u>
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
		<div class="service mb-10">
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
			<img src="<?php echo get_template_directory_uri() ?>/assets/img/Image-1.jpg" alt="" width="400px"
				height="500px">
		</div>
	</div>
</section>

<?php get_footer(); ?>
