<?php

namespace elementor\tests\phpunit\elementor\modules\checklist\classes;

use Elementor\Modules\Checklist\Steps\Setup_Header;
use Elementor\Modules\Checklist\Steps_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Test_Setup_Header_Step extends Step_Test_Base {
	private Setup_Header $step;

	public function test__various_cases() {
		$steps_manager = $this->checklist_module->get_steps_manager();
		$step = $steps_manager->get_step_by_id( Setup_Header::STEP_ID );

		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertFalse( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );

		$step->mark_as_completed();
		$this->assertTrue( $step->is_marked_as_completed() );
		$this->assertFalse( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );

		$step->unmark_as_completed();
		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertFalse( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );

		$this->set_wordpress_adapter_mock( [ 'get_query' ], [
			'get_query' => [ 'posts' => [] ],
		] );
		$step = new Setup_Header( $this->checklist_module, $this->wordpress_adapter );
		$step->maybe_immutably_mark_as_completed();
		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertTrue( $step->is_immutable_completed() );
		$this->assertTrue( $step->is_absolute_completed() );

		$this->set_wordpress_adapter_mock( [ 'get_query' ], [
			'get_query' => [],
		] );

		$step = new Setup_Header( $this->checklist_module, $this->wordpress_adapter );
		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertFalseno( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );
	}

	public function setUp(): void {
		$this->set_wordpress_adapter_mock( [ 'get_query' ], [
			'get_query' => [],
		] );

		parent::setUp();
	}

	public function tearDown(): void {
		parent::tearDown(); // TODO: Change the autogenerated stub
	}
}
