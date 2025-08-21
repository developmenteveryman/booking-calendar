<?php

/*
  Plugin Name: Booking Calendar
  Version: 1.0
  Author: NM Ifrim
  Author URI: https://github.com/NIfrim
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

function booking_calendar_block_register() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'booking_calendar_block_register' );