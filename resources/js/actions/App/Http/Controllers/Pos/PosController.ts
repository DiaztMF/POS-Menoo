import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/pos/menu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\PosController::index
 * @see app/Http/Controllers/Pos/PosController.php:17
 * @route '/api/pos/menu'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Pos\PosController::store
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/pos/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Pos\PosController::store
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\PosController::store
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Pos\PosController::store
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Pos\PosController::store
 * @see app/Http/Controllers/Pos/PosController.php:44
 * @route '/api/pos/checkout'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const PosController = { index, store }

export default PosController