<script>
	import { setReturnLocation } from '$lib/util/store';
</script>

<div class="contents">
	<div class="logo">
		<div class="logo-left">
			<svg>
				<image xlink:href="/images/stellera.svg" />
			</svg>
			<div class="logo-text">
				Learn astronomy in a fun and interactive way! Enhance your stargazing experience with
				engaging quizzes and explore the wonders of the night sky. Challenge yourself, compete with
				friends, and become a star expert. Start your cosmic journey today!
			</div>
		</div>
		<div class="logo-right"></div>
	</div>
	<div class="recommended">
		<div class="recommended-head">Play our recommended games</div>
		<div class="recommended-body">
			<div class="card">
				<div class="card-head">Orion</div>
				<p class="card-text">
					One of the most recognizable constellation of the night sky, featuring the 'Belt of Orion'
					made up of three aligned stars.
				</p>
				<a href="/game/orion" on:click={setReturnLocation('recommended')} class="play">PLAY</a>
			</div>
			<div class="card">
				<div class="card-head">Ursa Major</div>
				<p class="card-text">
					Known as the Great Bear, Ursa Major is one of the largest and most recognizable
					constellations in the night sky. Featuring the famous Big Dipper asterism.
				</p>
				<a href="/game/ursamajor" on:click={setReturnLocation('recommended')} class="play">PLAY</a>
			</div>
			<div class="card">
				<div class="card-head">Bright Stars</div>
				<p class="card-text">
					Explore the luminous giants of the night sky, from the dazzling Sirius to the brilliant
					Vega. Learn about their characteristics and how to identify them.
				</p>
				<a href="/game/10bright" on:click={setReturnLocation('recommended')} class="play">PLAY</a>
			</div>
		</div>
		<a href="/menu/recommended" class="more-recommended">Other recommended games →</a>
	</div>
	<div class="recommended">
		<div class="recommended-head">Other Categories</div>
		<div class="recommended-body">
			<div class="card">
				<div class="card-head">Northern Circumpolar</div>
				<p class="card-text">
					See constellations that never set! In the northern hemisphere, constellations like Ursa
					Major and Cassiopeia are always visible, circling the North Star all year."
				</p>
				<a href="/menu/northern_circumpolar" class="play">View</a>
			</div>
			<div class="card">
				<div class="card-head">Southern Circumpolar</div>
				<p class="card-text">
					Explore constellations always in view from the southern hemisphere! The Southern Cross and
					Centaurus never dip below the horizon, offering a constant celestial display.
				</p>
				<a href="/menu/southern_circumpolar" class="play">View</a>
			</div>
			<div class="card">
				<div class="card-head">Winter Constellations</div>
				<p class="card-text">
					Enjoy Winter Constellations like Orion and Taurus during northern hemisphere winters. In
					the southern hemisphere, see these constellations in summer.
				</p>
				<a href="/menu/winter" class="play">View</a>
			</div>
			<div class="card">
				<div class="card-head">Summer Constellations</div>
				<p class="card-text">
					Marvel at Summer Constellations like Lyra and Scorpius lighting up northern hemisphere
					summer nights. In the southern hemisphere, see these constellations in winter.
				</p>
				<a href="/menu/summer" class="play">View</a>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		color: inherit;
		text-decoration: inherit;
	}

	.logo {
		flex: 0;
		display: flex;
		border-bottom: 1px solid #404040;
		padding: 4rem;
	}

	.logo-left {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.logo-right {
		flex: 1;
	}

	image,
	svg {
		width: 24rem;
		height: 8rem;
	}

	.logo-text {
		margin-top: 2rem;
		font-size: 1.2rem;
	}

	.recommended {
		padding: 1rem;
		display: flex;
		border-bottom: 1px solid #404040;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.recommended-head {
		text-align: center;
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.more-recommended {
		margin-top: 0.5rem;
		margin-left: 0.5rem;
	}

	.recommended-body {
		display: flex;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		margin: 0.25rem;
		background-color: #292929;
		text-align: center;
		flex: 1;
		border-radius: 0.5rem;
	}

	.card-head {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.card-text {
		margin-bottom: 2rem;
	}

	.play {
		background-color: #3ac7ff;
		color: #000000;
		margin-top: auto;
		padding: 0.25rem;
		width: 4rem;
		border-radius: 4rem;
	}
</style>
