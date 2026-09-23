/**
 * NEELAGIRI CHANDRIKA — PERSONAL PORTFOLIO
 * Interactive Behaviors & Visual Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Live Indian Standard Time (IST) Clock ---
  const liveClockEl = document.getElementById('liveClock');
  function updateLiveClock() {
    if (!liveClockEl) return;
    try {
      const now = new Date();
      // Format to IST
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      liveClockEl.textContent = `${timeStr} IST`;
    } catch (e) {
      liveClockEl.textContent = 'IST (UTC+5:30)';
    }
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);


  // --- 2. Mobile Drawer Navigation ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('is-open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
      });
    });
  }


  // =========================================================================
  // --- 3. AI SCROLL MOTION & MAIN CONTEXT IDENTIFIER ENGINE ---
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  const scrollProgressIndicator = document.getElementById('scrollProgressIndicator');
  const hudProgressBar = document.getElementById('hudProgressFill');
  const hudPctBadge = document.getElementById('hudPctBadge');
  const hudChapterCode = document.getElementById('hudChapterCode');
  const hudTagPill = document.getElementById('hudTagPill');
  const hudTitleText = document.getElementById('hudTitleText');
  const hudSummaryText = document.getElementById('hudSummaryText');
  const hudTagsStream = document.getElementById('hudTagsStream');
  const hudJumpDots = document.querySelectorAll('.hud-jump-dot');
  const heroPortrait = document.getElementById('heroPortraitCard');
  const journeyNodes = document.querySelectorAll('.journey-stage-node');
  const contextElements = document.querySelectorAll('[data-context-chapter]');

  let currentActiveContextEl = null;

  function updateScrollMotionAndContext() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
    const progressPct = Math.round(progress * 100);

    // 1. Top progress beam & HUD fill
    if (scrollProgressIndicator) {
      scrollProgressIndicator.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    if (hudProgressBar) {
      hudProgressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    if (hudPctBadge) {
      hudPctBadge.textContent = `${progressPct}% OF STORY`;
    }

    // 2. Motion Scrolling: Hero Portrait Movement
    if (heroPortrait && scrollY < window.innerHeight * 1.2) {
      const translateY = scrollY * 0.14;
      const subtleScale = Math.max(1 - (scrollY * 0.0002), 0.96);
      heroPortrait.style.transform = `translateY(${translateY}px) scale(${subtleScale})`;
    }

    // 3. Focal Reading Line: 38% down viewport
    const focalY = scrollY + (window.innerHeight * 0.38);

    // 4. Identify Main Story Context
    let matchedEl = null;
    contextElements.forEach(el => {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (focalY >= top && focalY < bottom) {
        matchedEl = el;
      }
    });

    if (!matchedEl && contextElements.length > 0) {
      matchedEl = scrollY < 200 ? contextElements[0] : contextElements[contextElements.length - 1];
    }

    if (matchedEl && matchedEl !== currentActiveContextEl) {
      currentActiveContextEl = matchedEl;

      const chapter = matchedEl.getAttribute('data-context-chapter') || '01 / 09';
      const tag = matchedEl.getAttribute('data-context-tag') || 'STORY';
      const title = matchedEl.getAttribute('data-context-title') || 'NEELAGIRI CHANDRIKA';
      const summary = matchedEl.getAttribute('data-context-summary') || '';
      const tagsStr = matchedEl.getAttribute('data-context-tags') || '';

      if (hudChapterCode) hudChapterCode.textContent = `CHAPTER ${chapter}`;
      if (hudTagPill) hudTagPill.textContent = tag;
      if (hudTitleText) hudTitleText.textContent = title;
      if (hudSummaryText) hudSummaryText.textContent = summary;

      if (hudTagsStream && tagsStr) {
        const chips = tagsStr.split(',').map(s => s.trim()).filter(Boolean);
        hudTagsStream.innerHTML = chips.map(c => `<span class="hud-stream-chip">${c}</span>`).join('');
      }

      const targetId = matchedEl.getAttribute('id');
      if (targetId) {
        hudJumpDots.forEach(dot => {
          if (dot.getAttribute('data-target') === `#${targetId}`) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      document.querySelectorAll('.is-focused').forEach(f => f.classList.remove('is-focused'));
      if (matchedEl.classList.contains('project-editorial-card')) {
        matchedEl.classList.add('is-focused');
      }
    }

    // 5. Journey Nodes Lighting
    journeyNodes.forEach(node => {
      const nodeTop = node.offsetTop;
      const nodeBottom = nodeTop + node.offsetHeight;
      if (focalY >= nodeTop - 40 && focalY <= nodeBottom + 60) {
        node.classList.add('is-focused');
      } else {
        node.classList.remove('is-focused');
      }
    });

    // 6. Navigation Link Highlighting
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollMotionAndContext();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateScrollMotionAndContext();

  hudJumpDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSel = dot.getAttribute('data-target');
      const targetEl = document.querySelector(targetSel);
      if (targetEl) {
        const offsetTop = targetEl.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });


  // --- 4. Interactive Algorithmic Logic Explorer (How I Think) ---
  const explorerTabs = document.querySelectorAll('.explorer-tab');
  const explorerPanes = document.querySelectorAll('.explorer-pane');

  explorerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      explorerTabs.forEach(t => t.classList.remove('active'));
      explorerPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(`pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // Graph Traversal Step Simulator
  const simulatePathBtn = document.getElementById('simulatePathBtn');
  const traceStatus = document.getElementById('traceStatus');
  const nodeA = document.getElementById('nodeA');
  const nodeB = document.getElementById('nodeB');
  const nodeC = document.getElementById('nodeC');
  const nodeD = document.getElementById('nodeD');
  const edgeAD = document.getElementById('edgeAD');
  const edgeDC = document.getElementById('edgeDC');
  const edgeAB = document.getElementById('edgeAB');
  const edgeBC = document.getElementById('edgeBC');

  function setNodeState(node, state) {
    if (!node) return;
    const circle = node.querySelector('circle');
    const label = node.querySelector('.node-label');
    if (!circle) return;

    if (state === 'active') {
      circle.setAttribute('fill', '#B87955');
      circle.setAttribute('stroke', '#2D241F');
      if (label) label.setAttribute('fill', '#FFFFFF');
    } else if (state === 'visited') {
      circle.setAttribute('fill', '#D9E8E6');
      circle.setAttribute('stroke', '#493528');
      if (label) label.setAttribute('fill', '#2D241F');
    } else {
      circle.setAttribute('fill', '#FFFFFF');
      circle.setAttribute('stroke', '#493528');
      if (label) label.setAttribute('fill', '#2D241F');
    }
  }

  if (simulatePathBtn && traceStatus) {
    let isSimulating = false;
    simulatePathBtn.addEventListener('click', () => {
      if (isSimulating) return;
      isSimulating = true;
      simulatePathBtn.disabled = true;
      simulatePathBtn.textContent = 'Tracing Shortest Path...';

      // Reset edges and nodes
      [edgeAB, edgeBC].forEach(e => {
        if (e) {
          e.setAttribute('stroke', '#75685E');
          e.setAttribute('stroke-width', '2');
          e.setAttribute('stroke-dasharray', '4');
        }
      });
      [edgeAD, edgeDC].forEach(e => {
        if (e) {
          e.setAttribute('stroke', '#75685E');
          e.setAttribute('stroke-width', '2');
          e.setAttribute('stroke-dasharray', '4');
        }
      });
      [nodeB, nodeC, nodeD].forEach(n => setNodeState(n, 'default'));

      // Step 1: Start at Hub A
      setNodeState(nodeA, 'active');
      traceStatus.textContent = 'Step 1: Extracted Hub (A) from PriorityQueue (Distance = 0)';

      setTimeout(() => {
        // Step 2: Edge relaxation
        if (edgeAD) {
          edgeAD.setAttribute('stroke', '#B87955');
          edgeAD.setAttribute('stroke-width', '3');
          edgeAD.removeAttribute('stroke-dasharray');
        }
        setNodeState(nodeB, 'visited');
        setNodeState(nodeD, 'active');
        traceStatus.textContent = 'Step 2: Relaxed edge A → D (6km). PriorityQueue selects D (minimal distance).';
      }, 900);

      setTimeout(() => {
        // Step 3: From D to C
        if (edgeDC) {
          edgeDC.setAttribute('stroke', '#B87955');
          edgeDC.setAttribute('stroke-width', '3');
          edgeDC.removeAttribute('stroke-dasharray');
        }
        setNodeState(nodeC, 'active');
        traceStatus.textContent = 'Step 3: Relaxed edge D → C (8km). Reached Destination (Total: 14 mins). Optimal!';
      }, 1900);

      setTimeout(() => {
        simulatePathBtn.disabled = false;
        simulatePathBtn.textContent = '▶ Re-run Shortest-Path Trace';
        isSimulating = false;
      }, 2500);
    });
  }


  // --- 5. Project 01: FleetTrack Interactive Route Optimizer Drawer ---
  const demoFleetTrackBtn = document.getElementById('demoFleetTrackBtn');
  const closeFleetTrackBtn = document.getElementById('closeFleetTrackBtn');
  const fleetTrackDrawer = document.getElementById('fleetTrackDrawer');
  const computeRouteBtn = document.getElementById('computeRouteBtn');
  const routeOrigin = document.getElementById('routeOrigin');
  const routeDest = document.getElementById('routeDest');
  const fleetPathResult = document.getElementById('fleetPathResult');

  if (demoFleetTrackBtn && fleetTrackDrawer) {
    demoFleetTrackBtn.addEventListener('click', () => {
      fleetTrackDrawer.classList.toggle('is-active');
    });
  }
  if (closeFleetTrackBtn && fleetTrackDrawer) {
    closeFleetTrackBtn.addEventListener('click', () => {
      fleetTrackDrawer.classList.remove('is-active');
    });
  }

  // Pre-computed lookup table for demo
  const routeScenarios = {
    'Hub_North-East_Retail': {
      path: 'North Transit Hub → Ring Road Junction 4 → East Bypass → East Retail Distribution',
      km: '18.4 km',
      time: '24 mins'
    },
    'Hub_North-South_Port': {
      path: 'North Transit Hub → Expressway Corridor 2 → South Intermodal Terminal',
      km: '34.2 km',
      time: '38 mins'
    },
    'Hub_North-Metro_Airport': {
      path: 'North Transit Hub → Air Freight Linkway → Metro Airport Logistics',
      km: '14.8 km',
      time: '18 mins'
    },
    'Central_Depot-East_Retail': {
      path: 'Central Cargo Station → Industrial Loop A → East Retail Distribution',
      km: '11.6 km',
      time: '15 mins'
    },
    'Central_Depot-South_Port': {
      path: 'Central Cargo Station → Canal Road Corridor → South Coastal Terminal',
      km: '21.0 km',
      time: '29 mins'
    },
    'Central_Depot-Metro_Airport': {
      path: 'Central Cargo Station → Metro Ring Expressway → Metro Airport Logistics',
      km: '19.5 km',
      time: '26 mins'
    },
    'West_Terminal-East_Retail': {
      path: 'West Delivery Depot → Cross-City Flyover → East Bypass → East Retail Distribution',
      km: '28.3 km',
      time: '36 mins'
    },
    'West_Terminal-South_Port': {
      path: 'West Delivery Depot → Outer Ring Junction 7 → South Coastal Terminal',
      km: '31.5 km',
      time: '39 mins'
    },
    'West_Terminal-Metro_Airport': {
      path: 'West Delivery Depot → Airport Expressway Access → Metro Airport Logistics',
      km: '22.1 km',
      time: '28 mins'
    }
  };

  if (computeRouteBtn && routeOrigin && routeDest && fleetPathResult) {
    computeRouteBtn.addEventListener('click', () => {
      const key = `${routeOrigin.value}-${routeDest.value}`;
      const data = routeScenarios[key] || {
        path: `${routeOrigin.options[routeOrigin.selectedIndex].text} → Direct Highway Link → ${routeDest.options[routeDest.selectedIndex].text}`,
        km: '21.4 km',
        time: '27 mins'
      };

      fleetPathResult.textContent = data.path;

      const outStats = document.querySelector('#fleetRouteOutput .out-stats');
      if (outStats) {
        outStats.innerHTML = `
          <span class="badge-stat">Total Distance: <strong>${data.km}</strong></span>
          <span class="badge-stat">Estimated Time: <strong>${data.time}</strong></span>
          <span class="badge-stat">Algorithm: <strong>Dijkstra (O((V+E) log V))</strong></span>
        `;
      }
    });
  }


  // --- 6. Project 02: RiskShield-X Live Risk Scoring Simulator ---
  const demoRiskShieldBtn = document.getElementById('demoRiskShieldBtn');
  const closeRiskShieldBtn = document.getElementById('closeRiskShieldBtn');
  const riskShieldDrawer = document.getElementById('riskShieldDrawer');

  const transAmount = document.getElementById('transAmount');
  const transAmountVal = document.getElementById('transAmountVal');
  const timeSinceLast = document.getElementById('timeSinceLast');
  const timeSinceLastVal = document.getElementById('timeSinceLastVal');
  const geoMismatch = document.getElementById('geoMismatch');
  const geoMismatchVal = document.getElementById('geoMismatchVal');

  const riskMeterFill = document.getElementById('riskMeterFill');
  const riskProbText = document.getElementById('riskProbText');
  const verdictBadge = document.getElementById('verdictBadge');

  if (demoRiskShieldBtn && riskShieldDrawer) {
    demoRiskShieldBtn.addEventListener('click', () => {
      riskShieldDrawer.classList.toggle('is-active');
    });
  }
  if (closeRiskShieldBtn && riskShieldDrawer) {
    closeRiskShieldBtn.addEventListener('click', () => {
      riskShieldDrawer.classList.remove('is-active');
    });
  }

  function recalculateFraudRisk() {
    if (!transAmount || !timeSinceLast || !geoMismatch) return;

    const amt = parseFloat(transAmount.value);
    const timeGap = parseFloat(timeSinceLast.value); // minutes
    const geo = parseFloat(geoMismatch.value); // km

    transAmountVal.textContent = `$${amt}`;
    timeSinceLastVal.textContent = `${timeGap} mins`;
    geoMismatchVal.textContent = `${geo} km`;

    // Mathematical heuristic model simulating anomaly & classification probabilities:
    // High amount, very short time gap, and large geo delta increase fraud risk
    let score = 5.0; // base risk
    
    // Amount factor
    if (amt > 1500) score += (amt - 1500) / 100 * 1.5;
    else if (amt > 500) score += (amt - 500) / 100 * 0.8;

    // Time velocity factor (e.g. $4000 spent 3 mins later is suspicious)
    if (timeGap < 5) score += 32;
    else if (timeGap < 15) score += 18;
    else if (timeGap < 30) score += 8;

    // Geo velocity mismatch (e.g. 500km apart within 30 minutes implies impossibly fast physical transit)
    const kmPerHour = (geo / (timeGap / 60));
    if (kmPerHour > 900) score += 40; // impossible speed (faster than plane takeoff)
    else if (kmPerHour > 250) score += 25; // suspicious speed
    else if (geo > 300) score += 12;

    // Normalize between 2% and 98%
    score = Math.min(Math.max(score, 2.4), 98.6);
    const scoreFormatted = score.toFixed(1);

    if (riskProbText) riskProbText.textContent = `${scoreFormatted}%`;
    if (riskMeterFill) riskMeterFill.style.width = `${scoreFormatted}%`;

    if (verdictBadge) {
      if (score < 30) {
        verdictBadge.className = 'verdict-badge low';
        verdictBadge.textContent = 'LOW RISK · APPROVED';
        if (riskMeterFill) riskMeterFill.style.backgroundColor = 'var(--color-mocha)';
      } else if (score < 65) {
        verdictBadge.className = 'verdict-badge med';
        verdictBadge.textContent = 'MODERATE · STEP-UP 2FA REQUIRED';
        if (riskMeterFill) riskMeterFill.style.backgroundColor = 'var(--color-terracotta)';
      } else {
        verdictBadge.className = 'verdict-badge high';
        verdictBadge.textContent = 'CRITICAL RISK · BLOCKED BY FASTAPI';
        if (riskMeterFill) riskMeterFill.style.backgroundColor = '#B87955';
      }
    }
  }

  [transAmount, timeSinceLast, geoMismatch].forEach(el => {
    if (el) {
      el.addEventListener('input', recalculateFraudRisk);
    }
  });


  // --- 7. Project 03: Diabetes Indicators Drawer ---
  const demoDiabetesBtn = document.getElementById('demoDiabetesBtn');
  const closeDiabetesBtn = document.getElementById('closeDiabetesBtn');
  const diabetesDrawer = document.getElementById('diabetesDrawer');

  if (demoDiabetesBtn && diabetesDrawer) {
    demoDiabetesBtn.addEventListener('click', () => {
      diabetesDrawer.classList.toggle('is-active');
    });
  }
  if (closeDiabetesBtn && diabetesDrawer) {
    closeDiabetesBtn.addEventListener('click', () => {
      diabetesDrawer.classList.remove('is-active');
    });
  }


  // --- 8. Certificate Modal Lightbox ---
  const certFrameCard = document.getElementById('certFrameCard');
  const openCertModalBtn = document.getElementById('openCertModalBtn');
  const certModal = document.getElementById('certModal');
  const closeCertModalBtn = document.getElementById('closeCertModalBtn');

  function openCertModal() {
    if (certModal) {
      certModal.classList.add('is-open');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('is-open');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (certFrameCard) certFrameCard.addEventListener('click', openCertModal);
  if (openCertModalBtn) openCertModalBtn.addEventListener('click', openCertModal);
  if (closeCertModalBtn) closeCertModalBtn.addEventListener('click', closeCertModal);

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-open')) {
      closeCertModal();
    }
  });


  // --- 9. Copy Email & Toast Notification ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastMessage = document.getElementById('toastMessage');

  if (copyEmailBtn && toastMessage) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'chandrika.neelagiri@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        toastMessage.textContent = 'Email copied: chandrika.neelagiri@gmail.com';
        toastMessage.classList.add('is-visible');
        setTimeout(() => {
          toastMessage.classList.remove('is-visible');
        }, 2800);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toastMessage.textContent = 'Email copied to clipboard!';
        toastMessage.classList.add('is-visible');
        setTimeout(() => {
          toastMessage.classList.remove('is-visible');
        }, 2800);
      });
    });
  }


  // --- 10. Subtle Parallax / Portrait Tilt ---
  const heroCard = document.getElementById('heroPortraitCard');
  if (heroCard && window.innerWidth > 992) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      heroCard.style.transform = `perspective(1000px) rotateY(${x * 0.015}deg) rotateX(${-y * 0.015}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

});
