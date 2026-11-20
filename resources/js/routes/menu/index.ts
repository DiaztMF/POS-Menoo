import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/menu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Pos\MenuController::index
 * @see app/Http/Controllers/Pos/MenuController.php:16
 * @route '/menu'
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
* @see \App\Http\Controllers\Pos\MenuController::store
 * @see app/Http/Controllers/Pos/MenuController.php:41
 * @route '/api/menu'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/menu',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Pos\MenuController::store
 * @see app/Http/Controllers/Pos/MenuController.php:41
 * @route '/api/menu'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\MenuController::store
 * @see app/Http/Controllers/Pos/MenuController.php:41
 * @route '/api/menu'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Pos\MenuController::store
 * @see app/Http/Controllers/Pos/MenuController.php:41
 * @route '/api/menu'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Pos\MenuController::store
 * @see app/Http/Controllers/Pos/MenuController.php:41
 * @route '/api/menu'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Pos\MenuController::update
 * @see app/Http/Controllers/Pos/MenuController.php:66
 * @route '/api/menu/{menuItem}'
 */
export const update = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/menu/{menuItem}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Pos\MenuController::update
 * @see app/Http/Controllers/Pos/MenuController.php:66
 * @route '/api/menu/{menuItem}'
 */
update.url = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menuItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { menuItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    menuItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        menuItem: typeof args.menuItem === 'object'
                ? args.menuItem.id
                : args.menuItem,
                }

    return update.definition.url
            .replace('{menuItem}', parsedArgs.menuItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\MenuController::update
 * @see app/Http/Controllers/Pos/MenuController.php:66
 * @route '/api/menu/{menuItem}'
 */
update.put = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Pos\MenuController::update
 * @see app/Http/Controllers/Pos/MenuController.php:66
 * @route '/api/menu/{menuItem}'
 */
    const updateForm = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Pos\MenuController::update
 * @see app/Http/Controllers/Pos/MenuController.php:66
 * @route '/api/menu/{menuItem}'
 */
        updateForm.put = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Pos\MenuController::toggle
 * @see app/Http/Controllers/Pos/MenuController.php:85
 * @route '/api/menu/{menuItem}/toggle'
 */
export const toggle = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/api/menu/{menuItem}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Pos\MenuController::toggle
 * @see app/Http/Controllers/Pos/MenuController.php:85
 * @route '/api/menu/{menuItem}/toggle'
 */
toggle.url = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menuItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { menuItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    menuItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        menuItem: typeof args.menuItem === 'object'
                ? args.menuItem.id
                : args.menuItem,
                }

    return toggle.definition.url
            .replace('{menuItem}', parsedArgs.menuItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\MenuController::toggle
 * @see app/Http/Controllers/Pos/MenuController.php:85
 * @route '/api/menu/{menuItem}/toggle'
 */
toggle.patch = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Pos\MenuController::toggle
 * @see app/Http/Controllers/Pos/MenuController.php:85
 * @route '/api/menu/{menuItem}/toggle'
 */
    const toggleForm = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Pos\MenuController::toggle
 * @see app/Http/Controllers/Pos/MenuController.php:85
 * @route '/api/menu/{menuItem}/toggle'
 */
        toggleForm.patch = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggle.form = toggleForm
/**
* @see \App\Http\Controllers\Pos\MenuController::destroy
 * @see app/Http/Controllers/Pos/MenuController.php:98
 * @route '/api/menu/{menuItem}'
 */
export const destroy = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/menu/{menuItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Pos\MenuController::destroy
 * @see app/Http/Controllers/Pos/MenuController.php:98
 * @route '/api/menu/{menuItem}'
 */
destroy.url = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menuItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { menuItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    menuItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        menuItem: typeof args.menuItem === 'object'
                ? args.menuItem.id
                : args.menuItem,
                }

    return destroy.definition.url
            .replace('{menuItem}', parsedArgs.menuItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pos\MenuController::destroy
 * @see app/Http/Controllers/Pos/MenuController.php:98
 * @route '/api/menu/{menuItem}'
 */
destroy.delete = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Pos\MenuController::destroy
 * @see app/Http/Controllers/Pos/MenuController.php:98
 * @route '/api/menu/{menuItem}'
 */
    const destroyForm = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Pos\MenuController::destroy
 * @see app/Http/Controllers/Pos/MenuController.php:98
 * @route '/api/menu/{menuItem}'
 */
        destroyForm.delete = (args: { menuItem: number | { id: number } } | [menuItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const menu = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
toggle: Object.assign(toggle, toggle),
destroy: Object.assign(destroy, destroy),
}

export default menu