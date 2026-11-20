import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\ReportController::index
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan'
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
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
export const daily = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daily.url(options),
    method: 'get',
})

daily.definition = {
    methods: ["get","head"],
    url: '/api/laporan/daily',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
daily.url = (options?: RouteQueryOptions) => {
    return daily.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
daily.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daily.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
daily.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: daily.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
    const dailyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: daily.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
        dailyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: daily.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\ReportController::daily
 * @see app/Http/Controllers/Pos/ReportController.php:13
 * @route '/api/laporan/daily'
 */
        dailyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: daily.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    daily.form = dailyForm
const report = {
    index: Object.assign(index, index),
daily: Object.assign(daily, daily),
}

export default report