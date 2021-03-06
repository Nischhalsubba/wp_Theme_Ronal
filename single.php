<?php  get_header(); ?>


<?php while(have_posts()) : the_post(); ?>
<div class="container-fluid inner_hero inner_blog">
	<div class="img_holder">
		<img src="<?php the_post_thumbnail_url() ?>" alt="">
	</div>
			<h2 class="project_name">
				<a href="#"><?php
						foreach((get_the_category()) as $category) { 
							echo $category->cat_name . ' '; 
						} ?>
				</a>
			</h2>
	<h1 class="yellow_underline"><?php the_title(); ?> </h1>
</div>

<div class="container">
	<div class="portfolio_content">
		<?php the_content(); ?>
	</div>
	<div class="content_info clear ptb-40">
		<h4> Published on: <?php the_time(get_option('date_format')); ?></h4>
		<h4 class="author">Written By: <?php the_author(); ?></h4>
	</div>

</div>
<?php endwhile; ?>


<?php get_footer(); ?>
