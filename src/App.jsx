import { useEffect } from 'react'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

export default function App() {
  useEffect(() => {
    /* ============================================================
       BACKGROUND: stars canvas + fireflies + petals + butterflies
    ============================================================ */
    const canvas = document.getElementById('bg-canvas')
    const ctx = canvas.getContext('2d')
    let stars = []
    let rafId = null

    function resize() {
      canvas.width = innerWidth
      canvas.height = innerHeight
    }
    resize()
    addEventListener('resize', resize)

    function initStars() {
      stars = []
      const count = Math.floor((innerWidth * innerHeight) / 9000)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * innerWidth, y: Math.random() * innerHeight,
          r: Math.random() * 1.4 + 0.3, tw: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 + 0.005
        })
      }
    }
    initStars()

    let bgPhase = 'night' // 'night' | 'dawn'
    function drawSky() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.tw += s.speed
        const alpha = bgPhase === 'dawn' ? (0.15 + Math.abs(Math.sin(s.tw)) * 0.2) : (0.35 + Math.abs(Math.sin(s.tw)) * 0.65)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })
      rafId = requestAnimationFrame(drawSky)
    }
    rafId = requestAnimationFrame(drawSky)

    // fireflies
    function spawnFirefly() {
      const el = document.createElement('div')
      el.className = 'firefly'
      const x = Math.random() * innerWidth, y = innerHeight * 0.4 + Math.random() * innerHeight * 0.55
      el.style.left = x + 'px'; el.style.top = y + 'px'
      document.body.appendChild(el)
      gsap.to(el, { opacity: 1, duration: 1.2 })
      gsap.to(el, {
        x: '+=' + (Math.random() * 160 - 80), y: '-=' + (Math.random() * 160 + 60),
        duration: 6 + Math.random() * 4, ease: 'sine.inOut',
        onComplete: () => { gsap.to(el, { opacity: 0, duration: 1.2, onComplete: () => el.remove() }) }
      })
    }
    const fireflyInterval = setInterval(spawnFirefly, 900)

    // petals
    function spawnPetal() {
      const el = document.createElement('div')
      el.className = 'petal'; el.innerHTML = '&#127800;'
      el.style.left = Math.random() * innerWidth + 'px'
      el.style.fontSize = (14 + Math.random() * 14) + 'px'
      document.body.appendChild(el)
      gsap.to(el, {
        y: innerHeight + 80, x: '+=' + (Math.random() * 140 - 70), rotation: Math.random() * 360,
        duration: 8 + Math.random() * 5, ease: 'none',
        onComplete: () => el.remove()
      })
      gsap.to(el, { opacity: 0.9, duration: 1 })
    }
    let petalTimer = null
    function startPetals() { if (petalTimer) return; petalTimer = setInterval(spawnPetal, 500) }
    function stopPetals() { clearInterval(petalTimer); petalTimer = null }

    // butterflies
    function spawnButterfly() {
      const el = document.createElement('div')
      el.className = 'butterfly'; el.innerHTML = '&#129419;'
      el.style.left = '-30px'
      el.style.top = (innerHeight * 0.2 + Math.random() * innerHeight * 0.5) + 'px'
      document.body.appendChild(el)
      gsap.timeline({ onComplete: () => el.remove() })
        .to(el, { x: innerWidth + 60, duration: 10 + Math.random() * 4, ease: 'sine.inOut' })
      gsap.to(el, { y: '+=40', duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }
    let butterflyTimer = null
    function startButterflies() { if (butterflyTimer) return; butterflyTimer = setInterval(spawnButterfly, 1800) }
    function stopButterflies() { clearInterval(butterflyTimer); butterflyTimer = null }

    // mouse glow
    const glow = document.getElementById('mouse-glow')
    function onMouseMove(e) {
      gsap.to(glow, { left: e.clientX, top: e.clientY, duration: 0.6, ease: 'power2.out' })
    }
    addEventListener('mousemove', onMouseMove)

    /* ============================================================
       TYPEWRITER helper
    ============================================================ */
    function typeLines(container, lines, opts = {}) {
      const { charDelay = 42, linePause = 1100, onDone = () => {} } = opts
      container.innerHTML = ''
      let li = 0
      function nextLine() {
        if (li >= lines.length) { onDone(); return }
        const span = document.createElement('span')
        span.className = 'typeline'
        span.style.opacity = 1
        const cursor = document.createElement('span')
        cursor.className = 'cursor'; cursor.textContent = '\u00A0'
        span.appendChild(document.createTextNode(''))
        container.appendChild(span)
        span.appendChild(cursor)
        const text = lines[li]
        let ci = 0
        const iv = setInterval(() => {
          span.childNodes[0].textContent += text[ci]
          ci++
          if (ci >= text.length) {
            clearInterval(iv)
            cursor.remove()
            li++
            setTimeout(nextLine, linePause)
          }
        }, charDelay)
      }
      nextLine()
    }

    /* ============================================================
       SCENE MANAGER
    ============================================================ */
    const scenes = ['scene-1', 'scene-2', 'scene-3', 'scene-4', 'scene-5', 'scene-6', 'scene-7', 'scene-final']
    function goTo(id) {
      scenes.forEach(s => {
        const el = document.getElementById(s)
        if (s === id) el.classList.add('active')
        else el.classList.remove('active')
      })
    }

    /* ============================================================
       LOADING SCREEN
    ============================================================ */
    const loadingText = document.getElementById('loading-text')
    typeLines(loadingText, [
      "Sometimes words aren't enough...",
      "Some feelings deserve to be experienced."
    ], {
      charDelay: 38, linePause: 1400, onDone: () => {
        setTimeout(() => {
          gsap.to('#loading', {
            opacity: 0, duration: 1.4, onComplete: () => {
              document.getElementById('loading').style.display = 'none'
              goTo('scene-1')
              startScene1()
            }
          })
        }, 900)
      }
    })

    /* ============================================================
       SCENE 1 — Night Sky
    ============================================================ */
    function startScene1() {
      typeLines(document.getElementById('s1-type'), [
        'Hey Alina...',
        'I made something for you...',
        "Because words alone weren't enough."
      ], {
        linePause: 1000, onDone: () => {
          const btn = document.getElementById('btn-continue')
          gsap.to(btn, { opacity: 1, pointerEvents: 'auto', duration: 1 })
        }
      })
    }

    function onContinueClick() {
      gsap.to('#scene-1', {
        opacity: 0, duration: 1, onComplete: () => {
          goTo('scene-2')
          startScene2()
        }
      })
    }
    document.getElementById('btn-continue').addEventListener('click', onContinueClick)

    /* ============================================================
       MUSIC — starts when the heart in Scene 2 is clicked
    ============================================================ */
    const bgm = document.getElementById('bgm')
    const player = document.getElementById('music-player')
    let musicStarted = false
    function startMusic() {
      if (musicStarted) return
      player.classList.add('shown')
      bgm.volume = 0
      bgm.play().catch(() => { /* place love-story.mp3 in /public to enable sound */ })
      gsap.to(bgm, { volume: 0.3, duration: 2.5 })
      musicStarted = true
      document.getElementById('music-icon').innerHTML = '&#10074;&#10074;'
    }
    function onMusicIconClick() {
      if (!musicStarted) { startMusic(); return }
      if (bgm.paused) { bgm.play(); document.getElementById('music-icon').innerHTML = '&#10074;&#10074;' }
      else { bgm.pause(); document.getElementById('music-icon').innerHTML = '&#9658;' }
    }
    document.getElementById('music-icon').addEventListener('click', onMusicIconClick)
    function onVolChange(e) { bgm.volume = e.target.value / 100 }
    document.getElementById('vol-slider').addEventListener('input', onVolChange)

    /* ============================================================
       SCENE 2 — Broken Heart
    ============================================================ */
    let heartHealed = false
    function startScene2() {
      document.getElementById('heart-left').setAttribute('transform', 'translate(-6,-3) rotate(-4 50 45)')
      document.getElementById('heart-right').setAttribute('transform', 'translate(6,-3) rotate(4 50 45)')
      typeLines(document.getElementById('s2-type'), [
        'I know I hurt you.',
        'I truly regret it.'
      ], { linePause: 1200 })
    }
    function onHeartClick() {
      if (heartHealed) return
      heartHealed = true

      // music begins the moment the heart is clicked
      startMusic()

      gsap.to('#heart-left', { attr: { transform: 'translate(0,0) rotate(0 50 45)' }, duration: 1.2, ease: 'power2.out' })
      gsap.to('#heart-right', { attr: { transform: 'translate(0,0) rotate(0 50 45)' }, duration: 1.2, ease: 'power2.out' })
      gsap.to('#heart-glow', { opacity: 1, duration: 0.8, onComplete: () => gsap.to('#heart-glow', { opacity: 0, duration: 1.6 }) })
      gsap.fromTo('#heart-wrap', { scale: 1 }, { scale: 1.15, duration: 0.4, yoyo: true, repeat: 1, ease: 'power1.inOut' })
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const h = document.createElement('div')
          h.style.position = 'fixed'; h.style.zIndex = 50; h.style.left = (innerWidth / 2 + Math.random() * 140 - 70) + 'px'
          h.style.top = (innerHeight / 2 + 40) + 'px'; h.style.fontSize = '16px'; h.innerHTML = '&#10084;&#65039;'
          h.style.pointerEvents = 'none'
          document.body.appendChild(h)
          gsap.to(h, { y: -(160 + Math.random() * 120), x: '+=' + (Math.random() * 80 - 40), opacity: 0, duration: 2.2, ease: 'power1.out', onComplete: () => h.remove() })
        }, i * 90)
      }
      setTimeout(() => {
        gsap.to('#scene-2', {
          opacity: 0, duration: 1.2, onComplete: () => {
            goTo('scene-3'); startScene3()
          }
        })
      }, 2600)
    }
    document.getElementById('heart-wrap').addEventListener('click', onHeartClick)

    /* ============================================================
       SCENE 3 — Typing Apology
    ============================================================ */
    function startScene3() {
      typeLines(document.getElementById('s3-type'), [
        'I never wanted to hurt you.',
        'I made mistakes.',
        "I'm really sorry.",
        'If I could go back...',
        'I would choose your smile over my ego.',
        'I wish I had handled everything differently.'
      ], {
        linePause: 1000, onDone: () => {
          setTimeout(() => {
            gsap.to('#scene-3', {
              opacity: 0, duration: 1.4, onComplete: () => {
                goTo('scene-4'); startScene4()
              }
            })
          }, 1600)
        }
      })
    }

    /* ============================================================
       SCENE 4 — Healing & Motivation
    ============================================================ */
    const quotes = [
      'You are stronger than the pain you feel today.',
      'Some endings protect us from the wrong future.',
      'The right person will never make you question your worth.',
      'You deserve peace.',
      'You deserve respect.',
      'You deserve genuine love.',
      "Don't let one chapter convince you the story is over.",
      'The sun always rises after the darkest night.',
      'The right people will choose you without hesitation.',
      'Your smile deserves to exist again.',
      "Your story isn't over yet..."
    ]
    function startScene4() {
      document.body.classList.add('dawn')
      bgPhase = 'dawn'
      startButterflies(); startPetals()
      const el = document.getElementById('quote-el')
      let qi = 0
      function nextQuote() {
        if (qi >= quotes.length) {
          const btn = document.getElementById('btn-keepgoing')
          gsap.to(btn, { opacity: 1, pointerEvents: 'auto', duration: 1 })
          return
        }
        el.textContent = quotes[qi]
        gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 })
        setTimeout(() => {
          gsap.to(el, { opacity: 0, y: -14, duration: 0.9, onComplete: () => { qi++; nextQuote() } })
        }, 2500)
      }
      nextQuote()
    }
    function onKeepGoingClick() {
      stopButterflies(); stopPetals()
      gsap.to('#scene-4', {
        opacity: 0, duration: 1.2, onComplete: () => {
          goTo('scene-5'); startScene5()
        }
      })
    }
    document.getElementById('btn-keepgoing').addEventListener('click', onKeepGoingClick)

    /* ============================================================
       SCENE 5 — Growing Rose
    ============================================================ */
    function spawnRain() {
      const el = document.createElement('div')
      el.className = 'rain-drop'
      el.style.left = Math.random() * innerWidth + 'px'
      el.style.top = '-20px'
      document.body.appendChild(el)
      gsap.to(el, { y: innerHeight + 40, duration: 0.7 + Math.random() * 0.4, ease: 'none', onComplete: () => el.remove() })
    }
    let rainTimer = null
    function startScene5() {
      document.body.classList.remove('dawn')
      bgPhase = 'night'
      rainTimer = setInterval(spawnRain, 60)
      const stem = document.getElementById('rose-stem')
      const len = stem.getTotalLength()
      stem.style.strokeDasharray = len
      stem.style.strokeDashoffset = len
      gsap.to(stem, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.out', delay: 0.6 })

      gsap.to('#rose-leaf1', { opacity: 1, scale: 1, duration: 1, delay: 1.6, ease: 'back.out(1.7)' })
      gsap.to('#rose-leaf2', { opacity: 1, scale: 1, duration: 1, delay: 2, ease: 'back.out(1.7)' })
      gsap.to('#rose-flower', { opacity: 1, scale: 1, duration: 1.4, delay: 2.6, ease: 'back.out(1.4)' })
      gsap.to('#rose-light', { opacity: 1, duration: 2, delay: 2.8 })

      setTimeout(() => { clearInterval(rainTimer) }, 3600)

      typeLines(document.getElementById('s5-type'), [
        'Some things deserve another chance.'
      ], {
        linePause: 1000, onDone: () => {
          setTimeout(() => {
            gsap.to('#scene-5', {
              opacity: 0, duration: 1.3, onComplete: () => {
                goTo('scene-6'); startScene6()
              }
            })
          }, 2200)
        }
      })
    }

    /* ============================================================
       SCENE 6 — Letter
    ============================================================ */
    function startScene6() {
      const env = document.getElementById('envelope-inner')
      const letter = document.getElementById('letter-paper')
      const envelopeEl = document.getElementById('envelope')
      const clickHandler = () => {
        env.classList.add('open')
        setTimeout(() => {
          letter.classList.add('shown')
          setTimeout(() => {
            gsap.to('#scene-6', {
              opacity: 0, duration: 1.3, delay: 2.5, onComplete: () => {
                goTo('scene-7'); startScene7()
              }
            })
          }, 400)
        }, 700)
        envelopeEl.removeEventListener('click', clickHandler)
      }
      envelopeEl.addEventListener('click', clickHandler)
    }

    /* ============================================================
       SCENE 7 — Forgiveness
    ============================================================ */
    let noAttempts = 0
    function startScene7() {
      noAttempts = 0
      const noBtn = document.getElementById('no-btn')
      noBtn.classList.remove('roaming')
      noBtn.style.position = 'relative'; noBtn.style.left = ''; noBtn.style.top = ''
      document.getElementById('response-text').textContent = ''
    }

    function onYesClick() {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors: ['#ff7cb6', '#8a5fd9', '#ffd27a', '#ffffff'] })
        setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } }), 300)
      }
      for (let i = 0; i < 14; i++) {
        setTimeout(() => {
          const h = document.createElement('div')
          h.style.position = 'fixed'; h.style.zIndex = 250; h.style.left = (Math.random() * innerWidth) + 'px'
          h.style.top = (innerHeight + 20) + 'px'; h.style.fontSize = (14 + Math.random() * 14) + 'px'; h.innerHTML = '&#10084;&#65039;'
          h.style.pointerEvents = 'none'
          document.body.appendChild(h)
          gsap.to(h, { y: -(innerHeight + 100), x: '+=' + (Math.random() * 120 - 60), rotation: Math.random() * 180 - 90, duration: 3 + Math.random() * 2, ease: 'power1.out', onComplete: () => h.remove() })
        }, i * 80)
      }
      document.getElementById('response-text').textContent = 'Thank you \u2764\ufe0f'
      setTimeout(() => {
        gsap.to('#scene-7', {
          opacity: 0, duration: 1.4, onComplete: () => {
            goTo('scene-final'); startFinal()
          }
        })
      }, 3200)
    }
    document.getElementById('yes-btn').addEventListener('click', onYesClick)

    function onMaybeClick() {
      const rt = document.getElementById('response-text')
      rt.innerHTML = "I'll keep trying until your answer becomes Yes.<br><span class='mini-heart'>&#10084;&#65039;</span>"
    }
    document.getElementById('maybe-btn').addEventListener('click', onMaybeClick)

    const noBtn = document.getElementById('no-btn')
    function onNoEnter() {
      noAttempts++
      if (noAttempts > 5) {
        document.getElementById('popup-overlay').classList.add('show')
        return
      }
      noBtn.classList.add('roaming')
      const maxX = innerWidth - 140, maxY = innerHeight - 80
      const x = Math.max(20, Math.random() * maxX)
      const y = Math.max(20, Math.random() * maxY)
      noBtn.style.left = x + 'px'
      noBtn.style.top = y + 'px'
    }
    function onNoClick() {
      if (noAttempts >= 5) document.getElementById('popup-overlay').classList.add('show')
    }
    noBtn.addEventListener('mouseenter', onNoEnter)
    noBtn.addEventListener('click', onNoClick)

    function onPopupClose() {
      document.getElementById('popup-overlay').classList.remove('show')
      gsap.to('#scene-7', {
        opacity: 0, duration: 1, onComplete: () => {
          goTo('scene-6')
          document.getElementById('letter-paper').classList.add('shown')
          document.getElementById('envelope-inner').classList.add('open')
          gsap.to('#scene-6', { opacity: 1, duration: 1 })
          setTimeout(() => {
            gsap.to('#scene-6', {
              opacity: 0, duration: 1.3, delay: 1, onComplete: () => {
                goTo('scene-7'); gsap.to('#scene-7', { opacity: 1, duration: 1 })
              }
            })
          }, 100)
        }
      })
    }
    document.getElementById('popup-close').addEventListener('click', onPopupClose)

    /* ============================================================
       FINAL SCENE — Lanterns
    ============================================================ */
    let lanternTimer = null
    function spawnLantern() {
      const el = document.createElement('div')
      el.className = 'lantern'
      el.style.left = Math.random() * innerWidth + 'px'
      el.innerHTML = '<div class="lantern-top"></div><div class="lantern-body"></div>'
      document.body.appendChild(el)
      gsap.to(el, { y: -(innerHeight + 140), x: '+=' + (Math.random() * 100 - 50), duration: 9 + Math.random() * 5, ease: 'none', onComplete: () => el.remove() })
      gsap.to(el, { rotation: Math.random() * 10 - 5, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }
    function startFinal() {
      document.body.classList.remove('dawn'); bgPhase = 'night'
      lanternTimer = setInterval(spawnLantern, 450)
      typeLines(document.getElementById('sf-type'), [
        'No matter what your answer is...',
        'Thank you for being part of my life.',
        "I'll always wish you happiness.",
        "I'm truly sorry.",
        '\u2014 Huzaifa \u2764\ufe0f'
      ], {
        linePause: 1300, onDone: () => {
          setTimeout(() => {
            document.getElementById('fade-black').classList.add('show')
            gsap.to(bgm, { volume: 0, duration: 2.5 })
            setTimeout(() => {
              document.getElementById('replay-wrap').classList.add('show')
            }, 2200)
          }, 3200)
        }
      })
    }
    function onReplayClick() { location.reload() }
    document.getElementById('btn-replay').addEventListener('click', onReplayClick)

    /* ============================================================
       CLEANUP
    ============================================================ */
    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(fireflyInterval)
      clearInterval(petalTimer)
      clearInterval(butterflyTimer)
      clearInterval(rainTimer)
      clearInterval(lanternTimer)
      removeEventListener('resize', resize)
      removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div id="app">
      <canvas id="bg-canvas"></canvas>
      <div className="aurora"><span></span><span></span><span></span></div>
      <div id="mouse-glow"></div>

      <div id="loading">
        <svg className="heart" viewBox="0 0 32 29" fill="none">
          <path d="M16 28C16 28 2 19.5 2 9.8C2 4.4 6 1 10.4 1C13.3 1 15.4 2.6 16 5C16.6 2.6 18.7 1 21.6 1C26 1 30 4.4 30 9.8C30 19.5 16 28 16 28Z" fill="#ff7cb6" />
        </svg>
        <div id="loading-text"></div>
      </div>

      <div id="scenes">
        {/* SCENE 1 */}
        <section className="scene" id="scene-1">
          <div className="eyebrow">for Alina</div>
          <div className="typewrap" id="s1-type"></div>
          <button className="glow-btn" id="btn-continue" style={{ opacity: 0, pointerEvents: 'none' }}>Continue &#10084;</button>
        </section>

        {/* SCENE 2 */}
        <section className="scene" id="scene-2">
          <div className="eyebrow">before anything else</div>
          <div className="heart-wrap" id="heart-wrap">
            <div className="heart-glow-ring" id="heart-glow"></div>
            <svg viewBox="0 0 100 92">
              <defs>
                <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff9ad0" />
                  <stop offset="100%" stopColor="#7c4fd6" />
                </linearGradient>
              </defs>
              <path id="heart-left" d="M50 90 C50 90 6 58 6 28 C6 12 18 3 32 3 C40 3 46 8 50 16 L50 90 Z" fill="url(#heartGrad)" />
              <path id="heart-right" d="M50 90 C50 90 94 58 94 28 C94 12 82 3 68 3 C60 3 54 8 50 16 L50 90 Z" fill="url(#heartGrad)" />
            </svg>
          </div>
          <div className="typewrap" id="s2-type" style={{ marginTop: 20 }}></div>
        </section>

        {/* SCENE 3 */}
        <section className="scene" id="scene-3">
          <div className="typewrap" id="s3-type" style={{ maxWidth: 640 }}></div>
        </section>

        {/* SCENE 4 */}
        <section className="scene" id="scene-4">
          <h2 style={{ fontSize: 'clamp(22px,3.6vw,32px)', marginBottom: 8 }}>&#127800; A Little Reminder For You</h2>
          <div id="quote-stage"><div className="quote" id="quote-el"></div></div>
          <button className="glow-btn" id="btn-keepgoing" style={{ opacity: 0, pointerEvents: 'none' }}>&#10024; Keep Going</button>
        </section>

        {/* SCENE 5 */}
        <section className="scene" id="scene-5">
          <svg id="rose-svg" viewBox="0 0 200 260">
            <defs>
              <radialGradient id="roseGlow" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="rgba(255,210,122,.55)" />
                <stop offset="100%" stopColor="rgba(255,210,122,0)" />
              </radialGradient>
              <linearGradient id="petalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff9ad0" />
                <stop offset="100%" stopColor="#b53f7e" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="70" r="90" fill="url(#roseGlow)" id="rose-light" opacity="0" />
            <path id="rose-stem" d="M100 250 C 95 190, 105 140, 100 95" stroke="#3d7a45" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path id="rose-leaf1" d="M100 190 C 80 185, 65 195, 60 210 C 80 212, 95 205, 100 190 Z" fill="#3d7a45" opacity="0" transform="scale(0)" style={{ transformOrigin: '100px 195px' }} />
            <path id="rose-leaf2" d="M100 160 C 120 155, 135 165, 140 180 C 120 182, 105 175, 100 160 Z" fill="#4a8f52" opacity="0" transform="scale(0)" style={{ transformOrigin: '100px 165px' }} />
            <g id="rose-flower" opacity="0" transform="scale(0)" style={{ transformOrigin: '100px 90px' }}>
              <path d="M100 60 C 130 60, 145 85, 130 108 C 145 100, 150 75, 130 58 C 120 45, 100 45, 100 60 Z" fill="url(#petalGrad)" />
              <path d="M100 60 C 70 60, 55 85, 70 108 C 55 100, 50 75, 70 58 C 80 45, 100 45, 100 60 Z" fill="url(#petalGrad)" />
              <path d="M100 55 C 118 60, 122 80, 108 95 C 118 82, 112 65, 100 55 Z" fill="#ff9ad0" />
              <path d="M100 55 C 82 60, 78 80, 92 95 C 82 82, 88 65, 100 55 Z" fill="#ff9ad0" />
              <circle cx="100" cy="70" r="12" fill="#e85fa0" />
            </g>
          </svg>
          <div className="typewrap" id="s5-type" style={{ marginTop: 6 }}></div>
        </section>

        {/* SCENE 6 */}
        <section className="scene" id="scene-6">
          <div className="eyebrow">a letter, for you</div>
          <div className="envelope-wrap" id="envelope">
            <div className="envelope" id="envelope-inner">
              <div className="env-back"></div>
              <div className="env-front-l"></div>
              <div className="env-flap"></div>
              <div className="env-seal">&#10084;</div>
            </div>
          </div>
          <div className="letter-paper glass" id="letter-paper">
            <div className="letter-inner">
              <p>Alina,</p>
              <p>I keep thinking about the moments I got wrong, and how much I wish I could go back and choose differently &mdash; your smile over my ego, patience over pride.</p>
              <p>I never wanted to hurt you. That was never the plan, and it will always be my biggest regret.</p>
              <p>Whatever happens next, I need you to know you were never the problem. You deserve someone who chooses you gently, every single day.</p>
              <p>I'm sorry. Truly.</p>
              <p className="letter-sign">&mdash; Huzaifa</p>
            </div>
          </div>
        </section>

        {/* SCENE 7 */}
        <section className="scene" id="scene-7">
          <div className="choice-card glass">
            <h2 style={{ fontSize: 'clamp(22px,3.2vw,28px)' }}>Can you forgive me?</h2>
            <div className="choice-row" id="choice-row">
              <button className="choice-btn" id="yes-btn">&#10084;&#65039; Yes</button>
              <button className="choice-btn" id="maybe-btn">&#129300; Maybe</button>
              <button className="choice-btn" id="no-btn">&#128517; No</button>
            </div>
            <div className="response-text" id="response-text"></div>
          </div>
        </section>

        {/* FINAL SCENE */}
        <section className="scene" id="scene-final">
          <div className="typewrap" id="sf-type" style={{ maxWidth: 700 }}></div>
        </section>
      </div>

      <div id="music-player" className="glass">
        <div id="music-icon">&#9835;</div>
        <div id="music-meta">
          <div id="music-title">Love Story</div>
          <div id="music-sub">tap to play &middot; loops softly</div>
        </div>
        <input type="range" id="vol-slider" min="0" max="100" defaultValue="30" />
      </div>
      <audio id="bgm" loop src="/love-story.mp3"></audio>

      <div id="popup-overlay">
        <div className="popup-card glass">
          <p>Okay okay... &#129396;</p>
          <p style={{ fontSize: 16, color: 'var(--text-dim)' }}>At least hear me out.</p>
          <button className="glow-btn" id="popup-close" style={{ marginTop: 22 }}>Read the letter</button>
        </div>
      </div>

      <div id="fade-black"></div>
      <div id="replay-wrap">
        <button className="glow-btn" id="btn-replay">Watch it again</button>
      </div>
    </div>
  )
}
