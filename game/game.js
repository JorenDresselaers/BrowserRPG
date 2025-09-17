(() => {
  const dataFiles = {
    classes: './data/classes.json',
    enemies: './data/enemies.json',
    zones: './data/zones.json',
    dungeons: './data/dungeons.json',
    npcs: './data/npcs.json',
    items: './data/items.json',
    professions: './data/professions.json',
    quests: './data/quests.json'
  };

  const data = {};
  const dataIndex = {};

  const STORAGE_KEY = 'ember-sigil-save';
  const SAVE_DEBOUNCE_MS = 250;
  let saveTimer = null;
  const storageSupported = isLocalStorageSupported();

  const state = {
    player: null,
    currentScreen: 'exploration',
    selected: {
      dungeonId: null,
      enemyId: null,
      npcId: null,
      merchantId: null,
      professionId: null,
      recipeId: null
    },
    combat: createDefaultCombatState(),
    travel: {
      destinationZoneId: null
    },
    logs: []
  };

  const elements = {
    loading: document.getElementById('loading'),
    app: document.getElementById('app'),
    newGameModal: document.getElementById('newGameModal'),
    newGameForm: document.getElementById('newGameForm'),
    playerNameInput: document.getElementById('playerNameInput'),
    classSelect: document.getElementById('classSelect'),
    classDetails: document.getElementById('classDetails'),
    inventoryToggle: document.getElementById('inventoryToggle'),
    questLogToggle: document.getElementById('questLogToggle'),
    restButton: document.getElementById('restButton'),
    playerName: document.getElementById('playerName'),
    playerClass: document.getElementById('playerClass'),
    playerLevel: document.getElementById('playerLevel'),
    playerXp: document.getElementById('playerXp'),
    playerGold: document.getElementById('playerGold'),
    healthBar: document.getElementById('healthBar'),
    healthValue: document.getElementById('healthValue'),
    manaBar: document.getElementById('manaBar'),
    manaValue: document.getElementById('manaValue'),
    playerStats: document.getElementById('playerStats'),
    playerAbilities: document.getElementById('playerAbilities'),
    playerProfessions: document.getElementById('playerProfessions'),
    playerEquipment: document.getElementById('playerEquipment'),
    activityTabs: document.getElementById('activityTabs'),
    screens: Array.from(document.querySelectorAll('.screen')),
    logEntries: document.getElementById('logEntries'),
    inventoryPanel: document.getElementById('inventoryPanel'),
    inventoryList: document.getElementById('inventoryList'),
    questLogPanel: document.getElementById('questLogPanel'),
    questLogContent: document.getElementById('questLogContent'),
    travelCurrentZone: document.getElementById('travelCurrentZone'),
    travelDestinationSelect: document.getElementById('travelDestinationSelect'),
    travelDestinationDescription: document.getElementById('travelDestinationDescription'),
    travelDestinationMeta: document.getElementById('travelDestinationMeta'),
    travelDestinationHighlights: document.getElementById('travelDestinationHighlights'),
    travelDestinationThreats: document.getElementById('travelDestinationThreats'),
    beginTravelButton: document.getElementById('beginTravelButton'),
    explorationCurrentZone: document.getElementById('explorationCurrentZone'),
    explorationZoneDescription: document.getElementById('explorationZoneDescription'),
    explorationZoneDetails: document.getElementById('explorationZoneDetails'),
    explorationNPCs: document.getElementById('explorationNPCs'),
    explorationResources: document.getElementById('explorationResources'),
    explorationPoints: document.getElementById('explorationPoints'),
    exploreZoneButton: document.getElementById('exploreZoneButton'),
    scoutZoneButton: document.getElementById('scoutZoneButton'),
    dungeonSelect: document.getElementById('dungeonSelect'),
    dungeonDescription: document.getElementById('dungeonDescription'),
    dungeonObjectives: document.getElementById('dungeonObjectives'),
    dungeonEncounters: document.getElementById('dungeonEncounters'),
    dungeonEffects: document.getElementById('dungeonEffects'),
    dungeonRewards: document.getElementById('dungeonRewards'),
    startDungeonButton: document.getElementById('startDungeonButton'),
    combatCurrentZone: document.getElementById('combatCurrentZone'),
    combatEnemySelect: document.getElementById('combatEnemySelect'),
    engageCombatButton: document.getElementById('engageCombatButton'),
    autoSelectEnemy: document.getElementById('autoSelectEnemy'),
    enemyDetails: document.getElementById('enemyDetails'),
    combatActions: document.getElementById('combatActions'),
    combatStrikeButton: document.getElementById('combatStrikeButton'),
    combatAbilityButton: document.getElementById('combatAbilityButton'),
    combatGuardButton: document.getElementById('combatGuardButton'),
    combatFleeButton: document.getElementById('combatFleeButton'),
    combatStatus: document.getElementById('combatStatus'),
    combatLog: document.getElementById('combatLog'),
    npcCurrentZone: document.getElementById('npcCurrentZone'),
    npcSelect: document.getElementById('npcSelect'),
    npcDetails: document.getElementById('npcDetails'),
    talkToNpcButton: document.getElementById('talkToNpcButton'),
    requestQuestButton: document.getElementById('requestQuestButton'),
    tradingCurrentZone: document.getElementById('tradingCurrentZone'),
    merchantSelect: document.getElementById('merchantSelect'),
    merchantInfo: document.getElementById('merchantInfo'),
    merchantInventory: document.getElementById('merchantInventory'),
    sellInventory: document.getElementById('sellInventory'),
    refreshMerchantButton: document.getElementById('refreshMerchantButton'),
    professionSelect: document.getElementById('professionSelect'),
    professionDescription: document.getElementById('professionDescription'),
    professionGatherables: document.getElementById('professionGatherables'),
    professionRecipes: document.getElementById('professionRecipes'),
    gatherButton: document.getElementById('gatherButton'),
    craftButton: document.getElementById('craftButton'),
    recipeSelect: document.getElementById('recipeSelect'),
    inventoryItemTemplate: document.getElementById('inventoryItemTemplate'),
    recipeTemplate: document.getElementById('recipeTemplate')
  };

  const overlayToggleButtons = Array.from(document.querySelectorAll('.close-button'));

  const logTypes = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
  };

  const screenRenderers = {
    travel: renderTravelScreen,
    exploration: renderExplorationScreen,
    dungeons: renderDungeonScreen,
    combat: renderCombatScreen,
    npcs: renderNpcScreen,
    trading: renderTradingScreen,
    professions: renderProfessionScreen
  };

  loadWorldData();

  function loadWorldData() {
    Promise.all(
      Object.entries(dataFiles).map(([key, path]) =>
        fetch(path)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
          })
          .then((json) => [key, json])
      )
    )
      .then((entries) => {
        entries.forEach(([key, value]) => {
          data[key] = value;
        });
        indexData();
        initialiseUI();
      })
      .catch((error) => {
        console.error(error);
        elements.loading.textContent = `Failed to load world data: ${error.message}`;
      });
  }

  function indexData() {
    dataIndex.classes = indexById(data.classes);
    dataIndex.enemies = indexById(data.enemies);
    dataIndex.zones = indexById(data.zones);
    dataIndex.dungeons = indexById(data.dungeons);
    dataIndex.npcs = indexById(data.npcs);
    dataIndex.items = indexById(data.items);
    dataIndex.professions = indexById(data.professions);
    dataIndex.quests = indexById(data.quests);
  }

  function indexById(collection) {
    return collection.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }

  function initialiseUI() {
    elements.loading.classList.add('hidden');
    elements.app.classList.remove('hidden');
    setupNewGameForm();
    setupNavigation();
    setupOverlays();
    setupTravelControls();
    setupExplorationControls();
    setupDungeonControls();
    setupCombatControls();
    setupNpcControls();
    setupTradingControls();
    setupProfessionControls();
    elements.restButton.addEventListener('click', restAtCamp);
    const restored = restoreSavedGame();
    if (!restored) {
      elements.newGameModal.classList.remove('hidden');
      addLog('World data loaded. Create your hero to begin.', logTypes.INFO);
    } else {
      addLog(`Welcome back, ${state.player.name}!`, logTypes.SUCCESS);
    }
  }

  function setupNewGameForm() {
    const classOptions = data.classes
      .map((cls) => `<option value=\"${cls.id}\">${cls.name}</option>`)
      .join('');
    elements.classSelect.innerHTML = `<option value=\"\" disabled selected>Select a class</option>${classOptions}`;
    elements.classDetails.innerHTML = '<p class="class-placeholder">Select a class to preview their role, strengths, and starting kit.</p>';
    elements.classSelect.addEventListener('change', () => {
      renderClassDetails(elements.classSelect.value);
    });
    elements.newGameForm.addEventListener('submit', (event) => {
      event.preventDefault();
      startGame();
    });
  }
  function renderClassDetails(classId) {
    const classData = dataIndex.classes[classId];
    if (!classData) {
      elements.classDetails.innerHTML = '<p class="class-placeholder">Select a class to preview their role, strengths, and starting kit.</p>';
      return;
    }
    const startingItems = [...(classData.startingItems || []), classData.startingArmor]
      .filter(Boolean)
      .map((itemId) => dataIndex.items[itemId]?.name || itemId);
    const statsList = Object.entries(classData.stats || {})
      .map(
        ([stat, value]) => `
          <li>
            <span class=\"stat-name\">${toTitle(stat)}</span>
            <span class=\"stat-value\">${value}</span>
          </li>
        `
      )
      .join('');
    const abilitiesList = (classData.abilities || [])
      .map((ability) => `<li>${ability}</li>`)
      .join('');
    const kitList = startingItems.length
      ? startingItems.map((item) => `<li>${item}</li>`).join('')
      : '<li class="empty">None</li>';
    const professions = (classData.startingProfessions || [])
      .map((id) => dataIndex.professions?.[id]?.name || toTitle(id));
    const quests = (classData.startingQuests || [])
      .map((id) => dataIndex.quests?.[id]?.name || toTitle(id));
    elements.classDetails.innerHTML = `
      <div class=\"class-details__content\">
        <header class=\"class-details__header\">
          <h3 class=\"class-details__title\">${classData.name}</h3>
          <span class=\"class-details__role\">${classData.role || 'Adventurer'}</span>
        </header>
        <p class=\"class-description\">${classData.description}</p>
        <div class=\"class-sections-grid\">
          <section class=\"class-section\">
            <h4>Attributes</h4>
            <ul class=\"class-stat-grid\">${statsList || '<li class="empty">No attributes listed</li>'}</ul>
          </section>
          <section class=\"class-section\">
            <h4>Signature Abilities</h4>
            <ul class=\"class-list\">${abilitiesList || '<li class="empty">No signature abilities listed</li>'}</ul>
          </section>
        </div>
        <section class=\"class-section\">
          <h4>Starting Kit</h4>
          <ul class=\"class-kit\">${kitList}</ul>
          <div class=\"class-meta\">
            <div class=\"class-meta-item\">
              <span class=\"class-meta-label\">Starting Gold</span>
              <span class=\"class-meta-value\">${classData.startingGold ?? 0}</span>
            </div>
            <div class=\"class-meta-item\">
              <span class=\"class-meta-label\">Professions</span>
              <span class=\"class-meta-value\">${professions.length ? professions.join(', ') : 'None'}</span>
            </div>
            <div class=\"class-meta-item\">
              <span class=\"class-meta-label\">Quests</span>
              <span class=\"class-meta-value\">${quests.length ? quests.join(', ') : 'None'}</span>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function startGame() {
    const name = elements.playerNameInput.value.trim();
    const classId = elements.classSelect.value;
    if (!name) {
      addLog('Choose a name for your hero before you begin.', logTypes.WARNING);
      elements.playerNameInput.focus();
      return;
    }
    if (!classId) {
      addLog('Select a class to determine your hero\'s path.', logTypes.WARNING);
      elements.classSelect.focus();
      return;
    }
    state.player = createPlayer(name, classId);
    setTrackedState(state.travel, 'destinationZoneId', state.player.location.zoneId);
    elements.newGameModal.classList.add('hidden');
    addLog(`Welcome, ${state.player.name} the ${getClass(classId).name}!`, logTypes.SUCCESS);
    updateAllUI();
    showScreen('exploration');
    saveGame();
  }

  function createPlayer(name, classId) {
    const classData = getClass(classId);
    const player = {
      name,
      classId,
      level: 1,
      xp: 0,
      xpToLevel: 120,
      gold: classData.startingGold ?? 20,
      stats: { ...classData.stats },
      growth: { ...classData.statGrowth },
      abilities: [...(classData.abilities || [])],
      inventory: {},
      equipment: {
        weapon: null,
        offHand: null,
        armor: null,
        trinket: null
      },
      resources: {
        health: classData.stats.health,
        mana: classData.stats.mana
      },
      location: {
        zoneId: data.zones[0]?.id || null
      },
      professions: [...(classData.startingProfessions || [])],
      quests: {
        active: [],
        completed: []
      }
    };
    if (classData.startingArmor) {
      grantItem(player, classData.startingArmor, 1, { autoEquip: true });
    }
    (classData.startingItems || []).forEach((itemId) => {
      grantItem(player, itemId, 1, { autoEquip: true });
    });
    (classData.startingQuests || []).forEach((questId) => {
      addQuestToPlayer(player, questId);
    });
    syncResourceCaps(player);
    return player;
  }

  function setupNavigation() {
    elements.activityTabs.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-screen]');
      if (!button || button.disabled) return;
      showScreen(button.dataset.screen);
    });
    updateNavigationLocks();
  }

  function updateNavigationLocks() {
    const inCombat = state.combat.active;
    elements.activityTabs
      .querySelectorAll('button[data-screen]')
      .forEach((button) => {
        const locked = inCombat && button.dataset.screen !== 'combat';
        button.disabled = locked;
        button.classList.toggle('locked', locked);
      });
  }

  function setupOverlays() {
    elements.inventoryToggle.addEventListener('click', () => toggleOverlay(elements.inventoryPanel, true));
    elements.questLogToggle.addEventListener('click', () => toggleOverlay(elements.questLogPanel, true));
    overlayToggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.close;
        const panel = targetId ? document.getElementById(targetId) : button.closest('.overlay-panel');
        toggleOverlay(panel, false);
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        [elements.inventoryPanel, elements.questLogPanel].forEach((panel) => toggleOverlay(panel, false));
      }
    });
    elements.inventoryList.addEventListener('click', (event) => {
      const useButton = event.target.closest('[data-use-item]');
      if (!useButton || !state.player) return;
      useItem(useButton.dataset.useItem);
    });
    elements.merchantInventory.addEventListener('click', (event) => {
      const buyButton = event.target.closest('[data-buy-item]');
      if (!buyButton || !state.player) return;
      handlePurchase(buyButton.dataset.buyItem);
    });
    elements.sellInventory.addEventListener('click', (event) => {
      const sellButton = event.target.closest('[data-sell-item]');
      if (!sellButton || !state.player) return;
      handleSale(sellButton.dataset.sellItem);
    });
    elements.professionRecipes.addEventListener('click', (event) => {
      const craftButton = event.target.closest('[data-craft-item]');
      if (!craftButton || !state.player) return;
      craftRecipe(craftButton.dataset.craftItem);
    });
  }

  function setupTravelControls() {
    elements.travelDestinationSelect?.addEventListener('change', () => {
      setTrackedState(state.travel, 'destinationZoneId', elements.travelDestinationSelect.value);
      renderTravelDestination(state.travel.destinationZoneId);
    });
    elements.beginTravelButton?.addEventListener('click', () => {
      performTravel();
    });
  }

  function setupExplorationControls() {
    elements.exploreZoneButton.addEventListener('click', exploreZone);
    elements.scoutZoneButton.addEventListener('click', scoutZone);
  }

  function setupDungeonControls() {
    elements.dungeonSelect.addEventListener('change', () => {
      setTrackedState(state.selected, 'dungeonId', elements.dungeonSelect.value);
      renderDungeonScreen();
    });
    elements.startDungeonButton.addEventListener('click', startDungeonRun);
  }

  function setupCombatControls() {
    elements.combatEnemySelect.addEventListener('change', () => {
      setTrackedState(state.selected, 'enemyId', elements.combatEnemySelect.value);
      renderEnemyDetails(state.selected.enemyId);
    });
    elements.engageCombatButton.addEventListener('click', () => {
      if (!state.selected.enemyId) {
        addLog('Select an enemy to engage in combat.', logTypes.WARNING);
        return;
      }
      if (!ensureCanAct('start another combat')) return;
      enterCombat(state.selected.enemyId);
    });
    elements.autoSelectEnemy.addEventListener('click', () => {
      if (!ensureCanAct('seek a new foe')) return;
      const zone = getCurrentZone();
      if (!zone) return;
      const randomEnemy = sample(zone.enemyIds);
      if (!randomEnemy) {
        addLog('This region has no known enemies to fight.', logTypes.WARNING);
        return;
      }
      setTrackedState(state.selected, 'enemyId', randomEnemy);
      elements.combatEnemySelect.value = randomEnemy;
      renderEnemyDetails(randomEnemy);
      addLog(`A roaming ${getEnemy(randomEnemy).name} crosses your path.`, logTypes.INFO);
    });
    elements.combatStrikeButton?.addEventListener('click', () => takeCombatAction('strike'));
    elements.combatAbilityButton?.addEventListener('click', () => takeCombatAction('ability'));
    elements.combatGuardButton?.addEventListener('click', () => takeCombatAction('guard'));
    elements.combatFleeButton?.addEventListener('click', () => takeCombatAction('flee'));
  }

  function setupNpcControls() {
    elements.npcSelect.addEventListener('change', () => {
      setTrackedState(state.selected, 'npcId', elements.npcSelect.value);
      renderNpcDetails(state.selected.npcId);
    });
    elements.talkToNpcButton.addEventListener('click', talkToNpc);
    elements.requestQuestButton.addEventListener('click', requestQuestFromNpc);
  }

  function setupTradingControls() {
    elements.merchantSelect.addEventListener('change', () => {
      if (!ensureCanAct('trade during combat')) {
        elements.merchantSelect.value = state.selected.merchantId || '';
        return;
      }
      setTrackedState(state.selected, 'merchantId', elements.merchantSelect.value);
      renderTradingScreen();
    });
    elements.refreshMerchantButton.addEventListener('click', () => {
      if (!ensureCanAct('negotiate with merchants')) return;
      if (!state.selected.merchantId) return;
      addLog('The merchant refreshes their stock with new wares.', logTypes.INFO);
      renderTradingScreen(true);
    });
  }

  function setupProfessionControls() {
    elements.professionSelect.addEventListener('change', () => {
      setTrackedState(state.selected, 'professionId', elements.professionSelect.value);
      setTrackedState(state.selected, 'recipeId', null);
      renderProfessionScreen();
    });
    elements.recipeSelect.addEventListener('change', () => {
      setTrackedState(state.selected, 'recipeId', elements.recipeSelect.value);
    });
    elements.gatherButton.addEventListener('click', gatherResources);
    elements.craftButton.addEventListener('click', () => {
      if (!state.selected.recipeId) {
        addLog('Select a recipe before attempting to craft.', logTypes.WARNING);
        return;
      }
      craftRecipe(state.selected.recipeId);
    });
  }
  function toggleOverlay(panel, open) {
    if (!panel) return;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function showScreen(screenId) {
    if (state.combat.active && screenId !== 'combat') {
      addLog('You are locked in combat and cannot switch activities.', logTypes.WARNING);
      return;
    }
    if (!screenRenderers[screenId]) return;
    state.currentScreen = screenId;
    elements.activityTabs.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button.dataset.screen === screenId);
    });
    elements.screens.forEach((screen) => {
      screen.classList.toggle('active', screen.id === `screen-${screenId}`);
    });
    screenRenderers[screenId]();
    updateNavigationLocks();
  }

  function updateAllUI() {
    if (!state.player) return;
    syncResourceCaps(state.player);
    updatePlayerPanel();
    renderTravelScreen();
    renderExplorationScreen();
    renderDungeonScreen();
    renderCombatScreen();
    renderNpcScreen();
    renderTradingScreen();
    renderProfessionScreen();
    updateQuestLogView();
    renderInventory();
    renderLog();
    scheduleSave();
  }

  function syncResourceCaps(player) {
    const maxHealth = getTotalStat(player, 'health');
    const maxMana = getTotalStat(player, 'mana');
    player.resources.health = clamp(player.resources.health ?? maxHealth, 0, maxHealth);
    player.resources.mana = clamp(player.resources.mana ?? maxMana, 0, maxMana);
  }

  function updatePlayerPanel() {
    const player = state.player;
    const playerClass = getClass(player.classId);
    const maxHealth = getTotalStat(player, 'health');
    const maxMana = getTotalStat(player, 'mana');
    elements.playerName.textContent = player.name;
    elements.playerClass.textContent = playerClass?.name || '-';
    elements.playerLevel.textContent = player.level;
    elements.playerXp.textContent = `${player.xp} / ${player.xpToLevel}`;
    elements.playerGold.textContent = `${player.gold}`;
    updateResourceBar(elements.healthBar, elements.healthValue, player.resources.health, maxHealth);
    updateResourceBar(elements.manaBar, elements.manaValue, player.resources.mana, maxMana);
    renderPlayerStats();
    renderPlayerAbilities();
    renderPlayerProfessions();
    renderPlayerEquipment();
  }

  function updateResourceBar(bar, label, current, max) {
    if (!bar || !label) return;
    const safeMax = max || 1;
    const percent = clamp(current / safeMax, 0, 1) * 100;
    bar.style.width = `${percent}%`;
    label.textContent = `${Math.round(current)} / ${Math.round(safeMax)}`;
  }

  function renderPlayerStats() {
    const player = state.player;
    const stats = ['health', 'mana', 'strength', 'agility', 'intellect', 'armor', 'speed'];
    elements.playerStats.innerHTML = stats
      .map((stat) => {
        const base = Math.round(player.stats[stat] || 0);
        const total = Math.round(getTotalStat(player, stat));
        const diff = total - base;
        const bonus = diff !== 0 ? ` (<span class=\"bonus\">${diff > 0 ? '+' : ''}${diff}</span>)` : '';
        return `<li>${toTitle(stat)}: ${total}${bonus}</li>`;
      })
      .join('');
  }

  function renderPlayerAbilities() {
    elements.playerAbilities.innerHTML = (state.player.abilities || [])
      .map((ability) => `<li>${ability}</li>`)
      .join('') || '<li>No abilities learned yet.</li>';
  }

  function renderPlayerProfessions() {
    const professions = state.player.professions || [];
    elements.playerProfessions.innerHTML = professions
      .map((id) => {
        const profession = getProfession(id);
        if (!profession) return '';
        const role = profession.type === 'gathering' ? 'Gathering' : 'Crafting';
        return `<li>${profession.name} <span>(${role})</span></li>`;
      })
      .join('') || '<li>No professions trained.</li>';
  }

  function renderPlayerEquipment() {
    const equipmentSlots = [
      ['weapon', 'Weapon'],
      ['offHand', 'Off-hand'],
      ['armor', 'Armor'],
      ['trinket', 'Trinket']
    ];
    elements.playerEquipment.innerHTML = equipmentSlots
      .map(([slot, label]) => {
        const itemId = state.player.equipment[slot];
        const item = getItem(itemId);
        return `<li><span>${label}:</span> ${item ? item.name : 'None'}</li>`;
      })
      .join('');
  }

  function renderTravelScreen() {
    populateTravelDestinations();
    const currentZone = getCurrentZone();
    if (elements.travelCurrentZone) {
      elements.travelCurrentZone.textContent = currentZone?.name || 'Uncharted Wilds';
    }
    if (!state.travel.destinationZoneId || !getZone(state.travel.destinationZoneId)) {
      setTrackedState(state.travel, 'destinationZoneId', currentZone?.id || data.zones[0]?.id || null);
    }
    if (elements.travelDestinationSelect && state.travel.destinationZoneId) {
      elements.travelDestinationSelect.value = state.travel.destinationZoneId;
    }
    renderTravelDestination(state.travel.destinationZoneId);
    if (elements.beginTravelButton) {
      elements.beginTravelButton.disabled = state.combat.active;
    }
  }

  function populateTravelDestinations() {
    if (!elements.travelDestinationSelect || !data.zones.length) return;
    const options = data.zones.map((zone) => `<option value=\"${zone.id}\">${zone.name}</option>`).join('');
    elements.travelDestinationSelect.innerHTML = options;
  }

  function renderTravelDestination(zoneId) {
    if (!elements.travelDestinationDescription) return;
    const destination = getZone(zoneId);
    if (!destination) {
      elements.travelDestinationDescription.textContent = 'Select a destination to review travel notes.';
      if (elements.travelDestinationMeta) {
        elements.travelDestinationMeta.innerHTML = '';
      }
      if (elements.travelDestinationHighlights) {
        elements.travelDestinationHighlights.innerHTML = '';
      }
      if (elements.travelDestinationThreats) {
        elements.travelDestinationThreats.innerHTML = '';
      }
      return;
    }
    if (elements.travelDestinationSelect) {
      elements.travelDestinationSelect.value = destination.id;
    }
    elements.travelDestinationDescription.textContent = destination.description;
    const [minLevel, maxLevel] = destination.levelRange || ['?', '?'];
    if (elements.travelDestinationMeta) {
      elements.travelDestinationMeta.innerHTML = `
        <li>Climate: ${destination.climate || 'Unknown'}</li>
        <li>Level Range: ${minLevel} - ${maxLevel}</li>
      `;
    }
    if (elements.travelDestinationHighlights) {
      elements.travelDestinationHighlights.innerHTML = (destination.pointsOfInterest || [])
        .map((poi) => `<li>${poi}</li>`)
        .join('') || '<li>No notable landmarks recorded.</li>';
    }
    if (elements.travelDestinationThreats) {
      elements.travelDestinationThreats.innerHTML = (destination.enemyIds || [])
        .map((enemyId) => `<li>${getEnemy(enemyId)?.name || enemyId}</li>`)
        .join('') || '<li>No known threats.</li>';
    }
  }

  function performTravel() {
    if (!state.player) return;
    if (!ensureCanAct('travel')) return;
    const destinationId = elements.travelDestinationSelect?.value || state.travel.destinationZoneId;
    const destination = getZone(destinationId);
    if (!destination) {
      addLog('Select a valid destination before travelling.', logTypes.WARNING);
      return;
    }
    const currentZone = getCurrentZone();
    if (currentZone?.id === destination.id) {
      addLog('You are already stationed in that zone.', logTypes.INFO);
      return;
    }
    state.player.location.zoneId = destination.id;
    setTrackedState(state.travel, 'destinationZoneId', destination.id);
    setTrackedState(state.selected, 'enemyId', null);
    addLog(`You travel to ${destination.name}.`, logTypes.SUCCESS);
    updateAllUI();
  }

  function renderExplorationScreen() {
    const zone = getCurrentZone();
    if (!zone) return;
    elements.explorationCurrentZone.textContent = zone.name;
    elements.explorationZoneDescription.textContent = zone.description;
    elements.explorationZoneDetails.innerHTML = `
      <li>Climate: ${zone.climate}</li>
      <li>Level Range: ${zone.levelRange[0]} - ${zone.levelRange[1]}</li>
    `;
    elements.explorationPoints.innerHTML = (zone.pointsOfInterest || [])
      .map((poi) => `<p>${poi}</p>`)
      .join('') || '<p>No notable landmarks recorded.</p>';
    elements.explorationNPCs.innerHTML = (zone.npcIds || [])
      .map((npcId) => `<li>${getNpc(npcId)?.name || npcId}</li>`)
      .join('') || '<li>No allies reported.</li>';
    elements.explorationResources.innerHTML = (zone.gatherables || [])
      .map((itemId) => `<li>${getItem(itemId)?.name || itemId}</li>`)
      .join('') || '<li>No gatherable resources.</li>';
  }

  function exploreZone() {
    if (!state.player) return;
    if (!ensureCanAct('explore new areas')) return;
    const zone = getCurrentZone();
    if (!zone) return;
    if (state.player.resources.health <= 0) {
      addLog('You are too wounded to explore. Rest first.', logTypes.WARNING);
      return;
    }
    const roll = Math.random();
    if (roll < 0.45 && zone.enemyIds?.length) {
      const enemyId = sample(zone.enemyIds);
      addLog(`You encounter a ${getEnemy(enemyId).name}!`, logTypes.WARNING);
      enterCombat(enemyId, { zoneId: zone.id });
    } else if (roll < 0.7 && zone.gatherables?.length) {
      const gatheredItem = sample(zone.gatherables);
      const amount = Math.random() < 0.3 ? 2 : 1;
      grantItem(state.player, gatheredItem, amount);
      addLog(`You gather ${amount} ${getItem(gatheredItem).name}.`, logTypes.SUCCESS);
      renderInventory();
      updateQuestProgress('collect', gatheredItem, amount);
    } else if (roll < 0.85 && zone.npcIds?.length) {
      const npcId = sample(zone.npcIds);
      addLog(`You come across ${getNpc(npcId).name}.`, logTypes.INFO);
      setTrackedState(state.selected, 'npcId', npcId);
      showScreen('npcs');
    } else {
      addLog('You discover ancient carvings detailing forgotten lore.', logTypes.INFO);
    }
  }

  function scoutZone() {
    if (!ensureCanAct('scout while in battle')) return;
    const zone = getCurrentZone();
    if (!zone) return;
    const enemies = (zone.enemyIds || []).map((id) => getEnemy(id)?.name || id).join(', ');
    const dungeonNames = (zone.dungeonIds || []).map((id) => getDungeon(id)?.name || id).join(', ');
    addLog(
      `Scouting report for ${zone.name}: Enemies [${enemies || 'Unknown'}], Dungeons [${dungeonNames || 'None'}].`,
      logTypes.INFO
    );
  }

  function renderDungeonScreen() {
    const dungeons = populateDungeonSelect();
    const dungeon = dungeons.find((entry) => entry.id === state.selected.dungeonId);
    if (!dungeon) {
      elements.dungeonDescription.textContent = 'No dungeons have been mapped in this region.';
      elements.dungeonObjectives.innerHTML = '';
      elements.dungeonEncounters.innerHTML = '';
      elements.dungeonEffects.innerHTML = '';
      elements.dungeonRewards.innerHTML = '';
      return;
    }
    elements.dungeonDescription.textContent = dungeon.description;
    elements.dungeonObjectives.innerHTML = (dungeon.objectives || [])
      .map((objective) => `<li>${objective}</li>`)
      .join('') || '<li>No recorded objectives.</li>';
    elements.dungeonEncounters.innerHTML = (dungeon.encounterIds || [])
      .map((enemyId) => `<li>${getEnemy(enemyId)?.name || enemyId}</li>`)
      .join('') || '<li>No scouting data.</li>';
    elements.dungeonEffects.innerHTML = (dungeon.environmentalEffects || [])
      .map((effect) => `<li>${effect}</li>`)
      .join('') || '<li>None.</li>';
    elements.dungeonRewards.innerHTML = `
      <li>Experience: ${dungeon.rewards?.xp ?? 0}</li>
      <li>Gold: ${dungeon.rewards?.gold ?? 0}</li>
      <li>Items: ${(dungeon.rewards?.items || []).map((id) => getItem(id)?.name || id).join(', ') || 'None'}</li>
    `;
  }
  function populateDungeonSelect() {
    const zone = getCurrentZone();
    const dungeons = data.dungeons.filter((dungeon) => dungeon.zoneId === zone?.id);
    if (!dungeons.length) {
      elements.dungeonSelect.innerHTML = '<option>No dungeons discovered</option>';
      setTrackedState(state.selected, 'dungeonId', null);
      return [];
    }
    elements.dungeonSelect.innerHTML = dungeons
      .map((dungeon) => `<option value=\"${dungeon.id}\">${dungeon.name}</option>`)
      .join('');
    if (!state.selected.dungeonId || !dungeons.some((d) => d.id === state.selected.dungeonId)) {
      setTrackedState(state.selected, 'dungeonId', dungeons[0].id);
    }
    elements.dungeonSelect.value = state.selected.dungeonId;
    return dungeons;
  }

  function startDungeonRun() {
    if (!state.player) return;
    const dungeon = getDungeon(state.selected.dungeonId);
    if (!dungeon) {
      addLog('There is no dungeon expedition available in this zone.', logTypes.INFO);
      return;
    }
    if (!ensureCanAct('delve into a dungeon')) return;
    addLog(`You delve into the ${dungeon.name}.`, logTypes.INFO);
    const encounters = [...(dungeon.encounterIds || [])];
    if (dungeon.bossId) encounters.push(dungeon.bossId);
    const enemyId = sample(encounters);
    enterCombat(enemyId, { dungeonId: dungeon.id, boss: enemyId === dungeon.bossId });
  }

  function renderCombatScreen() {
    const zone = getCurrentZone();
    if (elements.combatCurrentZone) {
      elements.combatCurrentZone.textContent = zone?.name || 'Unknown';
    }
    populateCombatEnemies();
    renderEnemyDetails(state.selected.enemyId);
    renderCombatState();
  }

  function populateCombatEnemies() {
    if (!elements.combatEnemySelect) return;
    const zone = getCurrentZone();
    let enemies = [...(zone?.enemyIds || [])];
    if (state.combat.active && state.combat.enemyId && !enemies.includes(state.combat.enemyId)) {
      enemies.push(state.combat.enemyId);
    }
    if (!enemies.length) {
      elements.combatEnemySelect.innerHTML = '<option>No threats mapped</option>';
      setTrackedState(state.selected, 'enemyId', null);
      return;
    }
    elements.combatEnemySelect.innerHTML = enemies
      .map((enemyId) => `<option value=\"${enemyId}\">${getEnemy(enemyId).name}</option>`)
      .join('');
    if (!state.selected.enemyId || !enemies.includes(state.selected.enemyId)) {
      setTrackedState(state.selected, 'enemyId', enemies[0]);
    }
    elements.combatEnemySelect.value = state.selected.enemyId;
  }

  function renderEnemyDetails(enemyId) {
    const enemy = getEnemy(enemyId);
    if (!enemy) {
      elements.enemyDetails.textContent = 'Select an enemy to view scouting intel.';
      return;
    }
    const loot = (enemy.loot || [])
      .map((entry) => `${getItem(entry.itemId)?.name || entry.itemId} (${Math.round(entry.chance * 100)}%)`)
      .join(', ');
    const speed = Math.round(getEnemySpeed(enemy));
    elements.enemyDetails.innerHTML = `
      <p><strong>Level:</strong> ${enemy.level}</p>
      <p><strong>Type:</strong> ${toTitle(enemy.type)}</p>
      <p><strong>Vitals:</strong> ${enemy.stats.health} health, ${enemy.stats.power} power, ${enemy.stats.defense} defense</p>
      <p><strong>Speed:</strong> ${speed}</p>
      <p><strong>Abilities:</strong> ${(enemy.abilities || []).join(', ') || 'Unknown'}</p>
      <p><strong>Loot:</strong> ${loot || 'None noted'}</p>
    `;
  }

  function enterCombat(enemyId, context = null) {
    const player = state.player;
    const enemy = getEnemy(enemyId);
    if (!player || !enemy) return;
    if (player.resources.health <= 0) {
      addLog('You must recover before entering battle.', logTypes.WARNING);
      return;
    }
    state.combat.enemyId = enemyId;
    state.combat.context = context;
    state.combat.active = true;
    state.combat.turn = null;
    state.combat.enemyHealth = enemy.stats.health;
    state.combat.playerHealth = player.resources.health;
    state.combat.playerMana = player.resources.mana;
    state.combat.guard = false;
    state.combat.log = [];
    state.combat.initiative = createCombatInitiative(player, enemy);
    setTrackedState(state.selected, 'enemyId', enemyId);
    addCombatLog(`You engage the ${enemy.name}.`, logTypes.INFO, true);
    showScreen('combat');
    advanceInitiative();
    processAutomaticTurns();
  }

  function renderCombatState() {
    if (!elements.combatActions) return;
    const inCombat = state.combat.active;
    elements.combatActions.classList.toggle('active', inCombat);
    const player = state.player;
    const enemy = getEnemy(state.combat.enemyId);
    const playerButtons = [
      elements.combatStrikeButton,
      elements.combatAbilityButton,
      elements.combatGuardButton,
      elements.combatFleeButton
    ];
    playerButtons.forEach((button) => {
      if (!button) return;
      button.disabled = !inCombat || state.combat.turn !== 'player';
    });
    if (elements.engageCombatButton) {
      elements.engageCombatButton.disabled = inCombat;
    }
    if (elements.autoSelectEnemy) {
      elements.autoSelectEnemy.disabled = inCombat;
    }
    if (elements.combatEnemySelect) {
      elements.combatEnemySelect.disabled = inCombat;
    }
    if (!inCombat || !player || !enemy) {
      const zone = getCurrentZone();
      elements.combatStatus.innerHTML = zone
        ? `<p>Select an enemy in ${zone.name} to begin a battle.</p>`
        : '<p>No battle data available.</p>';
      renderCombatLog();
      return;
    }
    const playerMaxHealth = getTotalStat(player, 'health');
    const playerMaxMana = getTotalStat(player, 'mana');
    const enemyMaxHealth = enemy.stats.health;
    const initiative = state.combat.initiative;
    const threshold = initiative?.threshold || 100;
    const playerMeter = clamp(initiative?.player?.meter ?? 0, 0, threshold);
    const enemyMeter = clamp(initiative?.enemy?.meter ?? 0, 0, threshold);
    const playerReadiness = Math.round((playerMeter / threshold) * 100);
    const enemyReadiness = Math.round((enemyMeter / threshold) * 100);
    const playerSpeed = Math.round(initiative?.player?.speed ?? getPlayerSpeed(player));
    const enemySpeed = Math.round(initiative?.enemy?.speed ?? getEnemySpeed(enemy));
    const turnDescription = !state.combat.turn
      ? 'Rebalancing initiative...'
      : state.combat.turn === 'player'
      ? 'Your move'
      : `${enemy.name} is poised to act`;
    elements.combatStatus.innerHTML = `
      <p><strong>${player.name}</strong>: ${Math.round(state.combat.playerHealth)} / ${Math.round(playerMaxHealth)} HP</p>
      <p><strong>Mana:</strong> ${Math.round(state.combat.playerMana)} / ${Math.round(playerMaxMana)}</p>
      <p><strong>${enemy.name}</strong>: ${Math.max(0, Math.round(state.combat.enemyHealth))} / ${Math.round(enemyMaxHealth)} HP</p>
      <p><strong>Speed:</strong> You ${playerSpeed}, ${enemy.name} ${enemySpeed}</p>
      <p><strong>Readiness:</strong> You ${playerReadiness}%, ${enemy.name} ${enemyReadiness}%</p>
      <p><strong>Next Action:</strong> ${turnDescription}</p>
    `;
    renderCombatLog();
  }

  function addCombatLog(message, type = logTypes.INFO, alsoGlobal = false) {
    state.combat.log.push({ message, type });
    if (state.combat.log.length > 40) {
      state.combat.log.shift();
    }
    if (alsoGlobal) {
      addLog(message, type);
    } else if (elements.combatLog) {
      const entry = document.createElement('div');
      entry.className = `log-entry ${type}`;
      entry.textContent = message;
      elements.combatLog.appendChild(entry);
      elements.combatLog.scrollTop = elements.combatLog.scrollHeight;
    }
  }

  function renderCombatLog() {
    if (!elements.combatLog) return;
    elements.combatLog.innerHTML = state.combat.log
      .map((entry) => `<div class=\"log-entry ${entry.type}\">${entry.message}</div>`)
      .join('') || '<p>No combat actions yet.</p>';
    elements.combatLog.scrollTop = elements.combatLog.scrollHeight;
  }

  function createCombatInitiative(player, enemy) {
    return {
      threshold: 100,
      player: { meter: 0, speed: getPlayerSpeed(player) },
      enemy: { meter: 0, speed: getEnemySpeed(enemy) }
    };
  }

  function getPlayerSpeed(player) {
    if (!player) return 1;
    const totalSpeed = getTotalStat(player, 'speed');
    if (totalSpeed > 0) {
      return totalSpeed;
    }
    const agility = getTotalStat(player, 'agility');
    return Math.max(5, Math.round(agility * 1.2 + 10));
  }

  function getEnemySpeed(enemy) {
    if (!enemy) return 1;
    const rawSpeed = enemy.stats?.speed;
    if (rawSpeed > 0) {
      return rawSpeed;
    }
    const crit = enemy.stats?.crit ?? 8;
    return Math.max(5, Math.round(crit * 1.4 + 8));
  }

  function advanceInitiative() {
    if (!state.combat.active) return;
    const initiative = state.combat.initiative;
    if (!initiative) return;
    const player = state.player;
    const enemy = getEnemy(state.combat.enemyId);
    const threshold = initiative.threshold > 0 ? initiative.threshold : 100;
    if (player) {
      initiative.player.speed = Math.max(1, getPlayerSpeed(player));
    }
    if (enemy) {
      initiative.enemy.speed = Math.max(1, getEnemySpeed(enemy));
    }
    const playerEntry = initiative.player;
    const enemyEntry = initiative.enemy;
    if (!playerEntry || !enemyEntry) {
      state.combat.turn = 'player';
      return;
    }

    if (playerEntry.meter >= threshold && enemyEntry.meter >= threshold) {
      if (playerEntry.speed >= enemyEntry.speed) {
        playerEntry.meter = wrapMeter(playerEntry.meter - threshold, threshold);
        state.combat.turn = 'player';
      } else {
        enemyEntry.meter = wrapMeter(enemyEntry.meter - threshold, threshold);
        state.combat.turn = 'enemy';
      }
      return;
    }

    if (playerEntry.meter >= threshold) {
      playerEntry.meter = wrapMeter(playerEntry.meter - threshold, threshold);
      state.combat.turn = 'player';
      return;
    }

    if (enemyEntry.meter >= threshold) {
      enemyEntry.meter = wrapMeter(enemyEntry.meter - threshold, threshold);
      state.combat.turn = 'enemy';
      return;
    }

    const playerTime = (threshold - playerEntry.meter) / playerEntry.speed;
    const enemyTime = (threshold - enemyEntry.meter) / enemyEntry.speed;

    let actor = 'player';
    let delta = playerTime;

    if (!Number.isFinite(playerTime) && Number.isFinite(enemyTime)) {
      actor = 'enemy';
      delta = enemyTime;
    } else if (!Number.isFinite(enemyTime) && Number.isFinite(playerTime)) {
      actor = 'player';
      delta = playerTime;
    } else if (Number.isFinite(playerTime) && Number.isFinite(enemyTime)) {
      if (enemyTime < playerTime) {
        actor = 'enemy';
        delta = enemyTime;
      } else if (playerTime < enemyTime) {
        actor = 'player';
        delta = playerTime;
      } else {
        delta = playerTime;
        if (playerEntry.speed === enemyEntry.speed) {
          actor = 'player';
        } else {
          actor = playerEntry.speed > enemyEntry.speed ? 'player' : 'enemy';
        }
      }
    } else {
      actor = 'player';
      delta = 0;
    }

    const safeDelta = Math.max(0, Number.isFinite(delta) ? delta : 0);
    playerEntry.meter += playerEntry.speed * safeDelta;
    enemyEntry.meter += enemyEntry.speed * safeDelta;

    if (actor === 'player') {
      playerEntry.meter = wrapMeter(playerEntry.meter - threshold, threshold);
    } else {
      enemyEntry.meter = wrapMeter(enemyEntry.meter - threshold, threshold);
    }

    state.combat.turn = actor;
  }

  function wrapMeter(value, threshold) {
    if (!Number.isFinite(value)) return 0;
    if (!(threshold > 0)) return 0;
    let meter = value % threshold;
    if (meter < 0) {
      meter += threshold;
    }
    const precision = 1e-6;
    if (meter > threshold - precision) {
      return 0;
    }
    return meter;
  }

  function processAutomaticTurns() {
    if (!state.combat.active) return;
    if (!state.combat.turn) {
      advanceInitiative();
    }
    while (state.combat.active && state.combat.turn === 'enemy') {
      renderCombatState();
      const acted = resolveEnemyTurn();
      if (!state.combat.active) {
        return;
      }
      renderCombatState();
      if (!acted) {
        break;
      }
      advanceInitiative();
    }
    if (state.combat.active) {
      renderCombatState();
    }
  }

  function takeCombatAction(action) {
    if (!state.combat.active || state.combat.turn !== 'player') return;
    const enemy = getEnemy(state.combat.enemyId);
    const player = state.player;
    if (!enemy || !player) return;
    let actionPerformed = false;
    if (action === 'strike') {
      const damage = Math.max(
        4,
        Math.round(calculatePlayerAttack() * (0.85 + Math.random() * 0.3) - enemy.stats.defense)
      );
      state.combat.enemyHealth -= damage;
      addCombatLog(`You strike the ${enemy.name} for ${damage} damage.`, logTypes.SUCCESS);
      actionPerformed = true;
    } else if (action === 'ability') {
      const abilityCost = 15;
      if (state.combat.playerMana < abilityCost) {
        addCombatLog('You need more mana to unleash a special ability.', logTypes.WARNING);
        renderCombatState();
        return;
      }
      const abilityName = state.player.abilities?.[0] || 'a signature technique';
      state.combat.playerMana = Math.max(0, state.combat.playerMana - abilityCost);
      const damage = Math.max(
        8,
        Math.round(calculatePlayerAttack() * 1.1 + 8 - enemy.stats.defense * 0.2)
      );
      state.combat.enemyHealth -= damage;
      addCombatLog(`You channel ${abilityName}, dealing ${damage} damage!`, logTypes.SUCCESS);
      actionPerformed = true;
    } else if (action === 'guard') {
      state.combat.guard = true;
      addCombatLog('You brace for the next assault, reducing incoming damage.', logTypes.INFO);
      actionPerformed = true;
    } else if (action === 'flee') {
      if (attemptFlee(enemy)) {
        finishCombat('flee', enemy);
        return;
      }
      addCombatLog('You fail to escape the encounter!', logTypes.WARNING);
      actionPerformed = true;
    }

    if (!actionPerformed) {
      renderCombatState();
      return;
    }

    if (state.combat.enemyHealth <= 0) {
      finishCombat('victory', enemy);
      return;
    }

    advanceInitiative();
    processAutomaticTurns();
  }

  function resolveEnemyTurn() {
    if (!state.combat.active) return false;
    const enemy = getEnemy(state.combat.enemyId);
    const player = state.player;
    if (!enemy || !player) return false;
    const playerDefense = getTotalStat(player, 'armor');
    let damage = Math.max(
      3,
      Math.round(enemy.stats.power * (0.85 + Math.random() * 0.3) - playerDefense * 0.4)
    );
    if (state.combat.guard) {
      damage = Math.round(damage * 0.5);
      state.combat.guard = false;
      addCombatLog('Your guard absorbs part of the blow.', logTypes.INFO);
    }
    state.combat.playerHealth = Math.max(0, state.combat.playerHealth - damage);
    addCombatLog(`The ${enemy.name} hits you for ${damage} damage.`, logTypes.DANGER);
    if (state.combat.playerHealth <= 0) {
      finishCombat('defeat', enemy);
      return false;
    }
    if (enemy.abilities?.length && Math.random() < 0.2) {
      const abilityName = sample(enemy.abilities);
      const burst = Math.max(2, Math.round(enemy.stats.power * 0.6));
      state.combat.playerHealth = Math.max(0, state.combat.playerHealth - burst);
      addCombatLog(`The ${enemy.name} uses ${abilityName}, dealing ${burst} extra damage.`, logTypes.DANGER);
      if (state.combat.playerHealth <= 0) {
        finishCombat('defeat', enemy);
        return false;
      }
    }
    return true;
  }

  function finishCombat(outcome, enemy) {
    const player = state.player;
    if (!player || !enemy) return;
    player.resources.health = clamp(Math.round(state.combat.playerHealth), 0, getTotalStat(player, 'health'));
    player.resources.mana = clamp(Math.round(state.combat.playerMana), 0, getTotalStat(player, 'mana'));
    if (outcome === 'victory') {
      addCombatLog(`You defeat the ${enemy.name}!`, logTypes.SUCCESS);
      handleCombatVictory(enemy, []);
    } else if (outcome === 'defeat') {
      addCombatLog(`You fall in battle against the ${enemy.name}.`, logTypes.DANGER);
      handleCombatDefeat(enemy, []);
    } else if (outcome === 'flee') {
      addCombatLog(`You flee from the ${enemy.name}.`, logTypes.WARNING);
      addLog(`You flee from the ${enemy.name} and escape the encounter.`, logTypes.WARNING);
    }
    state.combat.active = false;
    state.combat.turn = null;
    state.combat.enemyHealth = 0;
    state.combat.enemyId = null;
    state.combat.context = null;
    state.combat.guard = false;
    state.combat.initiative = null;
    renderCombatState();
    updatePlayerPanel();
    renderInventory();
    updateQuestLogView();
    updateNavigationLocks();
  }

  function attemptFlee(enemy) {
    const agility = state.player.stats.agility || 0;
    const fleeChance = clamp(0.3 + agility / 150, 0.25, 0.75);
    if (Math.random() < fleeChance) {
      addCombatLog(`You slip away from the ${enemy.name}.`, logTypes.INFO, true);
      return true;
    }
    return false;
  }

  function handleCombatVictory(enemy, rounds) {
    rounds.forEach((line) => addLog(line, logTypes.INFO));
    addLog(`You defeat the ${enemy.name}!`, logTypes.SUCCESS);
    const xpGained = enemy.xp || 0;
    const goldGained = enemy.gold || 0;
    state.player.xp += xpGained;
    state.player.gold += goldGained;
    addLog(`Rewards: ${xpGained} XP, ${goldGained} gold.`, logTypes.SUCCESS);
    (enemy.loot || []).forEach((entry) => {
      if (Math.random() <= entry.chance) {
        const quantity = entry.quantity || 1;
        grantItem(state.player, entry.itemId, quantity);
        addLog(`Loot acquired: ${getItem(entry.itemId).name} x${quantity}.`, logTypes.SUCCESS);
      }
    });
    updateQuestProgress('kill', enemy.id, 1);
    checkLevelUp();
    const context = state.combat.context;
    if (context?.dungeonId && context.boss) {
      completeDungeon(context.dungeonId);
    }
    state.combat.context = null;
  }

  function handleCombatDefeat(enemy, rounds) {
    rounds.forEach((line) => addLog(line, logTypes.DANGER));
    addLog(`You fall in battle against the ${enemy.name}.`, logTypes.DANGER);
    const lostGold = Math.min(state.player.gold, Math.max(2, Math.round(state.player.gold * 0.1)));
    state.player.gold -= lostGold;
    state.player.resources.health = Math.max(1, Math.round(getTotalStat(state.player, 'health') * 0.25));
    addLog(`You retreat to safety, losing ${lostGold} gold in the process.`, logTypes.WARNING);
    state.combat.context = null;
  }

  function completeDungeon(dungeonId) {
    const dungeon = getDungeon(dungeonId);
    if (!dungeon) return;
    addLog(`Dungeon cleared: ${dungeon.name}!`, logTypes.SUCCESS);
    state.player.xp += dungeon.rewards?.xp || 0;
    state.player.gold += dungeon.rewards?.gold || 0;
    (dungeon.rewards?.items || []).forEach((itemId) => grantItem(state.player, itemId, 1));
    updateQuestProgress('dungeon', dungeonId, 1);
    checkLevelUp();
  }

  function calculatePlayerAttack() {
    const player = state.player;
    const base = player.stats.strength + player.stats.agility * 0.5 + player.stats.intellect * 0.3;
    const equipmentBonus = ['weapon', 'offHand', 'trinket']
      .map((slot) => getItem(player.equipment[slot]))
      .filter(Boolean)
      .reduce((sum, item) => sum + (item.stats?.attack || item.stats?.spellPower || 0), 0);
    return base + equipmentBonus + player.level * 1.5;
  }

  function renderNpcScreen() {
    const zone = getCurrentZone();
    if (elements.npcCurrentZone) {
      elements.npcCurrentZone.textContent = zone?.name || 'Unknown';
    }
    const npcs = (zone?.npcIds || [])
      .map((npcId) => getNpc(npcId))
      .filter(Boolean);
    if (!npcs.length) {
      elements.npcSelect.innerHTML = '<option>No allies nearby</option>';
      elements.npcSelect.disabled = true;
      elements.npcDetails.textContent = 'Travel to another zone to meet new allies.';
      setTrackedState(state.selected, 'npcId', null);
      return;
    }
    elements.npcSelect.disabled = false;
    elements.npcSelect.innerHTML = npcs
      .map((npc) => `<option value=\"${npc.id}\">${npc.name}</option>`)
      .join('');
    if (!state.selected.npcId || !npcs.some((npc) => npc.id === state.selected.npcId)) {
      setTrackedState(state.selected, 'npcId', npcs[0].id);
    }
    elements.npcSelect.value = state.selected.npcId;
    renderNpcDetails(state.selected.npcId);
  }

  function renderNpcDetails(npcId) {
    const npc = getNpc(npcId);
    if (!npc) {
      elements.npcDetails.textContent = 'Select an ally to review their services.';
      return;
    }
    const services = (npc.services || []).join(', ') || 'None';
    const dialogue = sample(npc.dialogue || []) || '...';
    elements.npcDetails.innerHTML = `
      <p><strong>${npc.name}</strong> — ${npc.title}</p>
      <p><strong>Faction:</strong> ${npc.faction || 'Independent'}</p>
      <p><strong>Services:</strong> ${services}</p>
      <p><strong>They say:</strong> “${dialogue}”</p>
    `;
  }

  function talkToNpc() {
    if (!ensureCanAct('chat with allies')) return;
    const npc = getNpc(state.selected.npcId);
    if (!npc) return;
    const line = sample(npc.dialogue || []) || `${npc.name} nods silently.`;
    addLog(`${npc.name} says: “${line}”`, logTypes.INFO);
    updateQuestProgress('talk', npc.id, 1);
  }

  function requestQuestFromNpc() {
    if (!ensureCanAct('request quests')) return;
    const npc = getNpc(state.selected.npcId);
    if (!npc) return;
    const availableQuest = (npc.questIds || []).find((questId) => !hasQuest(questId));
    if (!availableQuest) {
      addLog(`${npc.name} has no new tasks for you right now.`, logTypes.INFO);
      return;
    }
    addQuestToPlayer(state.player, availableQuest);
    updateQuestLogView();
    addLog(`${npc.name} entrusts you with the quest \"${getQuest(availableQuest).name}\".`, logTypes.SUCCESS);
  }

  function hasQuest(questId) {
    return (
      state.player.quests.active.some((entry) => entry.quest.id === questId) ||
      state.player.quests.completed.some((entry) => entry.quest.id === questId)
    );
  }

  function renderTradingScreen(forceRefresh = false) {
    const zone = getCurrentZone();
    if (elements.tradingCurrentZone) {
      elements.tradingCurrentZone.textContent = zone?.name || 'Unknown';
    }
    const merchants = populateMerchants();
    const merchant = merchants.find((npc) => npc.id === state.selected.merchantId) || null;
    if (!merchant) {
      elements.merchantInfo.textContent = 'No merchants are operating in this area.';
      elements.merchantInventory.innerHTML = '';
      elements.sellInventory.innerHTML = '';
      return;
    }
    elements.merchantInfo.innerHTML = `
      <p><strong>${merchant.name}</strong> — ${merchant.title}</p>
      <p><strong>Services:</strong> ${(merchant.services || []).join(', ')}</p>
      <p><strong>Buys:</strong> ${(merchant.buyTypes || []).join(', ') || 'Common goods'}</p>
    `;
    renderMerchantStock(merchant, forceRefresh);
    renderSellableItems(merchant);
  }

  function populateMerchants() {
    const zone = getCurrentZone();
    const merchants = (zone?.npcIds || [])
      .map((npcId) => getNpc(npcId))
      .filter((npc) => (npc?.services || []).includes('trading'));
    if (!merchants.length) {
      elements.merchantSelect.innerHTML = '<option>No merchants available</option>';
      elements.merchantSelect.disabled = true;
      setTrackedState(state.selected, 'merchantId', null);
      return [];
    }
    elements.merchantSelect.disabled = false;
    elements.merchantSelect.innerHTML = merchants
      .map((npc) => `<option value=\"${npc.id}\">${npc.name}</option>`)
      .join('');
    if (!state.selected.merchantId || !merchants.some((npc) => npc.id === state.selected.merchantId)) {
      setTrackedState(state.selected, 'merchantId', merchants[0].id);
    }
    elements.merchantSelect.value = state.selected.merchantId;
    return merchants;
  }

  function renderMerchantStock(merchant, forceRefresh) {
    const stock = merchant.inventory || [];
    if (forceRefresh) {
      stock.sort(() => Math.random() - 0.5);
    }
    elements.merchantInventory.innerHTML = stock
      .map((entry) => {
        const item = getItem(entry.itemId);
        const price = entry.price ?? item.value ?? 5;
        return `
          <article class=\"card\">
            <header class=\"card-header\">${item.name}</header>
            <p class=\"card-body\">${item.description}</p>
            <div class=\"card-footer\">
              <span>${price} gold</span>
              <button type=\"button\" data-buy-item=\"${entry.itemId}\">Buy</button>
            </div>
          </article>
        `;
      })
      .join('') || '<p>No goods available.</p>';
  }
  function renderSellableItems(merchant) {
    const buyTypes = merchant.buyTypes || [];
    const items = Object.entries(state.player.inventory)
      .filter(([itemId, qty]) => qty > 0)
      .filter(([itemId]) => {
        const item = getItem(itemId);
        return buyTypes.includes(item.type) || item.tags?.some((tag) => buyTypes.includes(tag));
      });
    elements.sellInventory.innerHTML = items
      .map(([itemId, qty]) => {
        const item = getItem(itemId);
        const price = Math.max(1, Math.round((item.value || 1) * 0.6));
        return `
          <article class=\"card\">
            <header class=\"card-header\">${item.name} ×${qty}</header>
            <p class=\"card-body\">${item.description}</p>
            <div class=\"card-footer\">
              <span>Sell for ${price} gold</span>
              <button type=\"button\" data-sell-item=\"${itemId}\">Sell</button>
            </div>
          </article>
        `;
      })
      .join('') || '<p>No items match this merchant\'s interests.</p>';
  }

  function renderProfessionScreen() {
    populateProfessionSelect();
    const profession = getProfession(state.selected.professionId);
    if (!profession) {
      elements.professionDescription.textContent = 'Train a profession to begin gathering or crafting.';
      elements.professionGatherables.innerHTML = '';
      elements.professionRecipes.innerHTML = '';
      elements.recipeSelect.innerHTML = '';
      return;
    }
    elements.professionDescription.textContent = profession.description;
    elements.professionGatherables.innerHTML = (profession.gatherables || [])
      .map((itemId) => `<li>${getItem(itemId)?.name || itemId}</li>`)
      .join('') || '<li>No natural resources known.</li>';
    const recipes = profession.crafts || [];
    elements.recipeSelect.innerHTML = recipes
      .map((recipe) => `<option value=\"${recipe.itemId}\">${getItem(recipe.itemId)?.name || recipe.itemId}</option>`)
      .join('');
    if (recipes.length) {
      if (!state.selected.recipeId || !recipes.some((recipe) => recipe.itemId === state.selected.recipeId)) {
        setTrackedState(state.selected, 'recipeId', recipes[0].itemId);
      }
      elements.recipeSelect.value = state.selected.recipeId;
    } else {
      elements.recipeSelect.innerHTML = '<option>No recipes learned</option>';
      setTrackedState(state.selected, 'recipeId', null);
    }
    elements.professionRecipes.innerHTML = recipes
      .map((recipe) => {
        const item = getItem(recipe.itemId);
        const requirements = Object.entries(recipe.requirements || {})
          .map(([id, qty]) => `${getItem(id)?.name || id} ×${qty}`)
          .join(', ');
        return `
          <article class=\"card\">
            <header class=\"card-header\">${item.name}</header>
            <p class=\"card-body\">${recipe.description || item.description}</p>
            <div class=\"card-footer\">
              <span>Requires: ${requirements || 'N/A'}</span>
              <button type=\"button\" data-craft-item=\"${recipe.itemId}\">Craft</button>
            </div>
          </article>
        `;
      })
      .join('') || '<p>No recipes available.</p>';
  }

  function populateProfessionSelect() {
    const professions = (state.player?.professions || []).map((id) => getProfession(id)).filter(Boolean);
    if (!professions.length) {
      elements.professionSelect.innerHTML = '<option>No professions trained</option>';
      return;
    }
    elements.professionSelect.innerHTML = professions
      .map((profession) => `<option value=\"${profession.id}\">${profession.name}</option>`)
      .join('');
    if (!state.selected.professionId || !professions.some((p) => p.id === state.selected.professionId)) {
      setTrackedState(state.selected, 'professionId', professions[0].id);
    }
    elements.professionSelect.value = state.selected.professionId;
  }

  function gatherResources() {
    if (!state.player) return;
    if (!ensureCanAct('gather resources')) return;
    const profession = getProfession(state.selected.professionId);
    if (!profession || !(profession.gatherables || []).length) {
      addLog('This profession has no resources to gather.', logTypes.INFO);
      return;
    }
    const zone = getCurrentZone();
    const possible = profession.gatherables.filter((itemId) => zone?.gatherables?.includes(itemId));
    const itemId = sample(possible.length ? possible : profession.gatherables);
    const amount = Math.random() < 0.25 ? 2 : 1;
    grantItem(state.player, itemId, amount);
    addLog(
      `You gather ${amount} ${getItem(itemId).name} while working in ${zone?.name || 'the wilds'}.`,
      logTypes.SUCCESS
    );
    renderInventory();
    updateQuestProgress('collect', itemId, amount);
  }

  function craftRecipe(itemId) {
    if (!ensureCanAct('craft items')) return;
    const profession = getProfession(state.selected.professionId);
    if (!profession) return;
    const recipe = (profession.crafts || []).find((entry) => entry.itemId === itemId);
    if (!recipe) {
      addLog('Recipe not found.', logTypes.WARNING);
      return;
    }
    if (!hasCraftingMaterials(recipe.requirements)) {
      addLog('Missing materials for this recipe.', logTypes.WARNING);
      return;
    }
    consumeMaterials(recipe.requirements);
    grantItem(state.player, recipe.itemId, 1);
    addLog(`You craft ${getItem(recipe.itemId).name}.`, logTypes.SUCCESS);
    renderInventory();
  }

  function hasCraftingMaterials(requirements) {
    return Object.entries(requirements || {}).every(([itemId, qty]) => {
      return (state.player.inventory[itemId] || 0) >= qty;
    });
  }

  function consumeMaterials(requirements) {
    Object.entries(requirements || {}).forEach(([itemId, qty]) => {
      removeItem(state.player, itemId, qty);
    });
  }

  function grantItem(player, itemId, amount = 1, options = {}) {
    if (!itemId) return;
    const item = getItem(itemId);
    if (!item) return;
    player.inventory[itemId] = (player.inventory[itemId] || 0) + amount;
    if (options.autoEquip) {
      autoEquip(player, itemId);
    }
  }

  function removeItem(player, itemId, amount = 1) {
    if (!player.inventory[itemId]) return;
    player.inventory[itemId] = Math.max(0, player.inventory[itemId] - amount);
  }

  function autoEquip(player, itemId) {
    const item = getItem(itemId);
    if (!item) return;
    switch (item.type) {
      case 'weapon':
        if (!player.equipment.weapon) player.equipment.weapon = itemId;
        break;
      case 'off-hand':
        if (!player.equipment.offHand) player.equipment.offHand = itemId;
        break;
      case 'armor':
        if (!player.equipment.armor) player.equipment.armor = itemId;
        break;
      case 'trinket':
        if (!player.equipment.trinket) player.equipment.trinket = itemId;
        break;
      default:
        break;
    }
  }

  function renderInventory() {
    if (!state.player) return;
    const entries = Object.entries(state.player.inventory).filter(([, qty]) => qty > 0);
    if (!entries.length) {
      elements.inventoryList.innerHTML = '<p>Your bags are empty.</p>';
      return;
    }
    const fragment = document.createDocumentFragment();
    entries.forEach(([itemId, qty]) => {
      const item = getItem(itemId);
      const template = elements.inventoryItemTemplate.content.cloneNode(true);
      const card = template.querySelector('.card');
      const header = template.querySelector('.card-header');
      const body = template.querySelector('.card-body');
      const footer = template.querySelector('.card-footer');
      header.textContent = `${item.name} ×${qty}`;
      body.textContent = item.description;
      const value = item.value ? `${item.value} gold` : 'No market value';
      footer.innerHTML = `<span>${value}</span>`;
      if (item.type === 'consumable') {
        const useButton = document.createElement('button');
        useButton.type = 'button';
        useButton.textContent = 'Use';
        useButton.dataset.useItem = itemId;
        footer.appendChild(useButton);
      }
      fragment.appendChild(card);
    });
    elements.inventoryList.innerHTML = '';
    elements.inventoryList.appendChild(fragment);
  }

  function useItem(itemId) {
    if (!ensureCanAct('use items from your pack')) return;

    const item = getItem(itemId);
    if (!item || item.type !== 'consumable') return;
    if ((state.player.inventory[itemId] || 0) <= 0) {
      addLog('You have no more of that item left.', logTypes.WARNING);
      return;
    }
    const effect = item.effect || {};
    if (effect.health) {
      state.player.resources.health = clamp(
        state.player.resources.health + effect.health,
        0,
        getTotalStat(state.player, 'health')
      );
    }
    if (effect.mana) {
      state.player.resources.mana = clamp(
        state.player.resources.mana + effect.mana,
        0,
        getTotalStat(state.player, 'mana')
      );
    }
    removeItem(state.player, itemId, 1);
    addLog(`You use ${item.name}.`, logTypes.SUCCESS);
    renderInventory();
    updatePlayerPanel();
  }

  function handlePurchase(itemId) {
    if (!ensureCanAct('trade during combat')) return;
    const merchant = getNpc(state.selected.merchantId);
    if (!merchant) return;
    const entry = (merchant.inventory || []).find((stock) => stock.itemId === itemId);
    if (!entry) return;
    const item = getItem(itemId);
    const price = entry.price ?? item.value ?? 5;
    if (state.player.gold < price) {
      addLog('You cannot afford that purchase.', logTypes.WARNING);
      return;
    }
    state.player.gold -= price;
    grantItem(state.player, itemId, 1);
    addLog(`You purchase ${item.name} for ${price} gold.`, logTypes.SUCCESS);
    renderInventory();
    updatePlayerPanel();
  }

  function handleSale(itemId) {
    if (!ensureCanAct('trade during combat')) return;
    const merchant = getNpc(state.selected.merchantId);
    if (!merchant) return;
    const quantity = state.player.inventory[itemId] || 0;
    if (!quantity) {
      addLog('You have none of that item to sell.', logTypes.WARNING);
      return;
    }
    const item = getItem(itemId);
    const price = Math.max(1, Math.round((item.value || 1) * 0.6));
    removeItem(state.player, itemId, 1);
    state.player.gold += price;
    addLog(`You sell ${item.name} for ${price} gold.`, logTypes.INFO);
    renderInventory();
    updatePlayerPanel();
    renderTradingScreen();
  }

  function addQuestToPlayer(player, questId) {
    const quest = getQuest(questId);
    if (!quest) return;
    if (player.quests.active.some((entry) => entry.quest.id === questId)) return;
    const objectives = (quest.objectives || []).map((objective) => ({
      ...objective,
      progress: 0,
      completed: false
    }));
    player.quests.active.push({ quest, objectives });
  }

  function updateQuestProgress(type, target, amount = 1) {
    state.player.quests.active.forEach((entry) => {
      let updated = false;
      entry.objectives.forEach((objective) => {
        if (!objective.completed && objective.type === type && objective.target === target) {
          objective.progress = Math.min(objective.count || 1, (objective.progress || 0) + amount);
          if (objective.progress >= (objective.count || 1)) {
            objective.completed = true;
            addLog(`Objective complete: ${objective.description}`, logTypes.SUCCESS);
          }
          updated = true;
        }
      });
      if (updated && entry.objectives.every((objective) => objective.completed)) {
        completeQuest(entry);
      }
    });
    updateQuestLogView();
  }

  function completeQuest(entry) {
    addLog(`Quest complete: ${entry.quest.name}!`, logTypes.SUCCESS);
    state.player.xp += entry.quest.rewards?.xp || 0;
    state.player.gold += entry.quest.rewards?.gold || 0;
    (entry.quest.rewards?.items || []).forEach((itemId) => grantItem(state.player, itemId, 1));
    state.player.quests.active = state.player.quests.active.filter((active) => active.quest.id !== entry.quest.id);
    state.player.quests.completed.push(entry);
    checkLevelUp();
  }

  function updateQuestLogView() {
    const fragment = document.createDocumentFragment();
    const activeHeader = document.createElement('h3');
    activeHeader.textContent = 'Active Quests';
    fragment.appendChild(activeHeader);
    if (!state.player?.quests.active.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No active quests.';
      fragment.appendChild(empty);
    } else {
      state.player.quests.active.forEach((entry) => {
        fragment.appendChild(renderQuestCard(entry, false));
      });
    }
    const completedHeader = document.createElement('h3');
    completedHeader.textContent = 'Completed Quests';
    fragment.appendChild(completedHeader);
    if (!state.player?.quests.completed.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No completed quests yet.';
      fragment.appendChild(empty);
    } else {
      state.player.quests.completed.forEach((entry) => {
        fragment.appendChild(renderQuestCard(entry, true));
      });
    }
    elements.questLogContent.innerHTML = '';
    elements.questLogContent.appendChild(fragment);
  }

  function renderQuestCard(entry, completed) {
    const wrapper = document.createElement('article');
    wrapper.className = 'quest-card';
    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.textContent = entry.quest.name;
    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = completed ? 'Completed' : 'In Progress';
    header.appendChild(title);
    header.appendChild(status);
    const giver = document.createElement('p');
    giver.textContent = `Given by ${getNpc(entry.quest.giverId)?.name || 'Unknown'}`;
    const objectives = document.createElement('ul');
    objectives.className = 'quest-objectives';
    entry.objectives.forEach((objective) => {
      const li = document.createElement('li');
      const count = objective.count || 1;
      li.innerHTML = `${objective.description} — ${Math.min(objective.progress, count)}/${count}`;
      objectives.appendChild(li);
    });
    const rewards = document.createElement('p');
    rewards.className = 'quest-rewards';
    const items = (entry.quest.rewards?.items || []).map((id) => getItem(id)?.name || id).join(', ');
    rewards.textContent = `Rewards: ${entry.quest.rewards?.xp || 0} XP, ${entry.quest.rewards?.gold || 0} gold, ${items || 'no items'}`;
    wrapper.appendChild(header);
    wrapper.appendChild(giver);
    wrapper.appendChild(objectives);
    wrapper.appendChild(rewards);
    return wrapper;
  }

  function checkLevelUp() {
    while (state.player.xp >= state.player.xpToLevel) {
      state.player.xp -= state.player.xpToLevel;
      state.player.level += 1;
      state.player.xpToLevel = Math.round(state.player.xpToLevel * 1.35);
      levelUpPlayer();
    }
    updatePlayerPanel();
    renderLog();
  }

  function levelUpPlayer() {
    const player = state.player;
    Object.entries(player.growth || {}).forEach(([stat, value]) => {
      player.stats[stat] = (player.stats[stat] || 0) + value;
    });
    player.resources.health = getTotalStat(player, 'health');
    player.resources.mana = getTotalStat(player, 'mana');
    addLog(`You reach level ${player.level}! Attributes have improved.`, logTypes.SUCCESS);
  }

  function renderLog() {
    elements.logEntries.innerHTML = state.logs
      .slice(-40)
      .map((entry) => `<div class=\"log-entry ${entry.type}\">${entry.message}</div>`)
      .join('');
  }

  function addLog(message, type = logTypes.INFO) {
    state.logs.push({ message, type, timestamp: Date.now() });
    if (state.logs.length > 100) {
      state.logs.splice(0, state.logs.length - 100);
    }
    if (!elements.logEntries) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    elements.logEntries.appendChild(entry);
    elements.logEntries.scrollTop = elements.logEntries.scrollHeight;
    scheduleSave();
  }

  function restAtCamp() {
    if (!state.player) return;
    if (!ensureCanAct('rest')) return;
    state.player.resources.health = getTotalStat(state.player, 'health');
    state.player.resources.mana = getTotalStat(state.player, 'mana');
    addLog('You rest at camp, recovering your strength.', logTypes.INFO);
    updatePlayerPanel();
  }

  function isInCombat() {
    return Boolean(state.combat.active);
  }

  function ensureCanAct(actionDescription) {
    if (isInCombat()) {
      const message = actionDescription
        ? `You cannot ${actionDescription} while engaged in combat!`
        : 'You are locked in combat and cannot act.';
      addLog(message, logTypes.WARNING);
      return false;
    }
    return true;
  }

  function getCurrentZoneId() {
    return state.player?.location?.zoneId || data.zones[0]?.id || null;
  }

  function getCurrentZone() {
    const zoneId = getCurrentZoneId();
    return zoneId ? getZone(zoneId) : null;
  }

  function getClass(id) {
    return dataIndex.classes[id];
  }

  function getEnemy(id) {
    return dataIndex.enemies[id];
  }

  function getZone(id) {
    return dataIndex.zones[id];
  }

  function getDungeon(id) {
    return dataIndex.dungeons[id];
  }

  function getNpc(id) {
    return dataIndex.npcs[id];
  }

  function getItem(id) {
    return dataIndex.items[id];
  }

  function getProfession(id) {
    return dataIndex.professions[id];
  }

  function getQuest(id) {
    return dataIndex.quests[id];
  }

  function getTotalStat(player, stat) {
    const base = player.stats[stat] || 0;
    const equipmentBonus = Object.values(player.equipment || {})
      .map((itemId) => getItem(itemId))
      .filter(Boolean)
      .reduce((sum, item) => sum + (item.stats?.[stat] || 0), 0);
    return base + equipmentBonus;
  }

  function sample(collection) {
    if (!collection || !collection.length) return null;
    const index = Math.floor(Math.random() * collection.length);
    return collection[index];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toTitle(value) {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  }

  function restoreSavedGame() {
    if (!storageSupported) return false;
    let raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to access local storage.', error);
      return false;
    }
    if (!raw) return false;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      console.warn('Failed to parse saved game data.', error);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (storageError) {
        console.warn('Failed to clear invalid save data.', storageError);
      }
      return false;
    }
    if (!parsed || typeof parsed !== 'object' || !parsed.player || typeof parsed.player !== 'object') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (storageError) {
        console.warn('Failed to clear invalid save data.', storageError);
      }
      return false;
    }
    hydrateStateFromSave(parsed);
    return true;
  }

  function hydrateStateFromSave(saved) {
    state.player = saved.player;
    normaliseLoadedPlayer(state.player);
    state.currentScreen = saved.currentScreen && screenRenderers[saved.currentScreen]
      ? saved.currentScreen
      : 'exploration';
    state.logs = Array.isArray(saved.logs) ? saved.logs.slice(-100) : [];
    Object.assign(state.selected, saved.selected || {});
    Object.assign(state.travel, saved.travel || {});
    state.combat = createDefaultCombatState();
    sanitizeLoadedState();
    syncResourceCaps(state.player);
    elements.newGameModal.classList.add('hidden');
    updateAllUI();
    showScreen(state.currentScreen);
    saveGame();
  }

  function normaliseLoadedPlayer(player) {
    player.inventory = player.inventory || {};
    player.equipment = {
      weapon: player.equipment?.weapon || null,
      offHand: player.equipment?.offHand || null,
      armor: player.equipment?.armor || null,
      trinket: player.equipment?.trinket || null
    };
    player.resources = player.resources || {};
    player.location = player.location || { zoneId: data.zones[0]?.id || null };
    player.professions = Array.isArray(player.professions) ? player.professions : [];
    player.quests = player.quests || { active: [], completed: [] };
    player.quests.active = (player.quests.active || [])
      .map((entry) => rehydrateQuestEntry(entry))
      .filter(Boolean);
    player.quests.completed = (player.quests.completed || [])
      .map((entry) => rehydrateQuestEntry(entry))
      .filter(Boolean);
  }

  function rehydrateQuestEntry(entry) {
    if (!entry) return null;
    const questId = entry.quest?.id || entry.questId;
    const quest = questId ? getQuest(questId) : null;
    const objectives = (entry.objectives || []).map((objective) => ({
      ...objective,
      progress: objective?.progress ?? 0,
      completed: Boolean(objective?.completed)
    }));
    const fallbackQuest = quest || entry.quest || {
      id: questId || 'unknown',
      name: entry.quest?.name || 'Unknown Quest',
      description: entry.quest?.description || ''
    };
    return {
      quest: fallbackQuest,
      objectives
    };
  }

  function sanitizeLoadedState() {
    if (!state.player.location || !getZone(state.player.location.zoneId)) {
      state.player.location = { zoneId: data.zones[0]?.id || null };
    }
    if (!getZone(state.travel.destinationZoneId)) {
      state.travel.destinationZoneId = state.player.location.zoneId;
    }
    if (state.selected.dungeonId && !getDungeon(state.selected.dungeonId)) {
      state.selected.dungeonId = null;
    }
    if (state.selected.enemyId && !getEnemy(state.selected.enemyId)) {
      state.selected.enemyId = null;
    }
    if (state.selected.npcId && !getNpc(state.selected.npcId)) {
      state.selected.npcId = null;
    }
    if (state.selected.merchantId && !getNpc(state.selected.merchantId)) {
      state.selected.merchantId = null;
    }
    if (!state.selected.professionId || !state.player.professions.includes(state.selected.professionId)) {
      state.selected.professionId = state.player.professions[0] || null;
    }
    if (state.selected.recipeId) {
      const profession = getProfession(state.selected.professionId);
      const hasRecipe = (profession?.crafts || []).some((recipe) => recipe.itemId === state.selected.recipeId);
      if (!hasRecipe) {
        state.selected.recipeId = null;
      }
    }
    if (!screenRenderers[state.currentScreen]) {
      state.currentScreen = 'exploration';
    }
    state.logs = (state.logs || [])
      .filter((entry) => entry && typeof entry.message === 'string' && entry.type)
      .slice(-100);
  }

  function saveGame() {
    if (!storageSupported) return;
    if (saveTimer) {
      globalThis.clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (!state.player) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear saved game data.', error);
      }
      return;
    }
    const payload = {
      version: 1,
      player: state.player,
      currentScreen: state.currentScreen,
      selected: state.selected,
      travel: state.travel,
      logs: state.logs
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to save game state.', error);
    }
  }

  function scheduleSave() {
    if (!storageSupported || !state.player) return;
    if (saveTimer) return;
    saveTimer = globalThis.setTimeout(() => {
      saveTimer = null;
      saveGame();
    }, SAVE_DEBOUNCE_MS);
  }

  function setTrackedState(container, key, value, options = {}) {
    if (!container || Object.is(container[key], value)) return false;
    container[key] = value;
    if (!options.silent) {
      scheduleSave();
    }
    return true;
  }

  function createDefaultCombatState() {
    return {
      enemyId: null,
      context: null,
      active: false,
      turn: null,
      enemyHealth: 0,
      playerHealth: 0,
      playerMana: 0,
      guard: false,
      log: [],
      initiative: null
    };
  }

  function isLocalStorageSupported() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__ember_sigil_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('Local storage is not available.', error);
      return false;
    }
  }
})();
