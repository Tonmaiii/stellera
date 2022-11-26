<script lang="ts">
    import Topbar from './Topbar.svelte'

    import { createEventDispatcher, onMount } from 'svelte'
    import engine, { reset, exit } from './engine'
    import type { star } from '../util/types'
    import shuffle from '../util/shuffle'
    import { formatTime, resetTimer, stopTimer, timer } from '../util/timer'
    import data from '../util/data'

    const { stars, starsIndexed, constellationship } = $data
    export let answers: string[]

    export let useDesignation: boolean
    export let showConstellation: boolean

    export let latitude: number
    export let longitude: number

    export let useDeviceOrientation: boolean

    let canvas: HTMLCanvasElement
    let overlay: HTMLCanvasElement

    const starsCount: number = stars.length
    const lines = Object.values(constellationship)
        .flat(2)
        .map(hic => starsIndexed[hic].index)

    // Buffer for star positions on the screen
    const starScreenPos = new Float32Array(starsCount * 3)

    const rounds = answers.length

    let completed = false

    let round = 0
    let tries = 0

    let wrongClicks = 0
    let correctClicks = 0

    let starLabels = Array<{ hic: string; frame: number; correct: boolean }>()

    const dispatch = createEventDispatcher()

    let playing = true
    const exitGame = () => {
        exit()
        dispatch('exit')
    }

    const resetGame = () => {
        completed = false
        playing = true
        round = 0
        tries = 0
        wrongClicks = 0
        correctClicks = 0
        starLabels = []
        answers = shuffle(answers)
        reset()
        resetTimer()
    }

    let fov: number
    const updateOverlay = (
        ctx: CanvasRenderingContext2D,
        _fov: number,
        ra: number
    ) => {
        ctx.clearRect(0, 0, overlay.width, overlay.height)
        fov = _fov

        starLabels = starLabels.filter(({ frame }) => frame < labelDuration)
        starLabels.forEach(label => {
            drawStarLabel(ctx, label)
            label.frame++
        })

        if (tries >= 3) flashStar(ctx, starsIndexed[answers[round]])
        ctx.translate(40, overlay.height - 40)
        drawCompass(ctx, ra)
        ctx.resetTransform()
    }

    const correct = (hic: string) => {
        round++
        tries = 0
        correctClicks++
        starLabels.push({ hic, frame: 0, correct: true })
        flashFrame = 0
        if (round >= rounds) {
            completed = true
            stopTimer()
        }
    }

    const wrong = (hic: string) => {
        tries++
        wrongClicks++
        starLabels.push({ hic, frame: 0, correct: false })
    }

    const drawCompass = (ctx: CanvasRenderingContext2D, ra: number) => {
        ctx.beginPath()
        ctx.arc(0, 0, 30, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffffb0'
        ctx.fill()
        ctx.rotate(-ra)

        ctx.beginPath()
        ctx.moveTo(-6, 0)
        ctx.lineTo(0, -30)
        ctx.lineTo(6, 0)
        ctx.fillStyle = '#ff0000'
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(-6, 0)
        ctx.lineTo(0, 30)
        ctx.lineTo(6, 0)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    let flashFrame = 0
    const flashStar = (ctx: CanvasRenderingContext2D, star: star) => {
        const i = star.index
        let x = starScreenPos[3 * i]
        let y = -starScreenPos[3 * i + 1]
        const w = starScreenPos[3 * i + 2]

        if (w > 0 && flashFrame % 60 < 30) {
            const size = starSize(star.magnitude)
            const screenX = ((x + 1) * overlay.width) / 2
            const screenY = ((y + 1) * overlay.height) / 2
            ctx.beginPath()
            ctx.arc(screenX, screenY, Math.max(10, size / 2), 0, Math.PI * 2)
            ctx.fillStyle = '#ff0000'
            ctx.fill()
        }

        if (w < 0 || x < -1 || x > 1 || y < -1 || y > 1) {
            flashFrame = 0
            x *= overlay.width
            y *= overlay.height
            if (w < 0) {
                x = -x
                y = -y
            }

            const mag = Math.sqrt(x ** 2 + y ** 2)
            x /= mag
            y /= mag

            const angle = Math.atan2(y, x)
            const distance = Math.min(
                Math.abs(overlay.width / 2 / Math.cos(angle)),
                Math.abs(overlay.height / 2 / Math.sin(angle))
            )

            ctx.translate(overlay.width / 2, overlay.height / 2)
            ctx.rotate(angle - Math.PI / 2)
            ctx.translate(0, distance - 20)
            ctx.beginPath()
            ctx.moveTo(-30, -50)
            ctx.lineTo(0, 0)
            ctx.lineTo(30, -50)
            ctx.strokeStyle = '#ff0000'
            ctx.lineWidth = 5
            ctx.stroke()
            ctx.resetTransform()
        } else flashFrame = (flashFrame + 1) % 60
    }

    const labelDuration = 120

    const drawStarLabel = (
        ctx: CanvasRenderingContext2D,
        label: { hic: string; frame: number; correct: boolean }
    ) => {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '1.2rem Arial'
        const star = starsIndexed[label.hic]
        const i = star.index
        if (starScreenPos[3 * i + 2] > 1) return
        const x = ((starScreenPos[3 * i] + 1) / 2) * canvas.width
        const y = -((starScreenPos[3 * i + 1] - 1) / 2) * canvas.height
        const size = starSize(star.magnitude)

        const alpha = 1 - label.frame / labelDuration

        if (label.correct) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.fillText(star.display_name, x, y + (size / 2) * (7 / 5) + 16)
            if (
                star.display_name !== star.designation_name &&
                star.designation_name
            ) {
                ctx.fillText(
                    star.designation_name,
                    x,
                    y + (size / 2) * (7 / 5) + 36
                )
            }
        } else {
            ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`

            if (useDesignation) {
                ctx.fillText(
                    star.designation_name,
                    x,
                    y + (size / 2) * (7 / 5) + 16
                )
            } else {
                ctx.fillText(
                    star.display_name,
                    x,
                    y + (size / 2) * (7 / 5) + 16
                )
            }
        }
    }

    let click = false
    const clickRange = 30
    const handleClick = (e: MouseEvent) => {
        if (!click) return

        const mouseX = e.clientX
        const mouseY = e.clientY

        let closest = Infinity
        let closestStar: star = null

        for (let i = 0; i < starsCount; i++) {
            const star = stars[i]
            if (!star.display_name) continue
            if (starScreenPos[3 * i + 2] < 0) continue

            const starX = ((starScreenPos[3 * i] + 1) / 2) * canvas.width
            const starY = -((starScreenPos[3 * i + 1] - 1) / 2) * canvas.height
            const delta = (mouseX - starX) ** 2 + (mouseY - starY) ** 2

            if (
                delta < closest &&
                (delta <= clickRange ** 2 ||
                    delta <= (starSize(star.magnitude) / 2) ** 2)
            ) {
                closest = delta
                closestStar = star
            }
        }

        if (!closestStar) return
        if (closestStar.HIC === answers[round]) {
            correct(closestStar.HIC)
        } else {
            wrong(closestStar.HIC)
        }
    }

    onMount(() => {
        resetGame()

        const gl = canvas.getContext('webgl2')
        engine(
            gl,
            canvas,
            stars,
            lines,
            starScreenPos,
            showConstellation,
            (fov, ra) => updateOverlay(ctx, fov, ra),
            latitude,
            longitude,
            useDeviceOrientation
        )

        const ctx = overlay.getContext('2d')
        overlay.width = overlay.clientWidth
        overlay.height = overlay.clientHeight
        window.addEventListener('resize', () => {
            overlay.width = overlay.clientWidth
            overlay.height = overlay.clientHeight
        })
    })

    const starSize = (magnitude: number) =>
        ((1.5 ** (-magnitude - 10) * 1000 * 45) / fov) *
        ((fov / 45 - 1) * 0.6 + 1) *
        Math.min(fov, 1)

    document.addEventListener('pointerup', handleClick)
    document.addEventListener('pointerdown', () => (click = true))
    document.addEventListener('pointermove', () => (click = false))
</script>

<canvas bind:this={canvas} />
<canvas bind:this={overlay} />

{#if !completed}
    <Topbar
        name={useDesignation
            ? starsIndexed[answers[round]].designation_name
            : starsIndexed[answers[round]].display_name}
        percentage={correctClicks + wrongClicks === 0
            ? 0
            : Math.round((100 * correctClicks) / (correctClicks + wrongClicks))}
        completed={round}
        total={rounds}
    />
    <button class="back" on:click={exitGame}>
        <i class="fas fa-angle-left" />
    </button>
{:else}
    <div class="container">
        <div class="result">
            <h1>Result</h1>
            <div>
                <h2>
                    {Math.round(
                        (100 * correctClicks) / (correctClicks + wrongClicks)
                    )}%
                </h2>
                <h2>{formatTime($timer)}</h2>
            </div>
            <div>
                <button on:click={resetGame}>Play Again</button>
                <button on:click={exitGame}>Exit</button>
            </div>
        </div>
    </div>
{/if}

<style>
    canvas {
        position: fixed;
        width: 100%;
        height: 100%;
    }

    div.container {
        position: absolute;
        color: white;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    h1,
    h2 {
        margin: 0.25rem;
        display: inline;
    }
    button {
        font-size: 1rem;
    }

    .back {
        position: absolute;
        width: 3rem;
        height: 3rem;
        background-color: transparent;
        border: none;
        margin: 0.5rem;
        color: white;
        font-size: 2rem;
        padding: 0;
    }

    div.result {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
