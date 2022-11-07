<script lang="ts">
    import Router from 'svelte-spa-router'
    import Loader from './game/Loader.svelte'
    import Home from './Home.svelte'
    import './util/data'
    import './util/geolocation'
</script>

<Router
    routes={{
        '/': Home,
        '/play/:gameCode': Loader
    }}
/>
