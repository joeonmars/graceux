<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return array(
	'*' => array(
        'omitScriptNameInUrls' => true,
    ),

    'graceux.craft.dev' => array(
        'devMode' => true,
        'user' => 'root',
        'password' => 'root',
        'database' => 'graceux'
    ),
);
