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

<div class="grey-space">
	<div class="container">
		<div class="jumbotron">
			<h2 class="jumbotron-title">I'm a dedicated Squarespace developer</h2>
			<p class="jumbotron-content">Being that I've based my business off of the Squarespace platform, there's
				nothing I can't handle. Below
				you'll find a selection of some of my most recent Squarespace projects that showcase the type of clients
				I work closely with.you'll find a selection of some of my most recent Squarespace projects that showcase
				the type of clients I work closely with.</p>
		</div>
	</div>
</div>

<section class="container white-space portfolio ptb-40">
	<div class="head_title mb-10">
		<h2> <u>some of my recent work</u></h2>
	</div>
	<div class="grid-3 grid-gap-40">
		<?php
            $args = array(
			'post_type'=> 'portfolio',
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
					<a href="<?php the_permalink(); ?>" class="btn">view project</a>
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

<?php get_footer(); ?>
