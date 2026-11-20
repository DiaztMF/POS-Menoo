import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
const index1299d330f6f8b3910e64f26074718e08 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1299d330f6f8b3910e64f26074718e08.url(options),
    method: 'get',
})

index1299d330f6f8b3910e64f26074718e08.definition = {
    methods: ["get","head"],
    url: '/api/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
index1299d330f6f8b3910e64f26074718e08.url = (options?: RouteQueryOptions) => {
    return index1299d330f6f8b3910e64f26074718e08.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
index1299d330f6f8b3910e64f26074718e08.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1299d330f6f8b3910e64f26074718e08.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
index1299d330f6f8b3910e64f26074718e08.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index1299d330f6f8b3910e64f26074718e08.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
    const index1299d330f6f8b3910e64f26074718e08Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index1299d330f6f8b3910e64f26074718e08.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
        index1299d330f6f8b3910e64f26074718e08Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1299d330f6f8b3910e64f26074718e08.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
        index1299d330f6f8b3910e64f26074718e08Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1299d330f6f8b3910e64f26074718e08.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index1299d330f6f8b3910e64f26074718e08.form = index1299d330f6f8b3910e64f26074718e08Form
    /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
const indexb04228b982ada76cb6342fc1e43e9ac5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb04228b982ada76cb6342fc1e43e9ac5.url(options),
    method: 'get',
})

indexb04228b982ada76cb6342fc1e43e9ac5.definition = {
    methods: ["get","head"],
    url: '/api/laporan/daily',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
indexb04228b982ada76cb6342fc1e43e9ac5.url = (options?: RouteQueryOptions) => {
    return indexb04228b982ada76cb6342fc1e43e9ac5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
indexb04228b982ada76cb6342fc1e43e9ac5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb04228b982ada76cb6342fc1e43e9ac5.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
indexb04228b982ada76cb6342fc1e43e9ac5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb04228b982ada76cb6342fc1e43e9ac5.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
    const indexb04228b982ada76cb6342fc1e43e9ac5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexb04228b982ada76cb6342fc1e43e9ac5.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
        indexb04228b982ada76cb6342fc1e43e9ac5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexb04228b982ada76cb6342fc1e43e9ac5.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
        indexb04228b982ada76cb6342fc1e43e9ac5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexb04228b982ada76cb6342fc1e43e9ac5.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexb04228b982ada76cb6342fc1e43e9ac5.form = indexb04228b982ada76cb6342fc1e43e9ac5Form

/**
* Multiple routes resolve to \App\Http\Controllers\Pos\ReportController::index, so this export is a
* dictionary keyed by URI rather than a callable, with the verbs prefixed where two routes share a URI.
* Call a specific route with `index['<key>'](...)`, or import the route by name from your
* generated `routes/` directory.
*/
export const index = {
    '/api/laporan': index1299d330f6f8b3910e64f26074718e08,
    '/api/laporan/daily': indexb04228b982ada76cb6342fc1e43e9ac5,
}

const ReportController = { index }

export default ReportController