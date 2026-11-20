import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
export const menu = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: menu.url(options),
    method: 'get',
})

menu.definition = {
    methods: ["get","head"],
    url: '/api/pos/menu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
menu.url = (options?: RouteQueryOptions) => {
    return menu.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
menu.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: menu.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
menu.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: menu.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
    const menuForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: menu.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
        menuForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: menu.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\PosController::menu
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
        menuForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: menu.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    menu.form = menuForm
/**
* @see \App\Http\Controllers\Pos\PosController::checkout
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/api/pos/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Pos\PosController::checkout
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\PosController::checkout
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Pos\PosController::checkout
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Pos\PosController::checkout
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
const pos = {
    menu: Object.assign(menu, menu),
checkout: Object.assign(checkout, checkout),
}

export default pos