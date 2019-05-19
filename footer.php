<?php
/**
 * Footer
 *
 * The footer template.
 *
 * @since   1.0.0
 * @package WP
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

wp_footer(); ?>

<?php
    // Start the loop.
	while ( have_posts() ) : the_post();
?>

<footer>
	<div class="container footer-grid">
		<div class="description">
			<div class="description_about">
				<h5><u> about ronal</u></h5>
				<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
				</p>
			</div>
			<!-- description_about -->

			<div class="find">
				<h5><u>find me</u></h5>

				<div class="find_information">
					<em>Kathmandu</em>
					<em>9815304900</em>
					<em>chhetrironal@gmail.com</em>
				</div>
				<!-- find_information -->
			</div>
			<!-- find -->
		</div>
		<!-- description -->

		<div class="tech_used">
			<h3>
				<?php 
					$footer_image_title=carbon_get_theme_option('footer_images_title');
					echo $footer_image_title;
				?>
			</h3>

			<div class="tech_used_image">
				<?php
				$tech_used=carbon_get_theme_option('footer_images_list');
				foreach($tech_used as $t){
					$image=wp_get_attachment_image_src($t['footer_technology_used'],$size='full');
				?>
				<img src="<?php echo $image[0]; ?>" />
				<?php
				}
			?>
			</div>
		</div>
		<!-- tech used -->

		<div class="cta">
			<div class="footer_contact_follow grid-2">
				<div class="footer_contact col">
					<div class="footer_contact_title">
						<h4><u> contact</u> </h4>
					</div>
					<!-- footer_contact_title -->

					<div class="footer_contact_content">
						<p>customer enquiry</p>
						<p>general enquiry</p>
						<p>custom enquiry</p>
					</div>
					<!-- footer_contact_content -->
				</div>
				<!-- footer_contact -->
				<div class="footer_follow col">
					<div class="footer_follow_title">
						<h4> <u>follow ronal</u></h4>
					</div>
					<!-- footer_follow_title -->

					<div class="footer_follow_content">
						<p>reddit</p>
						<p>pinterest</p>
						<p>twitter</p>
					</div>
					<!-- footer_follow_content -->
				</div>
				<!-- footer_follow -->
			</div>
			<!-- footer_contact_follow -->
		</div>
		<!-- CTA -->
	</div>
	<!-- container footer-grid -->
</footer>
<!-- footer -->

<?php
endwhile;
?>

</body>

</html>
