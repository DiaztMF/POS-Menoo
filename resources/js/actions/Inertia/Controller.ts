import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
const Controller15b5b6290dbad63e5e250e81ad4c2544 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller15b5b6290dbad63e5e250e81ad4c2544.url(options),
    method: 'get',
})

Controller15b5b6290dbad63e5e250e81ad4c2544.definition = {
    methods: ["get","head"],
    url: '/pos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
Controller15b5b6290dbad63e5e250e81ad4c2544.url = (options?: RouteQueryOptions) => {
    return Controller15b5b6290dbad63e5e250e81ad4c2544.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
Controller15b5b6290dbad63e5e250e81ad4c2544.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller15b5b6290dbad63e5e250e81ad4c2544.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
Controller15b5b6290dbad63e5e250e81ad4c2544.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller15b5b6290dbad63e5e250e81ad4c2544.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
    const Controller15b5b6290dbad63e5e250e81ad4c2544Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller15b5b6290dbad63e5e250e81ad4c2544.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
        Controller15b5b6290dbad63e5e250e81ad4c2544Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller15b5b6290dbad63e5e250e81ad4c2544.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/pos'
 */
        Controller15b5b6290dbad63e5e250e81ad4c2544Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller15b5b6290dbad63e5e250e81ad4c2544.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller15b5b6290dbad63e5e250e81ad4c2544.form = Controller15b5b6290dbad63e5e250e81ad4c2544Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
const Controlleraa40b76d95e9a485d3db1f7094792d8f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controlleraa40b76d95e9a485d3db1f7094792d8f.url(options),
    method: 'get',
})

Controlleraa40b76d95e9a485d3db1f7094792d8f.definition = {
    methods: ["get","head"],
    url: '/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
Controlleraa40b76d95e9a485d3db1f7094792d8f.url = (options?: RouteQueryOptions) => {
    return Controlleraa40b76d95e9a485d3db1f7094792d8f.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
Controlleraa40b76d95e9a485d3db1f7094792d8f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controlleraa40b76d95e9a485d3db1f7094792d8f.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
Controlleraa40b76d95e9a485d3db1f7094792d8f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controlleraa40b76d95e9a485d3db1f7094792d8f.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
    const Controlleraa40b76d95e9a485d3db1f7094792d8fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controlleraa40b76d95e9a485d3db1f7094792d8f.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
        Controlleraa40b76d95e9a485d3db1f7094792d8fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controlleraa40b76d95e9a485d3db1f7094792d8f.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/laporan'
 */
        Controlleraa40b76d95e9a485d3db1f7094792d8fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controlleraa40b76d95e9a485d3db1f7094792d8f.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controlleraa40b76d95e9a485d3db1f7094792d8f.form = Controlleraa40b76d95e9a485d3db1f7094792d8fForm

/**
* Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
* dictionary keyed by URI rather than a callable, with the verbs prefixed where two routes share a URI.
* Call a specific route with `Controller['<key>'](...)`, or import the route by name from your
* generated `routes/` directory.
*/
const Controller = {
    '/pos': Controller15b5b6290dbad63e5e250e81ad4c2544,
    '/laporan': Controlleraa40b76d95e9a485d3db1f7094792d8f,
}

export default Controller