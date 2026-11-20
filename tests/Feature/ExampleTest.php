<?php

test('landing page redirects to dashboard', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('dashboard'));
});
