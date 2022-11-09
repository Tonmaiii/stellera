<script lang="ts">
    import Router from 'svelte-spa-router'
    import Menu from './menu/Menu.svelte'
    import './util/data'
    import './util/geolocation'
</script>

<Router
    routes={{
        '/:gameCode?': Menu
    }}
/>
