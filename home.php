<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header(); ?>

<div class="hero">
	<div class="container">
		<h1>BLOG</h1>
	</div>
</div>

<section class="blog ptb-40">

	<main id="main" class="container grid-3 grid-gap-40" role="main">

		<?php if ( have_posts() ) : ?>

		<?php if ( is_home() && ! is_front_page() ) : ?>

		<?php endif; ?>

		<?php
			// Start the loop.
			while ( have_posts() ) :
				the_post();
		?>
		<div class="box" <?php post_class(); ?> id="post-<?php the_ID(); ?>">
			<div class="top">
				<div class="image">
					<img src="<?php echo get_the_post_thumbnail_url(); ?>" alt="">
				</div>
				<h2 class="title clear">
					<span class="title-lt"> <a href="#"><?php
						foreach((get_the_category()) as $category) { 
							echo $category->cat_name . ' '; 
						} ?></a>
					</span>
				</h2>
			</div>
			<div class="bottom">
				<div class="bottom_container clear">
					<b><a href="<?php the_permalink(); ?>" class="blog-title"><?php the_title(); ?></a></b>
					<div class="blog-content">
						<?php the_excerpt() ; ?>
					</div>
					<div class="buttons"><a class="btn btnWebsite" href="<?php the_permalink(); ?>">Read More</a></div>
					<hr>
					<span class="title-lt"><a href="#"><?php the_time('m/j/y') ?></a></span>
					<span class="title-rt"><a href="#"><?php the_author(); ?></a></span>
				</div>
			</div>

		</div>

		<?php
				// End the loop.
			endwhile;

			// Previous/next page navigation.
			the_posts_pagination(
				array(
					'prev_text'          => __( 'Previous page', 'RonalTheme' ),
					'next_text'          => __( 'Next page', 'RonalTheme' ),
					'before_page_number' => '<span class="meta-nav screen-reader-text">' . __( 'Page', 'RonalTheme' ) . ' </span>',
				)
			);

			// If no content, include the "No posts found" template.
		else :
			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- .site-main -->
</section><!-- .content-area -->

<?php get_footer(); ?>


<!-- displaying image portfolio url -->
<?php $portfolio_link = get_post_meta( get_the_ID(), 'portfolio_link' ); ?>
        <?php echo $portfolio_link[0]; ?>