(() => {
  const dataFiles = {
    classes: './data/classes.json',
    enemies: './data/enemies.json',
    zones: './data/zones.json',
    dungeons: './data/dungeons.json',
    landmarks: './data/landmarks.json',
    npcs: './data/npcs.json',
    items: './data/items.json',
    professions: './data/professions.json',
    quests: './data/quests.json'
  };

  const data = {};
  const dataIndex = {};

  const CAMP_SUPPLIES_ITEM_ID = 'camp_supplies';
  const TIME_SEGMENTS_PER_DAY = 4;
  const PASSIVE_HEALTH_REGEN_RATE = 0.05;
  const PASSIVE_MANA_REGEN_RATE = 0.06;
  const DEFAULT_INVENTORY_SLOT_COUNT = 24;
  const DEFAULT_MAX_STACK_SIZE = 1;

  const abilityLibrary = {
    'Arcane Surge': {
      usesPerRest: 3,
      manaCost: 22,
      damageMultiplier: 1.3,
      bonusDamage: 12,
      defenseMitigation: 0.15,
      minimumDamage: 11,
      description: 'Overcharge your spellwork, striking with +12 bonus lightning damage while cutting through 15% of enemy defenses.'
    },
    'Arrow Storm': {
      usesPerRest: 3,
      manaCost: 20,
      damageMultiplier: 1.3,
      bonusDamage: 6,
      defenseMitigation: 0.1,
      minimumDamage: 10,
      description: 'Blanket an area in arrows, adding +6 bonus damage and overwhelming foes even through 10% of their armor.'
    },
    'Bestial Bond': {
      usesPerRest: 2,
      manaCost: 16,
      damageMultiplier: 1.15,
      bonusDamage: 11,
      defenseMitigation: 0.18,
      minimumDamage: 9,
      description: 'Fight alongside your companion for +11 bonus damage while your combined assault ignores 18% of the target\'s defenses.'
    },
    'Bulwark': {
      usesPerRest: 2,
      manaCost: 14,
      damageMultiplier: 0.95,
      bonusDamage: 9,
      defenseMitigation: 0.25,
      minimumDamage: 8,
      description: 'Set your shield and counter with +9 bonus damage, shrugging off 25% of incoming defense as you hold the line.'
    },
    'Camouflaged Step': {
      usesPerRest: 3,
      manaCost: 12,
      damageMultiplier: 1.05,
      bonusDamage: 7,
      defenseMitigation: 0.22,
      minimumDamage: 7,
      description: 'Slip from cover to deliver +7 bonus damage, striking from the shadows while bypassing 22% of a foe\'s guard.'
    },
    "Guardian's Roar": {
      usesPerRest: 2,
      manaCost: 12,
      damageMultiplier: 1,
      bonusDamage: 7,
      defenseMitigation: 0.12,
      minimumDamage: 7,
      description: 'Unleash a rallying shout that deals steady damage (+7) and rattles foes enough to pierce 12% of their armor.'
    },
    'Lightning Coil': {
      usesPerRest: 3,
      manaCost: 18,
      damageMultiplier: 1.2,
      bonusDamage: 10,
      defenseMitigation: 0.12,
      minimumDamage: 10,
      description: 'Channel chained lightning for +10 bonus damage, ignoring 12% of the target\'s protection as the bolts arc.'
    },
    'Radiant Ward': {
      usesPerRest: 2,
      manaCost: 15,
      damageMultiplier: 0.95,
      bonusDamage: 8,
      defenseMitigation: 0.28,
      minimumDamage: 8,
      description: 'Erect a flare of light that deals +8 bonus damage while repelling 28% of an enemy\'s armor with consecrated force.'
    },
    'Revitalizing Hymn': {
      usesPerRest: 2,
      manaCost: 18,
      damageMultiplier: 1.05,
      bonusDamage: 9,
      defenseMitigation: 0.2,
      minimumDamage: 9,
      description: 'Sing a battle hymn for +9 bonus radiant damage, cutting through 20% of enemy defenses as faith steels your allies.'
    },
    'Shield Slam': {
      usesPerRest: 3,
      manaCost: 15,
      damageMultiplier: 1.1,
      bonusDamage: 8,
      defenseMitigation: 0.2,
      minimumDamage: 8,
      description: 'Drive your shield into the foe, adding +8 bonus damage and battering 20% of their defenses aside.'
    },
    'Shieldwall': {
      usesPerRest: 2,
      manaCost: 18,
      damageMultiplier: 0.85,
      bonusDamage: 6,
      defenseMitigation: 0.55,
      minimumDamage: 6,
      description: 'Lock shields with an explosive bash that still lands +6 bonus damage while shrugging off 55% of retaliation.'
    },
    'Solar Aegis': {
      usesPerRest: 2,
      manaCost: 18,
      damageMultiplier: 1,
      bonusDamage: 8,
      defenseMitigation: 0.28,
      minimumDamage: 9,
      description: 'Wreathe yourself in solar flame, striking for +8 bonus damage and burning through 28% of enemy armor.'
    },
    'Static Torrent': {
      usesPerRest: 2,
      manaCost: 24,
      damageMultiplier: 1.4,
      bonusDamage: 12,
      defenseMitigation: 0.05,
      minimumDamage: 14,
      description: 'Let loose a roaring torrent of lightning for +12 bonus damage, overwhelming foes even through heavy guard.'
    },
    'Sunlance': {
      usesPerRest: 3,
      manaCost: 16,
      damageMultiplier: 1.15,
      bonusDamage: 9,
      defenseMitigation: 0.15,
      minimumDamage: 9,
      description: 'Call down a spear of solar fire, lancing for +9 bonus damage and piercing 15% of protective wards.'
    },
    'Tempest Barrier': {
      usesPerRest: 2,
      manaCost: 16,
      damageMultiplier: 0.9,
      bonusDamage: 6,
      defenseMitigation: 0.35,
      minimumDamage: 8,
      description: 'Summon a whirling barrier that slams for +6 bonus damage while shunting 35% of enemy defense aside.'
    },
    'Twin Arrows': {
      usesPerRest: 3,
      manaCost: 14,
      damageMultiplier: 1.05,
      bonusDamage: 10,
      defenseMitigation: 0.18,
      minimumDamage: 8,
      description: 'Loose a pair of arrows for +10 bonus damage, threading past 18% of the target\'s armor.'
    }
  };

  const STORAGE_KEY = 'ember-sigil-save';
  const SAVE_DEBOUNCE_MS = 250;
  let saveTimer = null;
  const storageSupported = isLocalStorageSupported();

  const state = {
    player: null,
    currentScreen: 'character',
    previousScreen: 'character',
    selected: {
      npcId: null,
      merchantId: null,
      professionId: null,
      recipeId: null,
      abilityName: null
    },
    combat: createDefaultCombatState(),
    travel: createDefaultTravelState(),
    logs: [],
    feedback: createDefaultFeedbackState(),
    logOverlayOpen: false
  };

  const elements = {
    loading: document.getElementById('loading'),
    app: document.getElementById('app'),
    newGameModal: document.getElementById('newGameModal'),
    newGameForm: document.getElementById('newGameForm'),
    playerNameInput: document.getElementById('playerNameInput'),
    classSelect: document.getElementById('classSelect'),
    classDetails: document.getElementById('classDetails'),
    screenNav: document.getElementById('screenNav'),
    inventoryToggle: document.getElementById('inventoryToggle'),
    restButton: document.getElementById('restButton'),
    playerName: document.getElementById('playerName'),
    playerClass: document.getElementById('playerClass'),
    playerLevel: document.getElementById('playerLevel'),
    playerXp: document.getElementById('playerXp'),
    playerGold: document.getElementById('playerGold'),
    adventureDay: document.getElementById('adventureDay'),
    campSupplies: document.getElementById('campSuppliesValue'),
    healthBar: document.getElementById('healthBar'),
    healthValue: document.getElementById('healthValue'),
    manaBar: document.getElementById('manaBar'),
    manaValue: document.getElementById('manaValue'),
    playerStats: document.getElementById('playerStats'),
    playerAbilities: document.getElementById('playerAbilities'),
    playerPassives: document.getElementById('playerPassives'),
    talentTree: document.getElementById('talentTree'),
    talentTreeName: document.getElementById('talentTreeName'),
    talentPoints: document.getElementById('talentPoints'),
    talentFeedback: document.getElementById('talentFeedback'),
    playerProfessions: document.getElementById('playerProfessions'),
    playerEquipment: document.getElementById('playerEquipment'),
    inventoryPanel: document.getElementById('inventoryPanel'),
    inventoryList: document.getElementById('inventoryList'),
    questLogContent: document.getElementById('questLogContent'),
    logEntries: document.getElementById('logEntries'),
    travelCurrentZone: document.getElementById('travelCurrentZone'),
    travelDestinationSelect: document.getElementById('travelDestinationSelect'),
    travelDestinationDescription: document.getElementById('travelDestinationDescription'),
    travelDestinationMeta: document.getElementById('travelDestinationMeta'),
    travelDestinationLandmarks: document.getElementById('travelDestinationLandmarks'),
    travelDestinationHighlights: document.getElementById('travelDestinationHighlights'),
    travelDestinationThreats: document.getElementById('travelDestinationThreats'),
    travelFocusOptions: document.getElementById('travelFocusOptions'),
    beginTravelButton: document.getElementById('beginTravelButton'),
    travelAdvanceButton: document.getElementById('travelAdvanceButton'),
    cancelTravelButton: document.getElementById('cancelTravelButton'),
    travelStatus: document.getElementById('travelStatus'),
    travelProgressBar: document.getElementById('travelProgressBar'),
    travelEventLog: document.getElementById('travelEventLog'),
    travelFeedback: document.getElementById('travelFeedback'),
    currentLandmarkPanel: document.getElementById('currentLandmarkPanel'),
    currentLandmarkTitle: document.getElementById('currentLandmarkTitle'),
    currentLandmarkDescription: document.getElementById('currentLandmarkDescription'),
    currentLandmarkDetails: document.getElementById('currentLandmarkDetails'),
    currentLandmarkActions: document.getElementById('currentLandmarkActions'),
    currentLandmarkFeedback: document.getElementById('currentLandmarkFeedback'),
    combatCurrentZone: document.getElementById('combatCurrentZone'),
    enemyDetails: document.getElementById('enemyDetails'),
    combatActions: document.getElementById('combatActions'),
    combatStrikeButton: document.getElementById('combatStrikeButton'),
    combatAbilityButton: document.getElementById('combatAbilityButton'),
    combatGuardButton: document.getElementById('combatGuardButton'),
    combatFleeButton: document.getElementById('combatFleeButton'),
    combatStatus: document.getElementById('combatStatus'),
    combatLog: document.getElementById('combatLog'),
    npcSelect: document.getElementById('npcSelect'),
    npcDetails: document.getElementById('npcDetails'),
    townFeedback: document.getElementById('townFeedback'),
    talkToNpcButton: document.getElementById('talkToNpcButton'),
    requestQuestButton: document.getElementById('requestQuestButton'),
    roamTownButton: document.getElementById('roamTownButton'),
    tradingCurrentZone: document.getElementById('tradingCurrentZone'),
    merchantSelect: document.getElementById('merchantSelect'),
    merchantInfo: document.getElementById('merchantInfo'),
    tradeFeedback: document.getElementById('tradeFeedback'),
    merchantInventory: document.getElementById('merchantInventory'),
    sellInventory: document.getElementById('sellInventory'),
    refreshMerchantButton: document.getElementById('refreshMerchantButton'),
    professionSelect: document.getElementById('professionSelect'),
    professionDescription: document.getElementById('professionDescription'),
    professionGatherables: document.getElementById('professionGatherables'),
    professionRecipes: document.getElementById('professionRecipes'),
    professionFeedback: document.getElementById('professionFeedback'),
    gatherButton: document.getElementById('gatherButton'),
    craftButton: document.getElementById('craftButton'),
    recipeSelect: document.getElementById('recipeSelect'),
    inventoryItemTemplate: document.getElementById('inventoryItemTemplate'),
    recipeTemplate: document.getElementById('recipeTemplate'),
    combatScreen: document.getElementById('combatScreen'),
    townCurrentZone: document.getElementById('townCurrentZone'),
    logOverlay: document.getElementById('logOverlay'),
    logOverlayEntries: document.getElementById('logOverlayEntries'),
    logOverlayClose: document.getElementById('logOverlayClose')
  };

  elements.mainScreens = Array.from(document.querySelectorAll('.main-screen'));
  elements.navButtons = Array.from(elements.screenNav?.querySelectorAll('button[data-screen]') || []);

  const overlayToggleButtons = Array.from(document.querySelectorAll('.close-button'));

  const logTypes = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
  };

  const LOG_POPUP_DURATION = 6000;
  const LOG_POPUP_FADE_DURATION = 2500;
  const logPopupRegistry = new WeakMap();

  const feedbackDefaults = {
    travel: 'Plan your journeys and respond to what unfolds on the road.',
    profession: 'Work your trade to gather resources or craft items.',
    trade: 'Choose goods to buy or sell with the merchants.',
    town: 'Speak with residents, patrol the streets, or request help.',
    talent: 'Spend talent points to unlock new strengths for your hero.'
  };

  const equipmentSlotMap = {
    weapon: 'weapon',
    'off-hand': 'offHand',
    armor: 'armor',
    trinket: 'trinket'
  };

  const equipmentSlotLabels = {
    weapon: 'Weapon',
    offHand: 'Off-hand',
    armor: 'Armor',
    trinket: 'Trinket'
  };

  const screenRenderers = {
    character: renderCharacterScreen,
    professions: renderProfessionScreen,
    travel: renderTravelScreen,
    trade: renderTradeScreen,
    town: renderTownScreen,
    quests: renderQuestScreen,
    log: renderAdventureLogScreen
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
    dataIndex.landmarks = indexById(data.landmarks || []);
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

  function getFeedbackElement(channel) {
    if (channel === 'travel') return elements.travelFeedback;
    if (channel === 'profession') return elements.professionFeedback;
    if (channel === 'trade') return elements.tradeFeedback;
    if (channel === 'town') return elements.townFeedback;
    if (channel === 'talent') return elements.talentFeedback;
    return null;
  }

  function renderFeedback(channel) {
    const element = getFeedbackElement(channel);
    if (!element) return;
    const entry = state.feedback?.[channel] || null;
    const message = entry?.message?.trim() || feedbackDefaults[channel] || '';
    element.textContent = message;
    element.className = 'screen-feedback';
    if (entry?.message) {
      element.classList.add('active');
      if (entry.type) {
        element.classList.add(entry.type);
      }
    }
  }

  function setFeedback(channel, message, type = logTypes.INFO) {
    if (!channel || !message) return;
    if (!state.feedback) {
      state.feedback = createDefaultFeedbackState();
    }
    state.feedback[channel] = { message, type };
    renderFeedback(channel);
  }

  function clearFeedback(channel) {
    if (!channel) return;
    if (!state.feedback) {
      state.feedback = createDefaultFeedbackState();
    }
    state.feedback[channel] = null;
    renderFeedback(channel);
  }

  function initialiseUI() {
    elements.loading.classList.add('hidden');
    elements.app.classList.remove('hidden');
    setupNewGameForm();
    setupNavigation();
    setupOverlays();
    setupTravelControls();
    setupCombatControls();
    setupTownControls();
    setupTradingControls();
    setupProfessionControls();
    setupAbilitySelection();
    setupTalentControls();
    elements.restButton.addEventListener('click', restAtCamp);
    const restored = restoreSavedGame();
    if (!restored) {
      elements.newGameModal.classList.remove('hidden');
      addLog('World data loaded. Create your hero to begin.', logTypes.INFO);
    } else {
      addLog(`Welcome back, ${state.player.name}!`, logTypes.SUCCESS);
    }
    renderLog();
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
      .map((ability) => {
        const definition = getAbilityDefinition(ability);
        const detailSummary = getAbilityDetailSummary(definition);
        const detailLine = detailSummary
          ? `<span class=\"class-ability__meta\">${detailSummary}</span>`
          : '';
        const description = definition?.description
          ? `<span class=\"class-ability__description\">${definition.description}</span>`
          : '';
        return `
          <li>
            <span class=\"class-ability__name\">${ability}</span>
            ${detailLine}
            ${description}
          </li>
        `;
      })
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
    state.feedback = createDefaultFeedbackState();
    sanitizeSelectedAbility();
    setTravelDestination('zone', state.player.location.zoneId, { silent: true });
    elements.newGameModal.classList.add('hidden');
    addLog(`Welcome, ${state.player.name} the ${getClass(classId).name}!`, logTypes.SUCCESS);
    updateAllUI();
    showScreen('character');
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
      inventory: [],
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
        zoneId: data.zones[0]?.id || null,
        landmarkId: null
      },
      timeline: {
        day: 1,
        segments: 0
      },
      abilityUses: {},
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
    ensureTalentState(player);
    syncResourceCaps(player);
    resetAbilityUses(player);
    return player;
  }

  function setupNavigation() {
    if (!elements.screenNav) return;
    elements.screenNav.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-screen]');
      if (!button || button.disabled) return;
      showScreen(button.dataset.screen);
    });
    updateNavigationLocks();
  }

  function updateNavigationLocks() {
    const inCombat = state.combat.active;
    elements.navButtons.forEach((button) => {
      const locked = Boolean(inCombat);
      button.disabled = locked;
      button.classList.toggle('locked', locked);
    });
  }

  function setupOverlays() {
    elements.inventoryToggle?.addEventListener('click', () => toggleOverlay(elements.inventoryPanel, true));
    elements.logOverlayClose?.addEventListener('click', () => hideLogOverlay());
    overlayToggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.close;
        const panel = targetId ? document.getElementById(targetId) : button.closest('.overlay-panel');
        toggleOverlay(panel, false);
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        [elements.inventoryPanel].forEach((panel) => toggleOverlay(panel, false));
        hideLogOverlay();
      }
    });
    elements.inventoryList.addEventListener('click', (event) => {
      const equipButton = event.target.closest('[data-equip-item]');
      if (equipButton && state.player) {
        const slotIndex = Number.parseInt(equipButton.dataset.slotIndex, 10);
        equipItem(
          equipButton.dataset.equipItem,
          Number.isNaN(slotIndex) ? null : slotIndex
        );
        return;
      }
      const useButton = event.target.closest('[data-use-item]');
      if (!useButton || !state.player) return;
      const slotIndex = Number.parseInt(useButton.dataset.slotIndex, 10);
      useItem(useButton.dataset.useItem, Number.isNaN(slotIndex) ? null : slotIndex);
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
      const value = elements.travelDestinationSelect.value;
      const parsed = parseDestinationValue(value);
      if (parsed) {
        setTravelDestination(parsed.type, parsed.id);
      }
      renderTravelDestination();
      renderTravelJourney();
    });
    elements.travelFocusOptions?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-focus]');
      if (!button) return;
      setTravelFocus(button.dataset.focus);
    });
    elements.beginTravelButton?.addEventListener('click', beginJourney);
    elements.travelAdvanceButton?.addEventListener('click', advanceJourneyTurn);
    elements.cancelTravelButton?.addEventListener('click', cancelJourney);
    elements.currentLandmarkActions?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-landmark-action]');
      if (!button) return;
      handleLandmarkAction(button.dataset.landmarkAction);
    });
  }

  function setupCombatControls() {
    elements.combatStrikeButton?.addEventListener('click', () => takeCombatAction('strike'));
    elements.combatAbilityButton?.addEventListener('click', () => takeCombatAction('ability'));
    elements.combatGuardButton?.addEventListener('click', () => takeCombatAction('guard'));
    elements.combatFleeButton?.addEventListener('click', () => takeCombatAction('flee'));
  }

  function setupTownControls() {
    elements.npcSelect?.addEventListener('change', () => {
      const changed = setTrackedState(state.selected, 'npcId', elements.npcSelect.value);
      renderNpcDetails(state.selected.npcId);
      if (changed) {
        clearFeedback('town');
      }
    });
    elements.talkToNpcButton?.addEventListener('click', talkToNpc);
    elements.requestQuestButton?.addEventListener('click', requestQuestFromNpc);
    elements.roamTownButton?.addEventListener('click', roamTown);
  }

  function setupTradingControls() {
    elements.merchantSelect.addEventListener('change', () => {
      if (!ensureCanAct('trade during combat')) {
        setFeedback('trade', 'You cannot trade during combat!', logTypes.WARNING);
        elements.merchantSelect.value = state.selected.merchantId || '';
        return;
      }
      const changed = setTrackedState(state.selected, 'merchantId', elements.merchantSelect.value);
      if (changed) {
        clearFeedback('trade');
      }
      renderTradeScreen();
    });
    elements.refreshMerchantButton.addEventListener('click', () => {
      if (!ensureCanAct('negotiate with merchants')) {
        setFeedback('trade', 'You cannot negotiate with merchants while engaged in combat!', logTypes.WARNING);
        return;
      }
      if (!state.selected.merchantId) return;
      const message = 'The merchant refreshes their stock with new wares.';
      addLog(message, logTypes.INFO);
      setFeedback('trade', message, logTypes.INFO);
      renderTradeScreen(true);
    });
  }

  function setupProfessionControls() {
    elements.professionSelect.addEventListener('change', () => {
      const changed = setTrackedState(state.selected, 'professionId', elements.professionSelect.value);
      setTrackedState(state.selected, 'recipeId', null);
      if (changed) {
        clearFeedback('profession');
      }
      renderProfessionPanel();
    });
    elements.recipeSelect.addEventListener('change', () => {
      setTrackedState(state.selected, 'recipeId', elements.recipeSelect.value);
      clearFeedback('profession');
    });
    elements.gatherButton.addEventListener('click', gatherResources);
    elements.craftButton.addEventListener('click', () => {
      if (!state.selected.recipeId) {
        const warning = 'Select a recipe before attempting to craft.';
        addLog(warning, logTypes.WARNING);
        setFeedback('profession', warning, logTypes.WARNING);
        return;
      }
      craftRecipe(state.selected.recipeId);
    });
  }

  function setupAbilitySelection() {
    if (!elements.playerAbilities) return;
    elements.playerAbilities.addEventListener('click', (event) => {
      const button = event.target.closest('[data-ability-name]');
      if (!button) return;
      const abilityName = button.dataset.abilityName;
      if (!abilityName || !state.player?.abilities?.includes(abilityName)) return;
      if (setTrackedState(state.selected, 'abilityName', abilityName)) {
        renderPlayerAbilities();
        renderCombatState();
        scheduleSave();
      }
    });
  }

  function setupTalentControls() {
    if (!elements.talentTree) return;
    elements.talentTree.addEventListener('click', (event) => {
      const button = event.target.closest('[data-talent-node]');
      if (!button || button.disabled) return;
      unlockTalent(button.dataset.talentNode);
    });
  }
  function toggleOverlay(panel, open) {
    if (!panel) return;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function openCombatScreen() {
    if (!elements.combatScreen) return;
    elements.combatScreen.classList.add('active');
    elements.combatScreen.setAttribute('aria-hidden', 'false');
  }

  function closeCombatScreen() {
    if (!elements.combatScreen) return;
    elements.combatScreen.classList.remove('active');
    elements.combatScreen.setAttribute('aria-hidden', 'true');
  }

  function showScreen(screenId) {
    if (!screenRenderers[screenId]) return;
    if (state.combat.active) {
      addLog('You are locked in combat and cannot switch activities.', logTypes.WARNING);
      return;
    }
    if (screenId === 'log') {
      state.logOverlayOpen = false;
    }
    state.currentScreen = screenId;
    state.previousScreen = screenId;
    elements.navButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.screen === screenId);
    });
    elements.mainScreens.forEach((screen) => {
      screen.classList.toggle('active', screen.id === `screen-${screenId}`);
    });
    screenRenderers[screenId]();
    updateLogOverlayVisibility();
    updateNavigationLocks();
  }

  function updateAllUI() {
    if (!state.player) return;
    syncResourceCaps(state.player);
    updatePlayerPanel();
    renderCharacterScreen();
    renderProfessionScreen();
    renderTravelScreen();
    renderTradeScreen();
    renderTownScreen();
    renderQuestScreen();
    renderLog();
    renderCombatState();
    renderInventory();
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
    ensureTalentState(player);
    const playerClass = getClass(player.classId);
    const maxHealth = getTotalStat(player, 'health');
    const maxMana = getTotalStat(player, 'mana');
    const timeline = ensureTimeline(player);
    ensureAbilityState(player);
    sanitizeSelectedAbility();
    elements.playerName.textContent = player.name;
    elements.playerClass.textContent = playerClass?.name || '-';
    elements.playerLevel.textContent = player.level;
    elements.playerXp.textContent = `${player.xp} / ${player.xpToLevel}`;
    elements.playerGold.textContent = `${player.gold}`;
    if (elements.adventureDay) {
      elements.adventureDay.textContent = `${timeline.day}`;
    }
    if (elements.campSupplies) {
      elements.campSupplies.textContent = `${getInventoryItemCount(player, CAMP_SUPPLIES_ITEM_ID)}`;
    }
    updateResourceBar(elements.healthBar, elements.healthValue, player.resources.health, maxHealth);
    updateResourceBar(elements.manaBar, elements.manaValue, player.resources.mana, maxMana);
    renderPlayerStats();
    renderPlayerAbilities();
    renderPlayerPassives();
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
        const bonus = diff !== 0 ? ` (<span class="bonus">${diff > 0 ? '+' : ''}${diff}</span>)` : '';
        return `<li>${toTitle(stat)}: ${total}${bonus}</li>`;
      })
      .join('');
  }

  function getAbilityDetailSummary(definition) {
    if (!definition) return '';
    const parts = [];
    if (Number.isFinite(definition.damageMultiplier)) {
      parts.push(`${Math.round(definition.damageMultiplier * 100)}% weapon power`);
    }
    if (Number.isFinite(definition.bonusDamage) && definition.bonusDamage !== 0) {
      parts.push(`+${Math.round(definition.bonusDamage)} bonus damage`);
    }
    if (Number.isFinite(definition.defenseMitigation) && definition.defenseMitigation > 0) {
      parts.push(`Ignores ${Math.round(definition.defenseMitigation * 100)}% defense`);
    }
    if (Number.isFinite(definition.minimumDamage) && definition.minimumDamage > 0) {
      parts.push(`Minimum ${Math.round(definition.minimumDamage)} damage`);
    }
    return parts.join(' • ');
  }

  function renderPlayerAbilities() {
    const player = state.player;
    if (!player) {
      elements.playerAbilities.innerHTML = '<li>No abilities learned yet.</li>';
      return;
    }
    ensureAbilityState(player);
    sanitizeSelectedAbility();
    const abilities = player.abilities || [];
    if (!abilities.length) {
      elements.playerAbilities.innerHTML = '<li>No abilities learned yet.</li>';
      return;
    }
    const activeAbility = getActiveAbilityName();
    const items = abilities
      .map((abilityName) => {
        const definition = getAbilityDefinition(abilityName);
        const usesPerRest = definition?.usesPerRest;
        const usesRemaining = getAbilityUsesRemaining(abilityName);
        const usesLabel = Number.isFinite(usesPerRest)
          ? `${usesRemaining}/${usesPerRest} uses per rest`
          : 'At-will';
        const manaCost = getAbilityManaCostForPlayer(player, definition);
        const manaLabel = Number.isFinite(manaCost) ? `${manaCost} mana` : 'mana cost varies';
        const detailSummary = getAbilityDetailSummary(definition);
        const detailLine = detailSummary
          ? `<span class="ability-entry__details">${detailSummary}</span>`
          : '';
        const description = definition?.description
          ? `<span class="ability-entry__description">${definition.description}</span>`
          : '';
        const activeClass = abilityName === activeAbility ? ' active' : '';
        const statusBadge = abilityName === activeAbility
          ? '<span class="ability-entry__badge">Active</span>'
          : '';
        return `
          <li>
            <button type="button" class="ability-entry${activeClass}" data-ability-name="${abilityName}">
              <span class="ability-entry__name">${abilityName}</span>
              <span class="ability-entry__meta">${usesLabel} • ${manaLabel}</span>
              ${detailLine}
              ${description}
              ${statusBadge}
            </button>
          </li>
        `;
      })
      .join('');
    elements.playerAbilities.innerHTML = items;
  }

  function renderPlayerPassives() {
    if (!elements.playerPassives) return;
    const player = state.player;
    if (!player) {
      elements.playerPassives.innerHTML = '<li class="empty">Unlock talents to gain passive effects.</li>';
      return;
    }
    const passives = getPlayerTalentNodes(player)
      .filter((node) => node?.passive?.name)
      .sort((a, b) => {
        const tierDiff = (a?.tier ?? 99) - (b?.tier ?? 99);
        if (tierDiff !== 0) return tierDiff;
        const orderDiff = (a?.order ?? 0) - (b?.order ?? 0);
        if (orderDiff !== 0) return orderDiff;
        return (a?.name || '').localeCompare(b?.name || '');
      });
    if (!passives.length) {
      elements.playerPassives.innerHTML = '<li class="empty">Unlock talents to gain passive effects.</li>';
      return;
    }
    elements.playerPassives.innerHTML = passives
      .map((node) => {
        const tierLabel = Number.isFinite(node?.tier) ? `Tier ${node.tier}` : 'Talent';
        const meta = `${tierLabel} • ${node?.name || 'Unknown Source'}`;
        const description = node.passive.description || 'No description provided yet.';
        return `
          <li class="passive-entry">
            <span class="passive-entry__meta">${meta}</span>
            <span class="passive-entry__name">${node.passive.name}</span>
            <span class="passive-entry__description">${description}</span>
          </li>
        `;
      })
      .join('');
  }

  function renderTalentPanel() {
    if (!elements.talentTree) return;
    const player = state.player;
    if (!player) {
      elements.talentTree.innerHTML = '<p class="empty">Create a hero to view talents.</p>';
      if (elements.talentPoints) {
        elements.talentPoints.textContent = '0';
      }
      if (elements.talentTreeName) {
        elements.talentTreeName.textContent = 'No discipline';
      }
      renderFeedback('talent');
      return;
    }
    ensureTalentState(player);
    const tree = getPlayerTalentTree(player);
    const talents = player.talents;
    if (elements.talentPoints) {
      elements.talentPoints.textContent = `${talents.points}`;
    }
    if (elements.talentTreeName) {
      elements.talentTreeName.textContent = tree?.name || 'No recorded path';
    }
    if (!tree || !(tree.nodes || []).length) {
      elements.talentTree.innerHTML = '<p class="empty">This class has no talents configured yet.</p>';
      renderFeedback('talent');
      return;
    }
    const grouped = groupTalentsByTier(tree.nodes || []);
    const tierMarkup = grouped
      .map(({ tier, nodes }) => {
        const nodesMarkup = nodes.map((node) => renderTalentNode(player, node)).join('');
        return `
          <section class="talent-tier" data-tier="${tier}">
            <header class="talent-tier__header">
              <h4>Tier ${tier}</h4>
            </header>
            <div class="talent-tier__nodes">
              ${nodesMarkup || '<p class="empty">No talents in this tier.</p>'}
            </div>
          </section>
        `;
      })
      .join('');
    elements.talentTree.innerHTML = tierMarkup || '<p class="empty">No talents available.</p>';
    renderFeedback('talent');
  }

  function renderTalentNode(player, node) {
    const talents = player.talents || { selections: [], points: 0, spent: 0 };
    const unlocked = talents.selections.includes(node.id);
    const cost = Math.max(1, Math.floor(node.cost ?? 1));
    const unmetRequirements = getUnmetTalentRequirements(player, node);
    const hasPoints = talents.points >= cost;
    const available = !unlocked && hasPoints && !unmetRequirements.length;
    const statusText = unlocked
      ? 'Unlocked'
      : available
      ? `Unlock for ${cost} point${cost !== 1 ? 's' : ''}`
      : unmetRequirements.length
      ? `Requires: ${unmetRequirements.join(', ')}`
      : `Need ${cost} point${cost !== 1 ? 's' : ''}`;
    const typeLabel = node.type ? toTitle(node.type) : 'Talent';
    const metaParts = [`Cost: ${cost} point${cost !== 1 ? 's' : ''}`];
    if (node.minLevel) {
      metaParts.push(`Level ${node.minLevel}`);
    }
    if (node.minSpent) {
      metaParts.push(`${node.minSpent} point${node.minSpent !== 1 ? 's' : ''} spent`);
    }
    if ((node.requires || []).length) {
      const requiredNames = (node.requires || [])
        .map((id) => getTalentNodeDefinition(player, id)?.name || toTitle(id))
        .join(', ');
      metaParts.push(`Requires ${requiredNames}`);
    }
    const description = node.description
      ? `<p class="talent-node__description">${node.description}</p>`
      : '';
    const passiveNote = node.passive?.description
      ? `<p class="talent-node__passive">${node.passive.description}</p>`
      : '';
    const classes = ['talent-node'];
    if (unlocked) {
      classes.push('talent-node--unlocked');
    } else if (available) {
      classes.push('talent-node--available');
    } else {
      classes.push('talent-node--locked');
    }
    return `
      <button type="button" class="${classes.join(' ')}" data-talent-node="${node.id}" ${
        unlocked ? 'disabled' : ''
      }>
        <span class="talent-node__type">${typeLabel}</span>
        <span class="talent-node__name">${node.name}</span>
        ${description}
        ${passiveNote}
        <span class="talent-node__meta">${metaParts.join(' • ')}</span>
        <span class="talent-node__status">${statusText}</span>
      </button>
    `;
  }

  function groupTalentsByTier(nodes) {
    const tiers = new Map();
    nodes.forEach((node) => {
      const tier = Number.isFinite(node.tier) ? node.tier : 1;
      if (!tiers.has(tier)) {
        tiers.set(tier, []);
      }
      tiers.get(tier).push(node);
    });
    return Array.from(tiers.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([tier, tierNodes]) => ({
        tier,
        nodes: tierNodes.sort((a, b) => {
          const orderA = Number.isFinite(a.order) ? a.order : 0;
          const orderB = Number.isFinite(b.order) ? b.order : 0;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          return (a.name || '').localeCompare(b.name || '');
        })
      }));
  }

  function unlockTalent(nodeId) {
    const player = state.player;
    if (!player || !nodeId) return;
    ensureTalentState(player);
    const node = getTalentNodeDefinition(player, nodeId);
    if (!node) {
      setFeedback('talent', 'That talent could not be found.', logTypes.WARNING);
      return;
    }
    if (player.talents.selections.includes(nodeId)) {
      setFeedback('talent', 'You have already mastered that talent.', logTypes.INFO);
      return;
    }
    const cost = Math.max(1, Math.floor(node.cost ?? 1));
    const unmet = getUnmetTalentRequirements(player, node);
    if (unmet.length) {
      const message = `You must satisfy: ${unmet.join(', ')}.`;
      setFeedback('talent', message, logTypes.WARNING);
      return;
    }
    const availablePoints = Math.floor(player.talents.points || 0);
    if (availablePoints < cost) {
      const missing = cost - availablePoints;
      const message = `You need ${missing} more talent point${missing !== 1 ? 's' : ''}.`;
      setFeedback('talent', message, logTypes.WARNING);
      return;
    }
    player.talents.selections.push(nodeId);
    player.talents.points = Math.max(0, availablePoints - cost);
    player.talents.spent = Math.max(0, Math.floor((player.talents.spent || 0) + cost));
    const messages = [`Talent learned: ${node.name}.`];
    const grantedAbilities = Array.isArray(node.grantAbility)
      ? node.grantAbility
      : node.grantAbility
      ? [node.grantAbility]
      : [];
    const newAbilities = [];
    grantedAbilities.forEach((abilityName) => {
      if (!abilityName) return;
      if (!player.abilities.includes(abilityName)) {
        player.abilities.push(abilityName);
        newAbilities.push(abilityName);
      }
    });
    if (newAbilities.length) {
      ensureAbilityState(player);
      resetAbilityUses(player);
      setTrackedState(state.selected, 'abilityName', newAbilities[newAbilities.length - 1]);
      messages.push(`New ability learned: ${newAbilities.join(', ')}.`);
    }
    if (node.statBonuses) {
      const statSummary = Object.entries(node.statBonuses)
        .map(([stat, value]) => `${toTitle(stat)} ${value >= 0 ? '+' : ''}${value}`)
        .join(', ');
      if (statSummary) {
        messages.push(`Stat bonuses unlocked: ${statSummary}.`);
      }
    }
    if (node.passive?.name) {
      messages.push(`Passive unlocked: ${node.passive.name}.`);
    }
    const summary = messages.join(' ');
    addLog(summary, logTypes.SUCCESS);
    setFeedback('talent', summary, logTypes.SUCCESS);
    syncResourceCaps(player);
    sanitizeSelectedAbility();
    renderTalentPanel();
    updatePlayerPanel();
    scheduleSave();
  }

  function getUnmetTalentRequirements(player, node) {
    const requirements = [];
    if (!player || !node) return requirements;
    const talents = player.talents || { selections: [], spent: 0 };
    if (node.minLevel && player.level < node.minLevel) {
      requirements.push(`Level ${node.minLevel}`);
    }
    if (node.minSpent && (talents.spent || 0) < node.minSpent) {
      requirements.push(`${node.minSpent} point${node.minSpent !== 1 ? 's' : ''} spent`);
    }
    (node.requires || []).forEach((requirementId) => {
      if (!talents.selections.includes(requirementId)) {
        const requirementNode = getTalentNodeDefinition(player, requirementId);
        requirements.push(requirementNode?.name || toTitle(requirementId));
      }
    });
    return requirements;
  }

  function renderPlayerProfessions() {
    const player = state.player;
    if (!player) {
      elements.playerProfessions.innerHTML = '<li>No professions trained.</li>';
      return;
    }
    const professions = player.professions || [];
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

  function renderCharacterScreen() {
    renderTalentPanel();
  }

  function renderProfessionScreen() {
    renderPlayerProfessions();
    renderProfessionPanel();
  }

  function renderTravelScreen() {
    populateTravelDestinations();
    const currentLocation = getCurrentLocation();
    if (elements.travelCurrentZone) {
      elements.travelCurrentZone.textContent = getLocationName(currentLocation) || 'Uncharted Wilds';
    }
    const ensuredDestination = ensureTravelDestination(currentLocation);
    if (elements.travelDestinationSelect && ensuredDestination) {
      elements.travelDestinationSelect.value = buildDestinationValue(ensuredDestination.type, ensuredDestination.id);
    }
    renderTravelDestination();
    updateTravelFocusButtons();
    renderTravelJourney();
    renderTravelEventLog();
    renderCurrentLandmarkPanel();
    renderFeedback('travel');
    if (elements.beginTravelButton) {
      elements.beginTravelButton.disabled = state.combat.active || Boolean(state.travel.journey);
    }
    if (elements.travelAdvanceButton) {
      elements.travelAdvanceButton.disabled =
        state.combat.active || !state.travel.journey || state.travel.journey.pausedForCombat;
    }
    if (elements.cancelTravelButton) {
      elements.cancelTravelButton.disabled = !state.travel.journey;
    }
  }

  function populateTravelDestinations() {
    if (!elements.travelDestinationSelect || !Array.isArray(data.zones)) return;
    const currentLocation = getCurrentLocation();
    const sections = [];
    const zoneOptions = data.zones
      .map((zone) => `<option value="${buildDestinationValue('zone', zone.id)}">${zone.name}</option>`)
      .join('');
    sections.push(`<optgroup label="Settlements">${zoneOptions}</optgroup>`);
    const accessibleLandmarks = getLandmarksAccessibleFrom(currentLocation);
    if (accessibleLandmarks.length) {
      const landmarkOptions = accessibleLandmarks
        .map(
          (landmark) =>
            `<option value="${buildDestinationValue('landmark', landmark.id)}">Landmark: ${landmark.name}</option>`
        )
        .join('');
      sections.push(`<optgroup label="Landmarks">${landmarkOptions}</optgroup>`);
    }
    elements.travelDestinationSelect.innerHTML = sections.join('');
  }

  function renderTravelDestination() {
    if (!elements.travelDestinationDescription) return;
    const currentLocation = getCurrentLocation();
    const destination = ensureTravelDestination(currentLocation);
    if (!destination) {
      elements.travelDestinationDescription.textContent = 'Select a destination to review travel notes.';
      elements.travelDestinationMeta.innerHTML = '';
      elements.travelDestinationHighlights.innerHTML = '';
      elements.travelDestinationThreats.innerHTML = '';
      if (elements.travelDestinationLandmarks) {
        elements.travelDestinationLandmarks.innerHTML = '<li>No mapped landmarks along this path.</li>';
      }
      return;
    }
    const location = getLocationByType(destination.type, destination.id);
    if (!location) {
      elements.travelDestinationDescription.textContent = 'Select a destination to review travel notes.';
      elements.travelDestinationMeta.innerHTML = '';
      elements.travelDestinationHighlights.innerHTML = '';
      elements.travelDestinationThreats.innerHTML = '';
      if (elements.travelDestinationLandmarks) {
        elements.travelDestinationLandmarks.innerHTML = '<li>No mapped landmarks along this path.</li>';
      }
      return;
    }
    if (elements.travelDestinationSelect) {
      elements.travelDestinationSelect.value = buildDestinationValue(location.type, location.id);
    }
    if (location.type === 'zone') {
      const zone = location.data;
      elements.travelDestinationDescription.textContent = zone?.description || 'Uncharted territory awaits.';
      const [minLevel, maxLevel] = zone?.levelRange || ['?', '?'];
      elements.travelDestinationMeta.innerHTML = `
        <li>Climate: ${zone?.climate || 'Unknown'}</li>
        <li>Level Range: ${minLevel} - ${maxLevel}</li>
      `;
      elements.travelDestinationHighlights.innerHTML = (zone?.pointsOfInterest || [])
        .map((poi) => `<li>${poi}</li>`)
        .join('') || '<li>No notable landmarks recorded.</li>';
      const enemyList = (zone?.enemyIds || [])
        .map((enemyId) => getEnemy(enemyId)?.name || enemyId)
        .join('</li><li>');
      elements.travelDestinationThreats.innerHTML = enemyList
        ? `<li>${enemyList}</li>`
        : '<li>No known threats.</li>';
    } else {
      const landmark = location.data;
      elements.travelDestinationDescription.textContent = landmark?.description || 'An unmarked landmark awaits.';
      const connections = (landmark?.connectedZoneIds || [])
        .map((zoneId) => getZone(zoneId)?.name || toTitle(zoneId))
        .join(', ') || 'Unknown';
      elements.travelDestinationMeta.innerHTML = `
        <li>Category: ${toTitle(landmark?.category || 'landmark')}</li>
        <li>Connected Settlements: ${connections}</li>
      `;
      elements.travelDestinationHighlights.innerHTML = (landmark?.pointsOfInterest || [])
        .map((poi) => `<li>${poi}</li>`)
        .join('') || '<li>No notable features recorded.</li>';
      const enemyList = (landmark?.enemyIds || [])
        .map((enemyId) => getEnemy(enemyId)?.name || enemyId)
        .join('</li><li>');
      elements.travelDestinationThreats.innerHTML = enemyList
        ? `<li>${enemyList}</li>`
        : '<li>No major threats observed.</li>';
    }
    renderRouteLandmarks(currentLocation, location);
  }

  function renderRouteLandmarks(origin, destination) {
    if (!elements.travelDestinationLandmarks) return;
    const waypoints = getLandmarksBetween(origin, destination);
    if (!waypoints.length) {
      elements.travelDestinationLandmarks.innerHTML = '<li>No mapped landmarks along this path.</li>';
      return;
    }
    elements.travelDestinationLandmarks.innerHTML = waypoints
      .map((landmark) => `<li>${landmark.name}</li>`)
      .join('');
  }

  function renderTravelJourney() {
    const journey = state.travel.journey;
    if (!journey) {
      if (elements.travelStatus) {
        elements.travelStatus.textContent = 'No active journey. Choose a destination and begin your travels.';
      }
      if (elements.travelProgressBar) {
        elements.travelProgressBar.style.width = '0%';
      }
      return;
    }
    const destination = getLocationByType(journey.destination?.type, journey.destination?.id);
    const totalSteps = Math.max(1, journey.totalSteps || 1);
    const progress = clamp(journey.progress / totalSteps, 0, 1) * 100;
    if (elements.travelProgressBar) {
      elements.travelProgressBar.style.width = `${progress}%`;
    }
    if (elements.travelStatus) {
      const focusLabel = journey.focus === 'gathering' ? 'Gathering' : journey.focus === 'combat' ? 'Seeking Battle' : 'Balanced';
      const statusLines = [
        `Journey to ${getLocationName(destination) || 'an unknown destination'} — ${journey.progress}/${totalSteps} turns completed.`,
        `Current focus: ${focusLabel}.`
      ];
      if (journey.pausedForCombat) {
        statusLines.push('Travel is paused until the current combat is resolved.');
      } else if (journey.pendingArrival) {
        statusLines.push('Arrival is imminent once the road is clear.');
      }
      elements.travelStatus.innerHTML = statusLines.map((line) => `<p>${line}</p>`).join('');
    }
  }

  function renderTravelEventLog() {
    if (!elements.travelEventLog) return;
    if (!state.travel.events?.length) {
      elements.travelEventLog.innerHTML = '<p>No recent travel events.</p>';
      return;
    }
    elements.travelEventLog.innerHTML = state.travel.events
      .map((entry) => `<div class="log-entry ${entry.type}">${entry.message}</div>`)
      .join('');
  }

  function setTravelFocus(focus) {
    if (!focus || !['balanced', 'gathering', 'combat'].includes(focus)) {
      return;
    }
    if (state.travel.focus === focus) {
      updateTravelFocusButtons();
      return;
    }
    state.travel.focus = focus;
    updateTravelFocusButtons();
    const focusLabel =
      focus === 'gathering' ? 'Gathering' : focus === 'combat' ? 'Hunting' : 'Balanced';
    setFeedback('travel', `Travel focus set to ${focusLabel}.`, logTypes.INFO);
    scheduleSave();
  }

  function updateTravelFocusButtons() {
    if (!elements.travelFocusOptions) return;
    Array.from(elements.travelFocusOptions.querySelectorAll('button[data-focus]')).forEach((button) => {
      button.classList.toggle('active', button.dataset.focus === state.travel.focus);
    });
  }

  function getTravelDestination() {
    if (!state.travel.destination || typeof state.travel.destination !== 'object') {
      state.travel.destination = { type: 'zone', id: null };
    }
    if (!['zone', 'landmark'].includes(state.travel.destination.type)) {
      state.travel.destination.type = 'zone';
    }
    return state.travel.destination;
  }

  function setTravelDestination(type, id, options = {}) {
    const destination = getTravelDestination();
    const nextType = type && ['zone', 'landmark'].includes(type) ? type : 'zone';
    const nextId = id || null;
    if (destination.type === nextType && destination.id === nextId) {
      return false;
    }
    state.travel.destination = { type: nextType, id: nextId };
    if (!options.silent) {
      scheduleSave();
    }
    return true;
  }

  function ensureTravelDestination(currentLocation) {
    const destination = getTravelDestination();
    const resolved = getLocationByType(destination.type, destination.id);
    if (resolved) {
      return resolved;
    }
    let fallbackZoneId = state.player?.location?.zoneId || data.zones[0]?.id || null;
    if (currentLocation?.type === 'zone') {
      fallbackZoneId = currentLocation.id;
    } else if (currentLocation?.type === 'landmark') {
      fallbackZoneId = (currentLocation.data?.connectedZoneIds || []).find((zoneId) => getZone(zoneId)) || fallbackZoneId;
    }
    if (fallbackZoneId) {
      setTravelDestination('zone', fallbackZoneId, { silent: true });
      return getLocationByType('zone', fallbackZoneId);
    }
    return null;
  }

  function buildDestinationValue(type, id) {
    if (!type || !id) return '';
    return `${type}:${id}`;
  }

  function parseDestinationValue(value) {
    if (typeof value !== 'string') return null;
    const [type, ...rest] = value.split(':');
    const id = rest.join(':');
    if (!type || !id) return null;
    if (!['zone', 'landmark'].includes(type)) return null;
    return { type, id };
  }

  function getLocationByType(type, id) {
    if (!type || !id) return null;
    if (type === 'zone') {
      const zone = getZone(id);
      return zone ? { type: 'zone', id: zone.id, data: zone } : null;
    }
    if (type === 'landmark') {
      const landmark = getLandmark(id);
      return landmark ? { type: 'landmark', id: landmark.id, data: landmark } : null;
    }
    return null;
  }

  function getCurrentLocation() {
    if (!state.player || !state.player.location) return null;
    const landmarkId = state.player.location.landmarkId;
    if (landmarkId) {
      const landmark = getLandmark(landmarkId);
      if (landmark) {
        return { type: 'landmark', id: landmark.id, data: landmark };
      }
    }
    const zoneId = state.player.location.zoneId || data.zones[0]?.id || null;
    const zone = zoneId ? getZone(zoneId) : null;
    return zone ? { type: 'zone', id: zone.id, data: zone } : null;
  }

  function isSameLocation(a, b) {
    if (!a || !b) return false;
    return a.type === b.type && a.id === b.id;
  }

  function getLocationName(location) {
    if (!location) return null;
    if (location.type === 'landmark') {
      return `${location.data?.name || toTitle(location.id)} (Landmark)`;
    }
    return location.data?.name || toTitle(location.id);
  }

  function getConnectedZoneIdsForLocation(location) {
    if (!location) return [];
    if (location.type === 'zone') {
      return [location.id].filter(Boolean);
    }
    if (location.type === 'landmark') {
      return (location.data?.connectedZoneIds || []).filter(Boolean);
    }
    return [];
  }

  function getLandmarksAccessibleFrom(location) {
    if (!Array.isArray(data.landmarks) || !data.landmarks.length) return [];
    if (!location) return [];
    const connected = new Set(getConnectedZoneIdsForLocation(location));
    if (!connected.size) return [];
    return data.landmarks.filter((landmark) =>
      (landmark.connectedZoneIds || []).some((zoneId) => connected.has(zoneId))
    );
  }

  function getLandmarksBetween(origin, destination) {
    if (!Array.isArray(data.landmarks) || !data.landmarks.length) return [];
    if (!origin || !destination) return [];
    const originZones = new Set(getConnectedZoneIdsForLocation(origin));
    const destinationZones = new Set(getConnectedZoneIdsForLocation(destination));
    if (!originZones.size || !destinationZones.size) return [];
    return data.landmarks.filter((landmark) => {
      if ((origin.type === 'landmark' && landmark.id === origin.id) || (destination.type === 'landmark' && landmark.id === destination.id)) {
        return false;
      }
      const connections = landmark.connectedZoneIds || [];
      const touchesOrigin = connections.some((zoneId) => originZones.has(zoneId));
      const touchesDestination = connections.some((zoneId) => destinationZones.has(zoneId));
      return touchesOrigin && touchesDestination;
    });
  }

  function uniqueArray(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function getLocationTravelProfile(location) {
    if (!location) {
      return { enemyIds: [], gatherables: [], npcIds: [], pointsOfInterest: [] };
    }
    if (location.type === 'zone') {
      const zone = location.data || getZone(location.id);
      return {
        enemyIds: zone?.enemyIds || [],
        gatherables: zone?.gatherables || [],
        npcIds: zone?.npcIds || [],
        pointsOfInterest: zone?.pointsOfInterest || []
      };
    }
    if (location.type === 'landmark') {
      const landmark = location.data || getLandmark(location.id);
      const connectedZones = (landmark?.connectedZoneIds || [])
        .map((zoneId) => getZone(zoneId))
        .filter(Boolean);
      return {
        enemyIds: uniqueArray([
          ...(landmark?.enemyIds || []),
          ...connectedZones.flatMap((zone) => zone.enemyIds || [])
        ]),
        gatherables: uniqueArray([
          ...(landmark?.gatherables || []),
          ...connectedZones.flatMap((zone) => zone.gatherables || [])
        ]),
        npcIds: uniqueArray([
          ...(landmark?.npcIds || []),
          ...connectedZones.flatMap((zone) => zone.npcIds || [])
        ]),
        pointsOfInterest: uniqueArray([
          ...(landmark?.pointsOfInterest || []),
          ...connectedZones.flatMap((zone) => zone.pointsOfInterest || [])
        ])
      };
    }
    return { enemyIds: [], gatherables: [], npcIds: [], pointsOfInterest: [] };
  }

  function resolveLogType(value, fallback = logTypes.INFO) {
    if (!value) return fallback;
    const key = String(value).toUpperCase();
    return logTypes[key] || fallback;
  }

  function setLandmarkFeedback(message, type = logTypes.INFO) {
    if (!message) {
      state.travel.landmarkFeedback = null;
    } else {
      state.travel.landmarkFeedback = { message, type };
    }
    renderCurrentLandmarkPanel();
    scheduleSave();
  }

  function clearLandmarkFeedback() {
    state.travel.landmarkFeedback = null;
    renderCurrentLandmarkPanel();
  }

  function renderCurrentLandmarkPanel() {
    if (!elements.currentLandmarkPanel) return;
    const location = getCurrentLocation();
    if (!location || location.type !== 'landmark') {
      elements.currentLandmarkPanel.classList.add('hidden');
      if (elements.currentLandmarkActions) {
        elements.currentLandmarkActions.innerHTML = '';
      }
      if (elements.currentLandmarkDetails) {
        elements.currentLandmarkDetails.innerHTML = '';
      }
      if (elements.currentLandmarkFeedback) {
        elements.currentLandmarkFeedback.className = 'screen-feedback';
        elements.currentLandmarkFeedback.textContent = '';
      }
      return;
    }
    const landmark = location.data;
    elements.currentLandmarkPanel.classList.remove('hidden');
    if (elements.currentLandmarkTitle) {
      elements.currentLandmarkTitle.textContent = landmark.name;
    }
    if (elements.currentLandmarkDescription) {
      elements.currentLandmarkDescription.textContent = landmark.description;
    }
    if (elements.currentLandmarkDetails) {
      const connections = (landmark.connectedZoneIds || [])
        .map((zoneId) => getZone(zoneId)?.name || toTitle(zoneId))
        .join(', ') || 'Unknown';
      const gatherables = landmark.gatherables?.length
        ? landmark.gatherables.map((itemId) => getItem(itemId)?.name || toTitle(itemId)).join(', ')
        : 'None';
      elements.currentLandmarkDetails.innerHTML = [
        `Category: ${toTitle(landmark.category || 'landmark')}`,
        `Connected Settlements: ${connections}`,
        `Notable Resources: ${gatherables}`
      ]
        .map((line) => `<li>${line}</li>`)
        .join('');
    }
    if (elements.currentLandmarkActions) {
      const actions = landmark.actions || [];
      if (!actions.length) {
        elements.currentLandmarkActions.innerHTML = '<p class="action-description">No notable activities are currently available.</p>';
      } else {
        elements.currentLandmarkActions.innerHTML = actions
          .map((action) => {
            const description = action.description
              ? `<p class="action-description">${action.description}</p>`
              : '';
            return `<div class="landmark-action"><button type="button" data-landmark-action="${action.id}">${action.label}</button>${description}</div>`;
          })
          .join('');
      }
    }
    if (elements.currentLandmarkFeedback) {
      elements.currentLandmarkFeedback.className = 'screen-feedback';
      const feedback = state.travel.landmarkFeedback;
      if (feedback?.message) {
        elements.currentLandmarkFeedback.textContent = feedback.message;
        elements.currentLandmarkFeedback.classList.add('active');
        if (feedback.type) {
          elements.currentLandmarkFeedback.classList.add(feedback.type);
        }
      } else {
        elements.currentLandmarkFeedback.textContent = 'Interact with the landmark to uncover its secrets.';
      }
    }
  }

  function handleLandmarkAction(actionId) {
    if (!state.player) return;
    const location = getCurrentLocation();
    if (!location || location.type !== 'landmark') return;
    const landmark = location.data;
    const action = (landmark.actions || []).find((entry) => entry.id === actionId);
    if (!action) {
      setLandmarkFeedback('That opportunity is no longer available.', logTypes.WARNING);
      return;
    }
    if (isInCombat()) {
      setLandmarkFeedback('You cannot interact with the landmark during combat.', logTypes.WARNING);
      return;
    }
    resolveLandmarkAction(landmark, action);
  }

  function resolveLandmarkAction(landmark, action) {
    if (!action) return;
    if (action.type === 'encounter') {
      const enemy = getEnemy(action.enemyId);
      if (!enemy) {
        setLandmarkFeedback('No foe answers your challenge.', logTypes.INFO);
        return;
      }
      const message = action.log || `A ${enemy.name} emerges to bar your path!`;
      const type = resolveLogType(action.logType, logTypes.DANGER);
      addTravelEvent(message, type);
      addLog(message, type);
      setLandmarkFeedback(message, type);
      enterCombat(enemy.id, { type: 'travel' });
      return;
    }
    if (action.type === 'reward') {
      const result = applyLandmarkRewards(action.rewards);
      const message = action.log || 'You secure valuable spoils from the landmark.';
      const type = resolveLogType(action.logType, logTypes.SUCCESS);
      addTravelEvent(message, type);
      addLog(message, type);
      const summary = result.summary ? `${message} ${result.summary}` : message;
      setLandmarkFeedback(summary, type);
      advanceTime(1);
      return;
    }
    if (action.type === 'check') {
      const successChance = clamp(action.successChance ?? 0.5, 0, 1);
      const roll = Math.random();
      const outcome = roll <= successChance ? action.success : action.failure;
      const type = resolveLogType(outcome?.logType, roll <= successChance ? logTypes.SUCCESS : logTypes.WARNING);
      const message = outcome?.message || (roll <= successChance ? 'You succeed.' : 'You fail to make progress.');
      if (roll <= successChance && outcome?.rewards) {
        const result = applyLandmarkRewards(outcome.rewards);
        const summary = result.summary ? `${message} ${result.summary}` : message;
        addTravelEvent(message, type);
        addLog(message, type);
        setLandmarkFeedback(summary, type);
      } else {
        addTravelEvent(message, type);
        addLog(message, type);
        setLandmarkFeedback(message, type);
      }
      advanceTime(1);
      return;
    }
    if (action.type === 'narrative') {
      const message = action.log || 'You take a quiet moment to contemplate the surroundings.';
      const type = resolveLogType(action.logType, logTypes.INFO);
      addTravelEvent(message, type);
      addLog(message, type);
      setLandmarkFeedback(message, type);
      advanceTime(1);
      return;
    }
    setLandmarkFeedback('Nothing noteworthy happens.', logTypes.INFO);
  }

  function applyLandmarkRewards(rewards) {
    const summaryParts = [];
    if (!state.player || !rewards) {
      return { summary: '' };
    }
    if (rewards.xp) {
      state.player.xp += rewards.xp;
      summaryParts.push(`${rewards.xp} XP`);
    }
    if (rewards.gold) {
      state.player.gold += rewards.gold;
      summaryParts.push(`${rewards.gold} gold`);
    }
    const itemSummaries = [];
    (rewards.items || []).forEach((entry) => {
      if (!entry || !entry.itemId) return;
      const quantity = entry.amount ?? entry.quantity ?? 1;
      grantItem(state.player, entry.itemId, quantity);
      const itemName = getItem(entry.itemId)?.name || toTitle(entry.itemId);
      itemSummaries.push(`${itemName} x${quantity}`);
    });
    if (itemSummaries.length) {
      summaryParts.push(itemSummaries.join(', '));
    }
    if (rewards.recover) {
      const recoverParts = [];
      if (rewards.recover.healthPercent) {
        const maxHealth = getTotalStat(state.player, 'health');
        const restored = Math.max(1, Math.round(maxHealth * rewards.recover.healthPercent));
        state.player.resources.health = clamp(state.player.resources.health + restored, 0, maxHealth);
        recoverParts.push(`+${restored} Health`);
      }
      if (rewards.recover.manaPercent) {
        const maxMana = getTotalStat(state.player, 'mana');
        const restoredMana = Math.max(1, Math.round(maxMana * rewards.recover.manaPercent));
        state.player.resources.mana = clamp(state.player.resources.mana + restoredMana, 0, maxMana);
        recoverParts.push(`+${restoredMana} Mana`);
      }
      if (recoverParts.length) {
        summaryParts.push(recoverParts.join(', '));
      }
    }
    checkLevelUp();
    updatePlayerPanel();
    renderInventory();
    scheduleSave();
    return { summary: summaryParts.length ? `(${summaryParts.join(', ')})` : '' };
  }

  function movePlayerToLocation(location) {
    if (!state.player || !location) return;
    if (location.type === 'landmark') {
      state.player.location.landmarkId = location.id;
      const fallbackZone = (location.data?.connectedZoneIds || []).find((zoneId) => getZone(zoneId));
      if (fallbackZone) {
        state.player.location.zoneId = fallbackZone;
      }
    } else {
      state.player.location.zoneId = location.id;
      state.player.location.landmarkId = null;
    }
  }

  function beginJourney() {
    if (!state.player) return;
    if (!ensureCanAct('begin a journey', { feedbackChannel: 'travel' })) return;
    if (state.travel.journey) {
      const warning = 'You are already on the road. Advance the current journey or cancel it.';
      addLog(warning, logTypes.WARNING);
      setFeedback('travel', warning, logTypes.WARNING);
      return;
    }
    const selectedValue = elements.travelDestinationSelect?.value || buildDestinationValue(...Object.values(getTravelDestination()));
    const parsed = parseDestinationValue(selectedValue);
    const desired = parsed ? getLocationByType(parsed.type, parsed.id) : ensureTravelDestination(getCurrentLocation());
    if (!desired) {
      const warning = 'Select a valid destination before travelling.';
      addLog(warning, logTypes.WARNING);
      setFeedback('travel', warning, logTypes.WARNING);
      return;
    }
    const currentLocation = getCurrentLocation();
    if (currentLocation && isSameLocation(currentLocation, desired)) {
      const info = 'You already reside in that locale.';
      addLog(info, logTypes.INFO);
      setFeedback('travel', info, logTypes.INFO);
      return;
    }
    const totalSteps = Math.max(2, 3 + Math.floor(Math.random() * 4));
    state.travel.journey = {
      origin: currentLocation
        ? { type: currentLocation.type, id: currentLocation.id }
        : { type: desired.type, id: desired.id },
      destination: { type: desired.type, id: desired.id },
      totalSteps,
      progress: 0,
      focus: state.travel.focus,
      pausedForCombat: false,
      pendingArrival: false
    };
    state.travel.events = [];
    const originName = getLocationName(currentLocation) || 'camp';
    const destinationName = getLocationName(desired) || 'your destination';
    addLog(`You set out toward ${destinationName}.`, logTypes.INFO);
    addTravelEvent(`Departed ${originName} bound for ${destinationName}.`, logTypes.INFO);
    clearLandmarkFeedback();
    renderTravelScreen();
  }

  function advanceJourneyTurn() {
    if (!state.player) return;
    const journey = state.travel.journey;
    if (!journey) {
      const warning = 'Begin a journey before marching onward.';
      addLog(warning, logTypes.WARNING);
      setFeedback('travel', warning, logTypes.WARNING);
      return;
    }
    if (journey.pausedForCombat) {
      const warning = 'Resolve the current combat before continuing your travels.';
      addLog(warning, logTypes.WARNING);
      setFeedback('travel', warning, logTypes.WARNING);
      return;
    }
    if (!ensureCanAct('continue travelling', { feedbackChannel: 'travel' })) return;
    journey.progress = Math.min(journey.totalSteps, journey.progress + 1);
    const event = resolveTravelTurnEvent(journey);
    if (event.type === 'encounter') {
      const enemy = getEnemy(event.enemyId);
      if (!enemy) {
        addTravelEvent('You sense danger nearby, but nothing emerges.', logTypes.INFO);
      } else {
        addTravelEvent(`A ${enemy.name} blocks your path!`, logTypes.DANGER);
        addLog(`A ${enemy.name} challenges you on the road.`, logTypes.WARNING);
        journey.pausedForCombat = true;
        enterCombat(enemy.id, { type: 'travel' });
      }
    } else if (event.type === 'gather') {
      const gatheredItem = event.itemId;
      const amount = event.amount;
      grantItem(state.player, gatheredItem, amount);
      addLog(`You gather ${amount} ${getItem(gatheredItem)?.name || gatheredItem}.`, logTypes.SUCCESS);
      addTravelEvent(`Collected ${amount} ${getItem(gatheredItem)?.name || gatheredItem}.`, logTypes.SUCCESS);
      renderInventory();
      updateQuestProgress('collect', gatheredItem, amount);
    } else if (event.type === 'npc') {
      const npc = getNpc(event.npcId);
      addTravelEvent(`You share stories with ${npc?.name || 'a wandering traveller'}.`, logTypes.INFO);
      addLog(`You meet ${npc?.name || 'a friendly traveller'} on the road.`, logTypes.INFO);
      if (npc?.id) {
        setTrackedState(state.selected, 'npcId', npc.id);
      }
    } else if (event.type === 'discovery') {
      addTravelEvent(`You discover ${event.pointOfInterest}.`, logTypes.INFO);
      addLog(`You discover ${event.pointOfInterest}.`, logTypes.INFO);
    } else {
      if (Math.random() < 0.3) {
        const restored = Math.max(2, Math.round(getTotalStat(state.player, 'health') * 0.05));
        state.player.resources.health = clamp(state.player.resources.health + restored, 0, getTotalStat(state.player, 'health'));
        addTravelEvent('A peaceful stretch of road lets you catch your breath.', logTypes.INFO);
        addLog('The quiet road grants a moment of respite.', logTypes.INFO);
      } else {
        addTravelEvent('The road is quiet as you press on.', logTypes.INFO);
      }
    }

    advanceTime(1);

    if (journey.progress >= journey.totalSteps) {
      if (state.combat.active) {
        journey.pendingArrival = true;
        addTravelEvent('You are moments away from arriving once the battle ends.', logTypes.INFO);
      } else {
        completeJourney();
        return;
      }
    }
    renderTravelScreen();
    updatePlayerPanel();
  }

  function cancelJourney() {
    if (!state.travel.journey) {
      const info = 'No journey to cancel.';
      addLog(info, logTypes.INFO);
      setFeedback('travel', info, logTypes.INFO);
      return;
    }
    addLog('You break camp and postpone the journey.', logTypes.WARNING);
    addTravelEvent('The journey is cancelled for now.', logTypes.WARNING);
    state.travel.journey = null;
    renderTravelScreen();
  }

  function completeJourney() {
    const journey = state.travel.journey;
    if (!journey) return;
    const destinationLocation = getLocationByType(journey.destination?.type, journey.destination?.id);
    const destinationName =
      getLocationName(destinationLocation) || toTitle(journey.destination?.id || '') || 'your destination';
    if (destinationLocation) {
      movePlayerToLocation(destinationLocation);
      setTravelDestination(destinationLocation.type, destinationLocation.id);
    } else {
      const fallback = getCurrentLocation();
      if (fallback) {
        setTravelDestination(fallback.type, fallback.id, { silent: true });
      }
    }
    addLog(`You arrive at ${destinationName}.`, logTypes.SUCCESS);
    addTravelEvent(`Arrived at ${destinationName}.`, logTypes.SUCCESS);
    state.travel.journey = null;
    renderTravelScreen();
    renderTownScreen();
    renderTradeScreen();
  }

  function addTravelEvent(message, type = logTypes.INFO) {
    if (!state.travel.events) {
      state.travel.events = [];
    }
    state.travel.events.push({ message, type });
    if (state.travel.events.length > 8) {
      state.travel.events.splice(0, state.travel.events.length - 8);
    }
    setFeedback('travel', message, type);
    renderTravelEventLog();
    scheduleSave();
  }

  function resolveTravelTurnEvent(journey) {
    const originLocation =
      getLocationByType(journey.origin?.type, journey.origin?.id) || getLocationByType('zone', state.player?.location?.zoneId);
    const destinationLocation = getLocationByType(journey.destination?.type, journey.destination?.id);
    const originProfile = getLocationTravelProfile(originLocation);
    const destinationProfile = getLocationTravelProfile(destinationLocation);
    const enemyPool = uniqueArray([...(originProfile.enemyIds || []), ...(destinationProfile.enemyIds || [])]);
    const gatherables = uniqueArray([...(originProfile.gatherables || []), ...(destinationProfile.gatherables || [])]);
    const npcs = uniqueArray([...(originProfile.npcIds || []), ...(destinationProfile.npcIds || [])]);
    const points = uniqueArray([...(originProfile.pointsOfInterest || []), ...(destinationProfile.pointsOfInterest || [])]);

    const weights = [
      { type: 'encounter', weight: enemyPool.length ? 0.28 : 0, data: enemyPool },
      { type: 'gather', weight: gatherables.length ? 0.32 : 0, data: gatherables },
      { type: 'discovery', weight: points.length ? 0.2 : 0.15, data: points },
      { type: 'npc', weight: npcs.length ? 0.14 : 0.08, data: npcs },
      { type: 'quiet', weight: 0.12, data: null }
    ];

    if (journey.focus === 'gathering') {
      weights.forEach((entry) => {
        if (entry.type === 'gather') entry.weight *= 1.7;
        if (entry.type === 'encounter') entry.weight *= 0.6;
      });
    } else if (journey.focus === 'combat') {
      weights.forEach((entry) => {
        if (entry.type === 'encounter') entry.weight *= 1.85;
        if (entry.type === 'gather') entry.weight *= 0.55;
      });
    }

    const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0);
    if (totalWeight <= 0) {
      return { type: 'quiet' };
    }
    let roll = Math.random() * totalWeight;
    let chosen = weights[weights.length - 1];
    for (const entry of weights) {
      roll -= entry.weight;
      if (roll <= 0) {
        chosen = entry;
        break;
      }
    }

    if (chosen.type === 'encounter') {
      const enemyId = sample(chosen.data);
      return { type: 'encounter', enemyId };
    }
    if (chosen.type === 'gather') {
      const itemId = sample(chosen.data);
      const amount = Math.random() < 0.35 ? 2 : 1;
      return { type: 'gather', itemId, amount };
    }
    if (chosen.type === 'npc') {
      const npcId = sample(chosen.data);
      return { type: 'npc', npcId };
    }
    if (chosen.type === 'discovery') {
      const pointOfInterest = sample(chosen.data) || 'an intriguing landmark';
      return { type: 'discovery', pointOfInterest };
    }
    return { type: 'quiet' };
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

  function renderEnemyDetails(enemyId) {
    if (!elements.enemyDetails) return;
    const enemy = getEnemy(enemyId);
    if (!enemy) {
      elements.enemyDetails.innerHTML = '<p>No enemy engaged.</p>';
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
    addCombatLog(`You engage the ${enemy.name}.`, logTypes.INFO, true);
    openCombatScreen();
    renderCombatState();
    updateNavigationLocks();
    advanceInitiative();
    processAutomaticTurns();
  }

  function renderCombatState() {
    if (!elements.combatActions) return;
    const inCombat = state.combat.active;
    elements.combatActions.classList.toggle('active', inCombat);
    const player = state.player;
    const enemy = getEnemy(state.combat.enemyId);
    if (player) {
      ensureAbilityState(player);
    }
    if (elements.combatAbilityButton) {
      const abilityName = getActiveAbilityName();
      const abilityDefinition = abilityName ? getAbilityDefinition(abilityName) : null;
      const usesRemaining = abilityName ? getAbilityUsesRemaining(abilityName) : Infinity;
      const usesText = abilityDefinition && Number.isFinite(abilityDefinition.usesPerRest)
        ? ` (${usesRemaining}/${abilityDefinition.usesPerRest})`
        : '';
      elements.combatAbilityButton.textContent = abilityName
        ? `Use ${abilityName}${usesText}`
        : 'Use Ability';
    }
    if (elements.combatCurrentZone) {
      const zone = getCurrentZone();
      elements.combatCurrentZone.textContent = zone?.name || 'Unknown';
    }
    renderEnemyDetails(state.combat.enemyId);
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
    if (!inCombat || !player || !enemy) {
      elements.combatStatus.innerHTML = '<p>No combat is currently underway.</p>';
      renderCombatLog();
      return;
    }
    if (elements.combatAbilityButton) {
      const abilityName = getActiveAbilityName();
      const abilityDefinition = abilityName ? getAbilityDefinition(abilityName) : null;
      if (!abilityName) {
        elements.combatAbilityButton.disabled = true;
      } else if (
        abilityDefinition &&
        Number.isFinite(abilityDefinition.usesPerRest) &&
        getAbilityUsesRemaining(abilityName) <= 0
      ) {
        elements.combatAbilityButton.disabled = true;
      }
      if (abilityDefinition) {
        const manaCost = getAbilityManaCostForPlayer(player, abilityDefinition);
        if (state.combat.playerMana < manaCost) {
          elements.combatAbilityButton.disabled = true;
        }
      }
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
      const scaled = Math.round(totalSpeed * (1.15 + totalSpeed * 0.04));
      return Math.max(totalSpeed, scaled);
    }
    const agility = getTotalStat(player, 'agility');
    const fallback = Math.max(5, Math.round(agility * 1.2 + 10));
    return Math.max(agility, fallback);
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
      ensureAbilityState(player);
      const abilityName = getActiveAbilityName();
      if (!abilityName) {
        addCombatLog('You have no special techniques prepared.', logTypes.WARNING);
        renderCombatState();
        return;
      }
      const abilityDefinition = getAbilityDefinition(abilityName);
      const manaCost = getAbilityManaCostForPlayer(player, abilityDefinition) ?? 15;
      const usesRemaining = getAbilityUsesRemaining(abilityName);
      if (Number.isFinite(abilityDefinition?.usesPerRest) && usesRemaining <= 0) {
        addCombatLog(`You have no remaining uses of ${abilityName}. Rest to recover.`, logTypes.WARNING);
        renderCombatState();
        return;
      }
      if (state.combat.playerMana < manaCost) {
        addCombatLog('You need more mana to unleash a special ability.', logTypes.WARNING);
        renderCombatState();
        return;
      }
      state.combat.playerMana = Math.max(0, state.combat.playerMana - manaCost);
      const multiplier = abilityDefinition?.damageMultiplier ?? 1.1;
      const bonus = abilityDefinition?.bonusDamage ?? 8;
      const mitigation = abilityDefinition?.defenseMitigation ?? 0.2;
      const minimumDamage = abilityDefinition?.minimumDamage ?? 8;
      const rawDamage = Math.round(calculatePlayerAttack() * multiplier + bonus - enemy.stats.defense * mitigation);
      const damage = Math.max(minimumDamage, rawDamage);
      state.combat.enemyHealth -= damage;
      addCombatLog(`You channel ${abilityName}, dealing ${damage} damage!`, logTypes.SUCCESS);
      if (Number.isFinite(abilityDefinition?.usesPerRest)) {
        player.abilityUses[abilityName] = Math.max(0, usesRemaining - 1);
        scheduleSave();
      }
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
      const modifiers = getTalentModifiers(player);
      const guardReduction = clamp(0.5 + (modifiers.guardDamageReductionBonus || 0), 0, 0.95);
      damage = Math.round(damage * (1 - guardReduction));
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
    const context = state.combat.context;
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
    closeCombatScreen();
    renderCombatState();
    updatePlayerPanel();
    renderInventory();
    updateQuestLogView();
    updateNavigationLocks();
    handlePostCombatContext(context, outcome);
  }

  function handlePostCombatContext(context, outcome) {
    if (context?.type !== 'travel') return;
    const journey = state.travel.journey;
    if (!journey) return;
    journey.pausedForCombat = false;
    if (outcome === 'defeat') {
      addTravelEvent('The journey falters as you are forced to retreat.', logTypes.DANGER);
      const originLocation = getLocationByType(journey.origin?.type, journey.origin?.id);
      if (originLocation) {
        movePlayerToLocation(originLocation);
        setTravelDestination(originLocation.type, originLocation.id);
      }
      state.travel.journey = null;
      renderTravelScreen();
      renderTownScreen();
      renderTradeScreen();
      return;
    }
    if (outcome === 'flee') {
      addTravelEvent('You escape the danger and regroup on the road.', logTypes.WARNING);
    } else if (outcome === 'victory') {
      addTravelEvent('With the enemy defeated, the path ahead is clear.', logTypes.SUCCESS);
    }
    if (journey.pendingArrival) {
      journey.pendingArrival = false;
      completeJourney();
    } else {
      renderTravelScreen();
    }
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
  }

  function handleCombatDefeat(enemy, rounds) {
    rounds.forEach((line) => addLog(line, logTypes.DANGER));
    addLog(`You fall in battle against the ${enemy.name}.`, logTypes.DANGER);
    const lostGold = Math.min(state.player.gold, Math.max(2, Math.round(state.player.gold * 0.1)));
    state.player.gold -= lostGold;
    state.player.resources.health = Math.max(1, Math.round(getTotalStat(state.player, 'health') * 0.25));
    addLog(`You retreat to safety, losing ${lostGold} gold in the process.`, logTypes.WARNING);
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
    if (!player) return 0;
    const strength = getTotalStat(player, 'strength');
    const agility = getTotalStat(player, 'agility');
    const intellect = getTotalStat(player, 'intellect');
    const base = strength + agility * 0.5 + intellect * 0.3;
    const equipmentBonus = ['weapon', 'offHand', 'trinket']
      .map((slot) => getItem(player.equipment[slot]))
      .filter(Boolean)
      .reduce((sum, item) => sum + (item.stats?.attack || item.stats?.spellPower || 0), 0);
    const modifiers = getTalentModifiers(player);
    let total = base + equipmentBonus + player.level * 1.5;
    total += modifiers.attackBonusFlat || 0;
    if (modifiers.attackMultiplier) {
      total *= 1 + modifiers.attackMultiplier;
    }
    return total;
  }

  function renderTownScreen() {
    const zone = getCurrentZone();
    if (elements.townCurrentZone) {
      elements.townCurrentZone.textContent = zone?.name || 'Unknown';
    }
    if (elements.roamTownButton) {
      elements.roamTownButton.disabled = !zone;
    }
    const npcs = (zone?.npcIds || [])
      .map((npcId) => getNpc(npcId))
      .filter(Boolean);
    const noResidentMessage = 'No residents are available to speak with in this area.';
    if (!npcs.length) {
      elements.npcSelect.innerHTML = '<option>No allies nearby</option>';
      elements.npcSelect.disabled = true;
      elements.npcDetails.textContent = 'Travel to another zone to meet new allies.';
      setTrackedState(state.selected, 'npcId', null);
      setFeedback('town', noResidentMessage, logTypes.INFO);
      return;
    }
    elements.npcSelect.disabled = false;
    elements.npcSelect.innerHTML = npcs
      .map((npc) => `<option value=\"${npc.id}\">${npc.name}</option>`)
      .join('');
    if (!state.selected.npcId || !npcs.some((npc) => npc.id === state.selected.npcId)) {
      if (setTrackedState(state.selected, 'npcId', npcs[0].id)) {
        clearFeedback('town');
      }
    }
    elements.npcSelect.value = state.selected.npcId;
    renderNpcDetails(state.selected.npcId);
    if (state.feedback?.town?.message === noResidentMessage) {
      clearFeedback('town');
    }
    renderFeedback('town');
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
    if (!ensureCanAct('chat with allies')) {
      setFeedback('town', 'You cannot chat with allies while engaged in combat!', logTypes.WARNING);
      return;
    }
    const npc = getNpc(state.selected.npcId);
    if (!npc) return;
    const line = sample(npc.dialogue || []) || `${npc.name} nods silently.`;
    const message = `${npc.name} says: “${line}”`;
    addLog(message, logTypes.INFO);
    setFeedback('town', message, logTypes.INFO);
    updateQuestProgress('talk', npc.id, 1);
  }

  function requestQuestFromNpc() {
    if (!ensureCanAct('request quests')) {
      setFeedback('town', 'You cannot request quests while engaged in combat!', logTypes.WARNING);
      return;
    }
    const npc = getNpc(state.selected.npcId);
    if (!npc) return;
    const availableQuest = (npc.questIds || []).find((questId) => !hasQuest(questId));
    if (!availableQuest) {
      const info = `${npc.name} has no new tasks for you right now.`;
      addLog(info, logTypes.INFO);
      setFeedback('town', info, logTypes.INFO);
      return;
    }
    addQuestToPlayer(state.player, availableQuest);
    updateQuestLogView();
    const questMessage = `${npc.name} entrusts you with the quest "${getQuest(availableQuest).name}".`;
    addLog(questMessage, logTypes.SUCCESS);
    setFeedback('town', questMessage, logTypes.SUCCESS);
  }

  function roamTown() {
    if (!state.player) return;
    if (!ensureCanAct('roam the settlement', { feedbackChannel: 'town' })) {
      return;
    }
    const zone = getCurrentZone();
    if (!zone) {
      const info = 'There is no settlement to roam right now.';
      addLog(info, logTypes.INFO);
      setFeedback('town', info, logTypes.INFO);
      return;
    }
    const enemyPool = (zone.enemyIds || []).filter((enemyId) => Boolean(getEnemy(enemyId)));
    const gatherPool = (zone.gatherables || []).filter((itemId) => Boolean(getItem(itemId)));
    const quietSpots = (zone.pointsOfInterest || []).filter(Boolean);
    const outcomes = [
      { type: 'quiet', weight: 0.25, data: quietSpots.length ? quietSpots : [zone.name] }
    ];
    if (enemyPool.length) {
      outcomes.push({ type: 'encounter', weight: 0.45, data: enemyPool });
    }
    if (gatherPool.length) {
      outcomes.push({ type: 'gather', weight: 0.35, data: gatherPool });
    }
    const totalWeight = outcomes.reduce((sum, entry) => sum + entry.weight, 0);
    if (totalWeight <= 0) {
      const calmMessage = `You wander ${zone.name}, but the streets are quiet.`;
      addLog(calmMessage, logTypes.INFO);
      setFeedback('town', calmMessage, logTypes.INFO);
      advanceTime(1);
      return;
    }
    let roll = Math.random() * totalWeight;
    let chosen = outcomes[0];
    for (const entry of outcomes) {
      roll -= entry.weight;
      if (roll <= 0) {
        chosen = entry;
        break;
      }
    }
    if (chosen.type === 'encounter') {
      const enemyId = sample(chosen.data);
      const enemy = getEnemy(enemyId);
      if (!enemy) {
        const warning = 'You sense danger in the air, but nothing emerges from the shadows.';
        addLog(warning, logTypes.INFO);
        setFeedback('town', warning, logTypes.INFO);
        advanceTime(1);
        return;
      }
      const message = `While roaming ${zone.name}, you clash with ${enemy.name}!`;
      addLog(message, logTypes.WARNING);
      setFeedback('town', message, logTypes.WARNING);
      advanceTime(1, { skipRegen: true });
      enterCombat(enemyId, { zoneId: zone.id, activity: 'townRoam' });
      return;
    }
    if (chosen.type === 'gather') {
      const itemId = sample(chosen.data);
      const amount = Math.random() < 0.3 ? 2 : 1;
      grantItem(state.player, itemId, amount);
      const itemName = getItem(itemId)?.name || itemId;
      const message = `You collect ${amount} ${itemName} while roaming ${zone.name}.`;
      addLog(message, logTypes.SUCCESS);
      setFeedback('town', message, logTypes.SUCCESS);
      renderInventory();
      updateQuestProgress('collect', itemId, amount);
      advanceTime(1);
      return;
    }
    const landmark = sample(chosen.data) || zone.name;
    const calmLog = `You patrol near ${landmark}, but the streets remain calm.`;
    addLog(calmLog, logTypes.INFO);
    setFeedback('town', calmLog, logTypes.INFO);
    advanceTime(1);
  }

  function hasQuest(questId) {
    return (
      state.player.quests.active.some((entry) => entry.quest.id === questId) ||
      state.player.quests.completed.some((entry) => entry.quest.id === questId)
    );
  }

  function renderTradeScreen(forceRefresh = false) {
    const zone = getCurrentZone();
    if (elements.tradingCurrentZone) {
      elements.tradingCurrentZone.textContent = zone?.name || 'Unknown';
    }
    const merchants = populateMerchants();
    const merchant = merchants.find((npc) => npc.id === state.selected.merchantId) || null;
    const noMerchantMessage = 'No merchants are operating in this area. Travel elsewhere to trade.';
    if (!merchant) {
      elements.merchantInfo.textContent = 'No merchants are operating in this area.';
      elements.merchantInventory.innerHTML = '';
      elements.sellInventory.innerHTML = '';
      setFeedback('trade', noMerchantMessage, logTypes.INFO);
      return;
    }
    if (state.feedback?.trade?.message === noMerchantMessage) {
      clearFeedback('trade');
    }
    elements.merchantInfo.innerHTML = `
      <p><strong>${merchant.name}</strong> — ${merchant.title}</p>
      <p><strong>Services:</strong> ${(merchant.services || []).join(', ')}</p>
      <p><strong>Buys:</strong> ${(merchant.buyTypes || []).join(', ') || 'Common goods'}</p>
    `;
    renderMerchantStock(merchant, forceRefresh);
    renderSellableItems(merchant);
    renderFeedback('trade');
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
      if (setTrackedState(state.selected, 'merchantId', merchants[0].id)) {
        clearFeedback('trade');
      }
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
            <div class=\"card-body\">${item.description}</div>
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
    const items = Array.from(getInventorySummary(state.player).entries())
      .filter(([, qty]) => qty > 0)
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
            <div class=\"card-body\">${item.description}</div>
            <div class=\"card-footer\">
              <span>Sell for ${price} gold</span>
              <button type=\"button\" data-sell-item=\"${itemId}\">Sell</button>
            </div>
          </article>
        `;
      })
      .join('') || '<p>No items match this merchant\'s interests.</p>';
  }

  function renderProfessionPanel() {
    populateProfessionSelect();
    const profession = getProfession(state.selected.professionId);
    if (!profession) {
      elements.professionDescription.textContent = 'Train a profession to begin gathering or crafting.';
      elements.professionGatherables.innerHTML = '';
      elements.professionRecipes.innerHTML = '';
      elements.recipeSelect.innerHTML = '';
      renderFeedback('profession');
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
            <div class=\"card-body\">${recipe.description || item.description}</div>
            <div class=\"card-footer\">
              <span>Requires: ${requirements || 'N/A'}</span>
              <button type=\"button\" data-craft-item=\"${recipe.itemId}\">Craft</button>
            </div>
          </article>
        `;
      })
      .join('') || '<p>No recipes available.</p>';
    renderFeedback('profession');
  }

  function populateProfessionSelect() {
    const professions = (state.player?.professions || []).map((id) => getProfession(id)).filter(Boolean);
    if (!professions.length) {
      elements.professionSelect.innerHTML = '<option>No professions trained</option>';
      setFeedback('profession', 'Train a profession to begin gathering or crafting.', logTypes.INFO);
      return;
    }
    elements.professionSelect.innerHTML = professions
      .map((profession) => `<option value=\"${profession.id}\">${profession.name}</option>`)
      .join('');
    if (!state.selected.professionId || !professions.some((p) => p.id === state.selected.professionId)) {
      if (setTrackedState(state.selected, 'professionId', professions[0].id)) {
        clearFeedback('profession');
      }
    }
    elements.professionSelect.value = state.selected.professionId;
  }

  function gatherResources() {
    if (!state.player) return;
    if (!ensureCanAct('gather resources')) {
      setFeedback('profession', 'You cannot gather resources while engaged in combat!', logTypes.WARNING);
      return;
    }
    const profession = getProfession(state.selected.professionId);
    if (!profession) {
      const info = 'Train a profession to begin gathering or crafting.';
      addLog(info, logTypes.INFO);
      setFeedback('profession', info, logTypes.INFO);
      return;
    }
    if (!(profession.gatherables || []).length) {
      const info = 'This profession has no resources to gather.';
      addLog(info, logTypes.INFO);
      setFeedback('profession', info, logTypes.INFO);
      return;
    }
    const zone = getCurrentZone();
    const possible = profession.gatherables.filter((itemId) => zone?.gatherables?.includes(itemId));
    const itemId = sample(possible.length ? possible : profession.gatherables);
    const amount = Math.random() < 0.25 ? 2 : 1;
    grantItem(state.player, itemId, amount);
    const message = `You gather ${amount} ${getItem(itemId).name} while working in ${zone?.name || 'the wilds'}.`;
    addLog(message, logTypes.SUCCESS);
    setFeedback('profession', message, logTypes.SUCCESS);
    renderInventory();
    updateQuestProgress('collect', itemId, amount);
    advanceTime(1);
  }

  function craftRecipe(itemId) {
    if (!ensureCanAct('craft items')) {
      setFeedback('profession', 'You cannot craft items while engaged in combat!', logTypes.WARNING);
      return;
    }
    const profession = getProfession(state.selected.professionId);
    if (!profession) {
      const info = 'Train a profession to begin gathering or crafting.';
      addLog(info, logTypes.INFO);
      setFeedback('profession', info, logTypes.INFO);
      return;
    }
    const recipe = (profession.crafts || []).find((entry) => entry.itemId === itemId);
    if (!recipe) {
      const message = 'Recipe not found.';
      addLog(message, logTypes.WARNING);
      setFeedback('profession', message, logTypes.WARNING);
      return;
    }
    if (!hasCraftingMaterials(recipe.requirements)) {
      const warning = 'Missing materials for this recipe.';
      addLog(warning, logTypes.WARNING);
      setFeedback('profession', warning, logTypes.WARNING);
      return;
    }
    consumeMaterials(recipe.requirements);
    grantItem(state.player, recipe.itemId, 1);
    const success = `You craft ${getItem(recipe.itemId).name}.`;
    addLog(success, logTypes.SUCCESS);
    setFeedback('profession', success, logTypes.SUCCESS);
    renderInventory();
    advanceTime(1);
  }

  function hasCraftingMaterials(requirements) {
    return Object.entries(requirements || {}).every(([itemId, qty]) => {
      return getInventoryItemCount(state.player, itemId) >= qty;
    });
  }

  function consumeMaterials(requirements) {
    Object.entries(requirements || {}).forEach(([itemId, qty]) => {
      removeItem(state.player, itemId, qty);
    });
  }

  function getItemMaxStack(item) {
    const rawStack = Number.isFinite(item?.maxStack)
      ? item.maxStack
      : Number.isFinite(item?.stackSize)
        ? item.stackSize
        : DEFAULT_MAX_STACK_SIZE;
    return Math.max(1, Math.floor(rawStack || DEFAULT_MAX_STACK_SIZE));
  }

  function normaliseInventoryEntry(entry) {
    if (!entry || typeof entry !== 'object') {
      return [];
    }
    const itemId = entry.itemId || entry.id;
    const rawQuantity = Number(entry.quantity ?? entry.count ?? entry.qty ?? 0);
    const quantity = Math.max(0, Math.floor(rawQuantity));
    if (!itemId || quantity <= 0) {
      return [];
    }
    const item = getItem(itemId);
    const maxStack = getItemMaxStack(item);
    const slots = [];
    let remaining = quantity;
    while (remaining > 0) {
      const amount = Math.min(remaining, maxStack);
      slots.push({ itemId, quantity: amount });
      remaining -= amount;
    }
    return slots;
  }

  function normaliseInventoryData(rawInventory) {
    if (!rawInventory) {
      return [];
    }
    if (Array.isArray(rawInventory)) {
      return rawInventory
        .map((entry) => normaliseInventoryEntry(entry))
        .reduce((all, slots) => all.concat(slots.length ? slots : []), []);
    }
    if (typeof rawInventory === 'object') {
      return Object.entries(rawInventory)
        .map(([itemId, qty]) => normaliseInventoryEntry({ itemId, quantity: qty }))
        .reduce((all, slots) => all.concat(slots), []);
    }
    return [];
  }

  function ensurePlayerInventory(player) {
    if (!player) {
      return [];
    }
    if (!Array.isArray(player.inventory)) {
      player.inventory = normaliseInventoryData(player.inventory);
    }
    return player.inventory;
  }

  function getInventoryItemCount(player, itemId) {
    if (!player || !itemId) {
      return 0;
    }
    return ensurePlayerInventory(player).reduce((total, slot) => {
      if (!slot || slot.itemId !== itemId) {
        return total;
      }
      return total + Math.max(0, Number(slot.quantity) || 0);
    }, 0);
  }

  function getInventorySlot(player, slotIndex) {
    if (!player || !Array.isArray(player.inventory)) {
      return null;
    }
    const index = Number(slotIndex);
    if (!Number.isInteger(index) || index < 0 || index >= player.inventory.length) {
      return null;
    }
    return player.inventory[index] || null;
  }

  function getInventorySummary(player) {
    const summary = new Map();
    ensurePlayerInventory(player).forEach((slot) => {
      if (!slot?.itemId) {
        return;
      }
      const current = summary.get(slot.itemId) || 0;
      summary.set(slot.itemId, current + Math.max(0, Number(slot.quantity) || 0));
    });
    return summary;
  }

  function grantItem(player, itemId, amount = 1, options = {}) {
    if (!player || !itemId) {
      return 0;
    }
    const item = getItem(itemId);
    const maxStack = getItemMaxStack(item);
    const inventory = ensurePlayerInventory(player);
    let remaining = Math.max(0, Math.floor(Number(amount) || 0));
    let added = 0;
    while (remaining > 0) {
      let slot = inventory.find((entry) => entry.itemId === itemId && entry.quantity < maxStack);
      if (!slot) {
        slot = { itemId, quantity: 0 };
        inventory.push(slot);
      }
      const capacity = Math.max(0, maxStack - slot.quantity);
      if (capacity <= 0) {
        break;
      }
      const toAdd = Math.min(capacity, remaining);
      slot.quantity += toAdd;
      remaining -= toAdd;
      added += toAdd;
    }
    if (added > 0 && options.autoEquip) {
      autoEquip(player, itemId);
    }
    return added;
  }

  function removeItem(player, itemId, amount = 1, options = {}) {
    if (!player || !itemId) {
      return false;
    }
    const inventory = ensurePlayerInventory(player);
    let remaining = Math.max(0, Math.floor(Number(amount) || 0));
    if (remaining <= 0) {
      return true;
    }
    const preferredIndexRaw = Number(options?.slotIndex);
    const preferredIndex = Number.isInteger(preferredIndexRaw) ? preferredIndexRaw : null;
    if (preferredIndex !== null) {
      const targeted = inventory[preferredIndex];
      if (targeted?.itemId === itemId) {
        const toRemove = Math.min(targeted.quantity, remaining);
        targeted.quantity -= toRemove;
        remaining -= toRemove;
        if (targeted.quantity <= 0) {
          inventory.splice(preferredIndex, 1);
        }
      }
    }
    for (let index = inventory.length - 1; index >= 0 && remaining > 0; index -= 1) {
      if (index === preferredIndex) {
        continue;
      }
      const slot = inventory[index];
      if (!slot || slot.itemId !== itemId) {
        continue;
      }
      const toRemove = Math.min(slot.quantity, remaining);
      slot.quantity -= toRemove;
      remaining -= toRemove;
      if (slot.quantity <= 0) {
        inventory.splice(index, 1);
      }
    }
    return remaining <= 0;
  }

  function autoEquip(player, itemId) {
    const item = getItem(itemId);
    if (!item) return;
    const slot = getEquipmentSlot(item);
    if (!slot) return;
    if (player.equipment[slot]) return;
    if (!canEquipItem(player, item)) return;
    player.equipment[slot] = itemId;
  }

  function renderInventory() {
    if (!state.player) return;
    const inventory = ensurePlayerInventory(state.player);
    const totalSlots = Math.max(DEFAULT_INVENTORY_SLOT_COUNT, inventory.length);
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < totalSlots; index += 1) {
      const slot = index < inventory.length ? inventory[index] : null;
      const template = elements.inventoryItemTemplate.content.cloneNode(true);
      const card = template.querySelector('.card');
      const header = template.querySelector('.card-header');
      const body = template.querySelector('.card-body');
      const footer = template.querySelector('.card-footer');
      card.classList.add('inventory-slot');
      header.innerHTML = '';
      body.innerHTML = '';
      footer.innerHTML = '';

      const slotLabel = document.createElement('span');
      slotLabel.className = 'slot-label';
      slotLabel.textContent = `Slot ${index + 1}`;
      header.appendChild(slotLabel);

      if (!slot) {
        card.classList.add('empty');
        body.innerHTML = '<p class="empty-slot-text">Empty slot</p>';
        footer.innerHTML = '<span>—</span>';
        fragment.appendChild(card);
        continue;
      }

      card.dataset.slotIndex = String(index);
      const item = getItem(slot.itemId);
      const itemName = item?.name || toTitle(slot.itemId || 'Unknown item');
      const title = document.createElement('span');
      title.className = 'item-name';
      title.textContent = slot.quantity > 1 ? `${itemName} ×${slot.quantity}` : itemName;
      header.appendChild(title);

      const equipmentSlot = item ? getEquipmentSlot(item) : null;
      const equippedItemId = equipmentSlot ? state.player.equipment?.[equipmentSlot] : null;
      const currentEquippedItem = equipmentSlot ? getItem(equippedItemId) : null;
      const isEquipped = Boolean(equipmentSlot && equippedItemId === slot.itemId);

      if (isEquipped) {
        const badge = document.createElement('span');
        badge.className = 'item-tag';
        badge.textContent = 'Equipped';
        header.appendChild(badge);
        card.classList.add('equipped');
      }

      const description = item?.description || 'An unfamiliar item of unknown origin.';
      const bodySections = [`<p>${description}</p>`];
      const effectSummary = buildItemEffectSummary(item);
      if (effectSummary) {
        bodySections.push(`<p class="item-effect">${effectSummary}</p>`);
      }
      if (equipmentSlot) {
        const slotLabelText = equipmentSlotLabels[equipmentSlot] || toTitle(equipmentSlot);
        const classNames = getItemClassNames(item);
        const classText = classNames.length ? classNames.join(', ') : 'All classes';
        bodySections.push(
          `<dl class="item-meta"><div><dt>Slot</dt><dd>${slotLabelText}</dd></div><div><dt>Usable by</dt><dd>${classText}</dd></div></dl>`
        );
        const statsList = buildItemStatsList(item);
        if (statsList) {
          bodySections.push(statsList);
        }
        const diffSummary = buildEquipChangeSummary(slot.itemId, item, equipmentSlot, equippedItemId, currentEquippedItem);
        if (diffSummary) {
          bodySections.push(diffSummary);
        }
      }
      body.innerHTML = bodySections.join('');

      const valueText = item?.value ? `${item.value} gold` : 'No market value';
      const valueSpan = document.createElement('span');
      valueSpan.textContent = valueText;
      footer.appendChild(valueSpan);

      if (equipmentSlot) {
        const equipButton = document.createElement('button');
        equipButton.type = 'button';
        equipButton.dataset.equipItem = slot.itemId;
        equipButton.dataset.slotIndex = String(index);
        if (!item || !canEquipItem(state.player, item)) {
          equipButton.textContent = 'Cannot equip';
          equipButton.disabled = true;
        } else if (isEquipped) {
          equipButton.textContent = 'Equipped';
          equipButton.disabled = true;
        } else {
          equipButton.textContent = 'Equip';
        }
        footer.appendChild(equipButton);
      }

      if (item?.type === 'consumable') {
        const useButton = document.createElement('button');
        useButton.type = 'button';
        useButton.textContent = 'Use';
        useButton.dataset.useItem = slot.itemId;
        useButton.dataset.slotIndex = String(index);
        footer.appendChild(useButton);
      }

      fragment.appendChild(card);
    }
    elements.inventoryList.innerHTML = '';
    elements.inventoryList.appendChild(fragment);
  }

  function getEquipmentSlot(item) {
    if (!item?.type) return null;
    return equipmentSlotMap[item.type] || null;
  }

  function getItemClassNames(item) {
    const classIds = Array.isArray(item.classes) ? item.classes : [];
    if (!classIds.length) return [];
    return classIds
      .map((classId) => getClass(classId)?.name || toTitle(classId))
      .filter(Boolean);
  }

  function buildItemStatsList(item) {
    const stats = Object.entries(item.stats || {});
    if (!stats.length) return '';
    const rows = stats
      .map(([stat, value]) => {
        const sign = value > 0 ? '+' : '';
        return `<li><span>${toTitle(stat)}</span><span>${sign}${value}</span></li>`;
      })
      .join('');
    return `<ul class="item-stats">${rows}</ul>`;
  }

  function buildItemEffectSummary(item) {
    const effect = item?.effect;
    if (!effect || typeof effect !== 'object') {
      return '';
    }
    const entries = Object.entries(effect).filter(([, value]) => Number.isFinite(value) && value !== 0);
    if (!entries.length) {
      return '';
    }
    const parts = entries.map(([key, value]) => {
      const amount = Math.abs(Math.round(value));
      if (key === 'health') {
        return `${value >= 0 ? 'Restores' : 'Damages'} ${amount} health`;
      }
      if (key === 'mana') {
        return `${value >= 0 ? 'Restores' : 'Drains'} ${amount} mana`;
      }
      const label = toTitle(key);
      return `${value >= 0 ? 'Grants' : 'Reduces'} ${amount} ${label}`;
    });
    return parts.join(' • ');
  }

  function getEquipmentStatDiffs(newItem, currentItem) {
    const stats = new Set([
      ...Object.keys(newItem?.stats || {}),
      ...Object.keys(currentItem?.stats || {})
    ]);
    return Array.from(stats)
      .map((stat) => ({
        stat,
        diff: (newItem?.stats?.[stat] || 0) - (currentItem?.stats?.[stat] || 0)
      }))
      .filter(({ diff }) => diff !== 0);
  }

  function buildEquipChangeSummary(itemId, item, slot, equippedItemId, currentItem) {
    if (!slot) return '';
    if (equippedItemId === itemId) {
      return '<p class="item-diff neutral">Currently equipped</p>';
    }
    const diffs = getEquipmentStatDiffs(item, currentItem);
    if (!diffs.length) {
      return '<p class="item-diff neutral">If equipped: No change</p>';
    }
    const diffClass = diffs.some(({ diff }) => diff < 0) ? 'negative' : 'positive';
    const summary = diffs
      .map(({ stat, diff }) => `${toTitle(stat)} ${diff > 0 ? '+' : ''}${diff}`)
      .join(', ');
    return `<p class="item-diff ${diffClass}">If equipped: ${summary}</p>`;
  }

  function canEquipItem(player, item) {
    const classIds = Array.isArray(item.classes) ? item.classes : [];
    if (!classIds.length) return true;
    return classIds.includes(player.classId);
  }

  function equipItem(itemId, slotIndex = null) {
    if (!ensureCanAct('change your equipment')) return;
    const player = state.player;
    if (!player) return;
    const item = getItem(itemId);
    if (!item) return;
    const slot = getEquipmentSlot(item);
    if (!slot) return;
    if (getInventoryItemCount(player, itemId) <= 0) {
      addLog('You do not have that item in your pack.', logTypes.WARNING);
      return;
    }
    if (slotIndex !== null) {
      const inventorySlot = getInventorySlot(player, slotIndex);
      if (!inventorySlot || inventorySlot.itemId !== itemId) {
        addLog('That item is no longer in that slot.', logTypes.WARNING);
        renderInventory();
        return;
      }
    }
    if (!canEquipItem(player, item)) {
      addLog('Your training does not allow you to wield that equipment.', logTypes.WARNING);
      return;
    }
    player.equipment = player.equipment || { weapon: null, offHand: null, armor: null, trinket: null };
    if (player.equipment[slot] === itemId) {
      addLog(`${item.name} is already equipped.`, logTypes.INFO);
      return;
    }
    player.equipment[slot] = itemId;
    addLog(`You equip ${item.name}.`, logTypes.SUCCESS);
    renderInventory();
    updatePlayerPanel();
    scheduleSave();
  }

  function useItem(itemId, slotIndex = null) {
    if (!ensureCanAct('use items from your pack')) return;

    const item = getItem(itemId);
    if (!item || item.type !== 'consumable') return;
    if (getInventoryItemCount(state.player, itemId) <= 0) {
      addLog('You have no more of that item left.', logTypes.WARNING);
      return;
    }
    if (slotIndex !== null) {
      const inventorySlot = getInventorySlot(state.player, slotIndex);
      if (!inventorySlot || inventorySlot.itemId !== itemId) {
        addLog('That item is no longer in that slot.', logTypes.WARNING);
        renderInventory();
        return;
      }
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
    removeItem(state.player, itemId, 1, { slotIndex });
    addLog(`You use ${item.name}.`, logTypes.SUCCESS);
    renderInventory();
    updatePlayerPanel();
  }

  function handlePurchase(itemId) {
    if (!ensureCanAct('trade during combat')) {
      setFeedback('trade', 'You cannot trade during combat!', logTypes.WARNING);
      return;
    }
    const merchant = getNpc(state.selected.merchantId);
    if (!merchant) {
      setFeedback('trade', 'No merchant is available to trade right now.', logTypes.INFO);
      return;
    }
    const entry = (merchant.inventory || []).find((stock) => stock.itemId === itemId);
    if (!entry) {
      setFeedback('trade', 'That item is no longer available.', logTypes.INFO);
      return;
    }
    const item = getItem(itemId);
    const price = entry.price ?? item.value ?? 5;
    if (state.player.gold < price) {
      const warning = 'You cannot afford that purchase.';
      addLog(warning, logTypes.WARNING);
      setFeedback('trade', warning, logTypes.WARNING);
      return;
    }
    state.player.gold -= price;
    grantItem(state.player, itemId, 1);
    const message = `You purchase ${item.name} for ${price} gold.`;
    addLog(message, logTypes.SUCCESS);
    setFeedback('trade', message, logTypes.SUCCESS);
    renderInventory();
    updatePlayerPanel();
    renderTradeScreen();
  }

  function handleSale(itemId) {
    if (!ensureCanAct('trade during combat')) {
      setFeedback('trade', 'You cannot trade during combat!', logTypes.WARNING);
      return;
    }
    const merchant = getNpc(state.selected.merchantId);
    if (!merchant) {
      setFeedback('trade', 'No merchant is available to trade right now.', logTypes.INFO);
      return;
    }
    const quantity = getInventoryItemCount(state.player, itemId);
    if (!quantity) {
      const warning = 'You have none of that item to sell.';
      addLog(warning, logTypes.WARNING);
      setFeedback('trade', warning, logTypes.WARNING);
      return;
    }
    const item = getItem(itemId);
    const price = Math.max(1, Math.round((item.value || 1) * 0.6));
    removeItem(state.player, itemId, 1);
    state.player.gold += price;
    const message = `You sell ${item.name} for ${price} gold.`;
    addLog(message, logTypes.INFO);
    setFeedback('trade', message, logTypes.INFO);
    renderInventory();
    updatePlayerPanel();
    renderTradeScreen();
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

  function renderQuestScreen() {
    updateQuestLogView();
  }

  function renderAdventureLogScreen() {
    renderLog();
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
    if (!player) return;
    const previousTotal = player.talents ? player.talents.points + player.talents.spent : 0;
    ensureTalentState(player);
    Object.entries(player.growth || {}).forEach(([stat, value]) => {
      player.stats[stat] = (player.stats[stat] || 0) + value;
    });
    player.resources.health = getTotalStat(player, 'health');
    player.resources.mana = getTotalStat(player, 'mana');
    ensureTalentState(player);
    const currentTotal = player.talents.points + player.talents.spent;
    const gainedTalentPoints = Math.max(0, currentTotal - previousTotal);
    addLog(`You reach level ${player.level}! Attributes have improved.`, logTypes.SUCCESS);
    if (gainedTalentPoints > 0) {
      addLog(
        `You gain ${gainedTalentPoints} talent point${gainedTalentPoints > 1 ? 's' : ''}.`,
        logTypes.INFO
      );
      setFeedback(
        'talent',
        `New talent point earned! Spend it to deepen your ${getClass(player.classId)?.role || 'class'} specialisation.`,
        logTypes.SUCCESS
      );
    }
  }

  function renderLog() {
    renderLogEntries(elements.logEntries, state.logs.slice(-100));
    updateLogOverlayVisibility();
  }

  function renderLogEntries(container, entries) {
    if (!container) return;
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    entries.forEach((entry) => {
      const item = document.createElement('div');
      item.className = `log-entry ${entry.type}`;
      item.textContent = entry.message;
      fragment.appendChild(item);
    });
    container.appendChild(fragment);
    container.scrollTop = container.scrollHeight;
  }

  function hideLogOverlay() {
    state.logOverlayOpen = false;
    if (elements.logOverlayEntries) {
      Array.from(elements.logOverlayEntries.children).forEach((entry) => {
        const meta = logPopupRegistry.get(entry);
        meta?.startFade();
      });
    }
    updateLogOverlayVisibility();
  }

  function addLog(message, type = logTypes.INFO) {
    const entry = { message, type, timestamp: Date.now() };
    state.logs.push(entry);
    if (state.logs.length > 100) {
      state.logs.splice(0, state.logs.length - 100);
    }
    const shouldShowPopup = state.currentScreen !== 'log';
    if (shouldShowPopup) {
      state.logOverlayOpen = true;
    }
    renderLog();
    if (shouldShowPopup) {
      showLogPopup(entry);
    }
    scheduleSave();
  }

  function updateLogOverlayVisibility() {
    if (!elements.logOverlay) return;
    const shouldShow = Boolean(
      state.logOverlayOpen &&
      state.currentScreen !== 'log' &&
      elements.logOverlayEntries?.childElementCount
    );
    elements.logOverlay.classList.toggle('visible', shouldShow);
    elements.logOverlay.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  }

  function showLogPopup(entry) {
    if (!elements.logOverlayEntries) return;

    const item = document.createElement('div');
    item.className = `log-entry ${entry.type} log-popup-entry`;
    item.textContent = entry.message;
    elements.logOverlayEntries.prepend(item);

    updateLogOverlayVisibility();

    requestAnimationFrame(() => {
      item.classList.add('log-popup-visible');
    });

    const metadata = { cleaned: false };

    metadata.startFade = () => {
      if (metadata.cleaned || item.classList.contains('log-popup-fading')) return;
      item.classList.add('log-popup-fading');
    };

    metadata.cleanup = () => {
      if (metadata.cleaned) return;
      metadata.cleaned = true;
      window.clearTimeout(metadata.fadeTimeout);
      window.clearTimeout(metadata.removeTimeout);
      if (item.parentElement === elements.logOverlayEntries) {
        item.parentElement.removeChild(item);
      }
      logPopupRegistry.delete(item);
      updateLogOverlayVisibility();
    };

    const fadeDelay = Math.max(0, LOG_POPUP_DURATION - LOG_POPUP_FADE_DURATION);
    metadata.fadeTimeout = window.setTimeout(metadata.startFade, fadeDelay);
    metadata.removeTimeout = window.setTimeout(
      metadata.cleanup,
      fadeDelay + LOG_POPUP_FADE_DURATION
    );

    item.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'opacity' && item.classList.contains('log-popup-fading')) {
        metadata.cleanup();
      }
    });

    logPopupRegistry.set(item, metadata);
  }

  function restAtCamp() {
    if (!state.player) return;
    if (!ensureCanAct('rest')) return;
    const supplies = getInventoryItemCount(state.player, CAMP_SUPPLIES_ITEM_ID);
    if (supplies <= 0) {
      addLog('You need Camp Supplies to set up a proper camp.', logTypes.WARNING);
      return;
    }
    removeItem(state.player, CAMP_SUPPLIES_ITEM_ID, 1);
    const maxHealth = getTotalStat(state.player, 'health');
    const maxMana = getTotalStat(state.player, 'mana');
    state.player.resources.health = maxHealth;
    state.player.resources.mana = maxMana;
    resetAbilityUses(state.player);
    const timeline = ensureTimeline(state.player);
    timeline.segments = 0;
    timeline.day += 1;
    addLog('You rest at camp, recovering your strength.', logTypes.INFO);
    addLog(`Day ${timeline.day} dawns as you break camp.`, logTypes.SUCCESS);
    renderInventory();
    updatePlayerPanel();
    scheduleSave();
  }

  function isInCombat() {
    return Boolean(state.combat.active);
  }

  function ensureCanAct(actionDescription, options = {}) {
    if (isInCombat()) {
      const message = actionDescription
        ? `You cannot ${actionDescription} while engaged in combat!`
        : 'You are locked in combat and cannot act.';
      addLog(message, logTypes.WARNING);
      if (options.feedbackChannel) {
        setFeedback(options.feedbackChannel, message, logTypes.WARNING);
      }
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

  function getLandmark(id) {
    return dataIndex.landmarks[id];
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

  function getAbilityDefinition(abilityName) {
    if (!abilityName) return null;
    return abilityLibrary[abilityName] || null;
  }

  function getClassTalentTree(classId) {
    const classData = getClass(classId);
    return classData?.talentTree || null;
  }

  function getPlayerTalentTree(player) {
    if (!player) return null;
    return getClassTalentTree(player.classId);
  }

  function getTalentNodeDefinition(context, nodeId) {
    if (!nodeId) return null;
    const tree = typeof context === 'string' ? getClassTalentTree(context) : getPlayerTalentTree(context);
    if (!tree) return null;
    return (tree.nodes || []).find((entry) => entry.id === nodeId) || null;
  }

  function getPlayerTalentNodes(player) {
    if (!player) return [];
    const tree = getPlayerTalentTree(player);
    if (!tree) return [];
    const map = new Map((tree.nodes || []).map((node) => [node.id, node]));
    return (player.talents?.selections || []).map((id) => map.get(id)).filter(Boolean);
  }

  function getTalentStatBonus(player, stat) {
    if (!player || !stat) return 0;
    return getPlayerTalentNodes(player).reduce((total, node) => total + (node.statBonuses?.[stat] || 0), 0);
  }

  function getTalentModifiers(player) {
    const modifiers = {
      guardDamageReductionBonus: 0,
      healthRegenPercent: 0,
      manaRegenPercent: 0,
      attackBonusFlat: 0,
      attackMultiplier: 0,
      abilityManaCostReductionFlat: 0,
      abilityManaCostReductionPercent: 0
    };
    if (!player) {
      return modifiers;
    }
    getPlayerTalentNodes(player).forEach((node) => {
      const passiveMods = node.passive?.modifiers || {};
      if (passiveMods.guardDamageReductionBonus) {
        modifiers.guardDamageReductionBonus += passiveMods.guardDamageReductionBonus;
      }
      if (passiveMods.healthRegenPercent) {
        modifiers.healthRegenPercent += passiveMods.healthRegenPercent;
      }
      if (passiveMods.manaRegenPercent) {
        modifiers.manaRegenPercent += passiveMods.manaRegenPercent;
      }
      if (passiveMods.attackBonusFlat) {
        modifiers.attackBonusFlat += passiveMods.attackBonusFlat;
      }
      if (passiveMods.attackMultiplier) {
        modifiers.attackMultiplier += passiveMods.attackMultiplier;
      }
      if (passiveMods.abilityManaCostReductionFlat) {
        modifiers.abilityManaCostReductionFlat += passiveMods.abilityManaCostReductionFlat;
      }
      if (passiveMods.abilityManaCostReductionPercent) {
        modifiers.abilityManaCostReductionPercent += passiveMods.abilityManaCostReductionPercent;
      }
    });
    return modifiers;
  }

  function getAbilityManaCostForPlayer(player, abilityDefinition) {
    if (!abilityDefinition || abilityDefinition.manaCost == null) {
      return abilityDefinition?.manaCost ?? null;
    }
    if (!Number.isFinite(abilityDefinition.manaCost)) {
      return abilityDefinition.manaCost;
    }
    let cost = abilityDefinition.manaCost;
    if (!player) {
      return Math.max(0, Math.round(cost));
    }
    const modifiers = getTalentModifiers(player);
    cost -= modifiers.abilityManaCostReductionFlat || 0;
    const percent = clamp(modifiers.abilityManaCostReductionPercent || 0, -0.9, 0.9);
    cost *= 1 - percent;
    return Math.max(0, Math.round(cost));
  }

  function getActiveAbilityName() {
    const player = state.player;
    if (!player) return null;
    ensureAbilityState(player);
    const abilities = player.abilities || [];
    if (!abilities.length) return null;
    const selected = state.selected.abilityName;
    if (selected && abilities.includes(selected)) {
      return selected;
    }
    return abilities[0];
  }

  function sanitizeSelectedAbility() {
    const player = state.player;
    if (!player) return;
    ensureAbilityState(player);
    const abilities = player.abilities || [];
    const selected = state.selected.abilityName;
    if (!abilities.length) {
      if (selected) {
        setTrackedState(state.selected, 'abilityName', null);
      }
      return;
    }
    if (!selected || !abilities.includes(selected)) {
      setTrackedState(state.selected, 'abilityName', abilities[0]);
    }
  }

  function ensureTalentState(player) {
    if (!player) return;
    const classData = getClass(player.classId) || {};
    const tree = classData.talentTree || null;
    if (!player.talents || typeof player.talents !== 'object') {
      player.talents = {
        treeId: tree?.id || classData.id || 'general',
        points: 0,
        spent: 0,
        selections: []
      };
    }
    const talents = player.talents;
    if (!Array.isArray(talents.selections)) {
      talents.selections = [];
    }
    const nodeMap = new Map((tree?.nodes || []).map((node) => [node.id, node]));
    talents.selections = talents.selections.filter((id) => nodeMap.has(id));
    talents.spent = talents.selections.reduce(
      (sum, id) => sum + Math.max(1, Math.floor(nodeMap.get(id)?.cost ?? 1)),
      0
    );
    const perLevel = Number.isFinite(classData.talentPointsPerLevel) ? classData.talentPointsPerLevel : 1;
    const starting = Number.isFinite(classData.startingTalentPoints) ? classData.startingTalentPoints : 1;
    const earned = Math.max(0, starting + Math.max(0, player.level - 1) * perLevel);
    const recorded = talents.points + talents.spent;
    if (recorded < earned) {
      talents.points += earned - recorded;
    } else if (recorded > earned) {
      talents.points = Math.max(0, earned - talents.spent);
    }
    talents.points = Math.max(0, Math.floor(talents.points));
    talents.treeId = tree?.id || talents.treeId || classData.id || 'general';
  }

  function ensureAbilityState(player) {
    if (!player) return;
    if (!Array.isArray(player.abilities)) {
      player.abilities = [];
    }
    if (!player.abilityUses || typeof player.abilityUses !== 'object') {
      player.abilityUses = {};
    }
    const knownAbilities = new Set(player.abilities);
    Object.keys(player.abilityUses).forEach((abilityName) => {
      if (!knownAbilities.has(abilityName)) {
        delete player.abilityUses[abilityName];
      }
    });
    player.abilities.forEach((abilityName) => {
      const definition = getAbilityDefinition(abilityName);
      if (!definition || !Number.isFinite(definition.usesPerRest)) {
        delete player.abilityUses[abilityName];
        return;
      }
      const uses = player.abilityUses[abilityName];
      if (!Number.isFinite(uses) || uses < 0 || uses > definition.usesPerRest) {
        player.abilityUses[abilityName] = definition.usesPerRest;
      }
    });
  }

  function resetAbilityUses(player) {
    if (!player) return;
    ensureAbilityState(player);
    Object.keys(player.abilityUses).forEach((abilityName) => {
      const definition = getAbilityDefinition(abilityName);
      if (definition && Number.isFinite(definition.usesPerRest)) {
        player.abilityUses[abilityName] = definition.usesPerRest;
      }
    });
  }

  function getAbilityUsesRemaining(abilityName) {
    if (!state.player || !abilityName) return Infinity;
    ensureAbilityState(state.player);
    const definition = getAbilityDefinition(abilityName);
    if (!definition || !Number.isFinite(definition.usesPerRest)) {
      return Infinity;
    }
    const stored = state.player.abilityUses?.[abilityName];
    if (!Number.isFinite(stored)) {
      return definition.usesPerRest;
    }
    const safeValue = Math.floor(stored);
    return Math.max(0, Math.min(definition.usesPerRest, safeValue));
  }

  function ensureTimeline(player) {
    if (!player) {
      return { day: 1, segments: 0 };
    }
    if (!player.timeline || typeof player.timeline !== 'object') {
      player.timeline = { day: 1, segments: 0 };
    }
    const timeline = player.timeline;
    const safeDay = Number.isFinite(timeline.day) ? Math.max(1, Math.floor(timeline.day)) : 1;
    const safeSegments = Number.isFinite(timeline.segments) ? Math.max(0, Math.floor(timeline.segments)) : 0;
    timeline.day = safeDay;
    timeline.segments = Math.min(safeSegments, TIME_SEGMENTS_PER_DAY - 1);
    return timeline;
  }

  function applyPassiveRegeneration() {
    const player = state.player;
    if (!player) return;
    const maxHealth = getTotalStat(player, 'health');
    const maxMana = getTotalStat(player, 'mana');
    const modifiers = getTalentModifiers(player);
    const healthRegenRate = PASSIVE_HEALTH_REGEN_RATE + (modifiers.healthRegenPercent || 0);
    const manaRegenRate = PASSIVE_MANA_REGEN_RATE + (modifiers.manaRegenPercent || 0);
    const healthRegen = Math.max(1, Math.round(maxHealth * healthRegenRate));
    const manaRegen = Math.max(1, Math.round(maxMana * manaRegenRate));
    player.resources.health = clamp((player.resources.health || 0) + healthRegen, 0, maxHealth);
    player.resources.mana = clamp((player.resources.mana || 0) + manaRegen, 0, maxMana);
  }

  function advanceTime(ticks = 1, options = {}) {
    if (!state.player) return;
    const increments = Math.max(0, Math.floor(Number(ticks) || 0));
    if (increments <= 0) return;
    const timeline = ensureTimeline(state.player);
    for (let i = 0; i < increments; i += 1) {
      if (!options.skipRegen) {
        applyPassiveRegeneration();
      }
      timeline.segments += 1;
      if (timeline.segments >= TIME_SEGMENTS_PER_DAY) {
        timeline.segments = 0;
        timeline.day += 1;
        addLog(`Day ${timeline.day} dawns as your travels continue.`, logTypes.INFO);
      }
    }
    updatePlayerPanel();
    scheduleSave();
  }

  function getTotalStat(player, stat) {
    const base = player.stats[stat] || 0;
    const equipmentBonus = Object.values(player.equipment || {})
      .map((itemId) => getItem(itemId))
      .filter(Boolean)
      .reduce((sum, item) => sum + (item.stats?.[stat] || 0), 0);
    const talentBonus = getTalentStatBonus(player, stat);
    return base + equipmentBonus + talentBonus;
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
    state.feedback = createDefaultFeedbackState();
    state.currentScreen = saved.currentScreen && screenRenderers[saved.currentScreen]
      ? saved.currentScreen
      : 'character';
    state.logs = Array.isArray(saved.logs) ? saved.logs.slice(-100) : [];
    state.logOverlayOpen = false;
    Object.assign(state.selected, saved.selected || {});
    const loadedTravel = saved.travel && typeof saved.travel === 'object' ? { ...saved.travel } : {};
    const legacyDestinationZoneId = loadedTravel.destinationZoneId;
    delete loadedTravel.destinationZoneId;
    const journeyData = loadedTravel.journey && typeof loadedTravel.journey === 'object' ? { ...loadedTravel.journey } : null;
    delete loadedTravel.journey;
    let normalizedDestination = null;
    if (loadedTravel.destination && typeof loadedTravel.destination === 'object') {
      const type = ['zone', 'landmark'].includes(loadedTravel.destination.type)
        ? loadedTravel.destination.type
        : 'zone';
      const id = loadedTravel.destination.id || null;
      normalizedDestination = { type, id };
    } else if (legacyDestinationZoneId) {
      normalizedDestination = { type: 'zone', id: legacyDestinationZoneId };
    }
    let normalizedJourney = null;
    if (journeyData) {
      const origin = journeyData.origin || (journeyData.originId ? { type: 'zone', id: journeyData.originId } : null);
      const destination =
        journeyData.destination || (journeyData.destinationId ? { type: 'zone', id: journeyData.destinationId } : null);
      normalizedJourney = {
        ...journeyData,
        origin,
        destination
      };
      delete normalizedJourney.originId;
      delete normalizedJourney.destinationId;
    }
    Object.assign(state.travel, createDefaultTravelState(), loadedTravel);
    state.travel.destination = normalizedDestination || state.travel.destination || { type: 'zone', id: null };
    if (!['zone', 'landmark'].includes(state.travel.destination.type)) {
      state.travel.destination.type = 'zone';
    }
    if (!state.travel.destination.id && legacyDestinationZoneId && state.travel.destination.type === 'zone') {
      state.travel.destination.id = legacyDestinationZoneId;
    }
    state.travel.journey = normalizedJourney;
    if (!['balanced', 'gathering', 'combat'].includes(state.travel.focus)) {
      state.travel.focus = 'balanced';
    }
    state.travel.events = Array.isArray(state.travel.events) ? state.travel.events.slice(-8) : [];
    if (state.travel.journey && typeof state.travel.journey === 'object') {
      state.travel.journey.focus = ['balanced', 'gathering', 'combat'].includes(state.travel.journey.focus)
        ? state.travel.journey.focus
        : state.travel.focus;
      state.travel.journey.pausedForCombat = Boolean(state.travel.journey.pausedForCombat);
      state.travel.journey.pendingArrival = Boolean(state.travel.journey.pendingArrival);
    } else {
      state.travel.journey = null;
    }
    if (!state.travel.landmarkFeedback || typeof state.travel.landmarkFeedback !== 'object') {
      state.travel.landmarkFeedback = null;
    } else if (typeof state.travel.landmarkFeedback.message !== 'string') {
      state.travel.landmarkFeedback = null;
    }
    state.combat = createDefaultCombatState();
    sanitizeLoadedState();
    syncResourceCaps(state.player);
    sanitizeSelectedAbility();
    elements.newGameModal.classList.add('hidden');
    updateAllUI();
    showScreen(state.currentScreen);
    saveGame();
  }

  function normaliseLoadedPlayer(player) {
    player.inventory = normaliseInventoryData(player.inventory);
    player.equipment = {
      weapon: player.equipment?.weapon || null,
      offHand: player.equipment?.offHand || null,
      armor: player.equipment?.armor || null,
      trinket: player.equipment?.trinket || null
    };
    player.resources = player.resources || {};
    player.location = player.location || { zoneId: data.zones[0]?.id || null };
    if (!getZone(player.location.zoneId)) {
      player.location.zoneId = data.zones[0]?.id || null;
    }
    if (player.location.landmarkId && !getLandmark(player.location.landmarkId)) {
      player.location.landmarkId = null;
    } else if (player.location.landmarkId) {
      const landmark = getLandmark(player.location.landmarkId);
      if (landmark) {
        const connectedZones = (landmark.connectedZoneIds || []).filter((zoneId) => getZone(zoneId));
        if (!connectedZones.includes(player.location.zoneId) && connectedZones.length) {
          player.location.zoneId = connectedZones[0];
        }
      }
    }
    player.professions = Array.isArray(player.professions) ? player.professions : [];
    player.quests = player.quests || { active: [], completed: [] };
    player.quests.active = (player.quests.active || [])
      .map((entry) => rehydrateQuestEntry(entry))
      .filter(Boolean);
    player.quests.completed = (player.quests.completed || [])
      .map((entry) => rehydrateQuestEntry(entry))
      .filter(Boolean);
    ensureTimeline(player);
    ensureAbilityState(player);
    ensureTalentState(player);
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
    if (state.player.location.landmarkId) {
      const landmark = getLandmark(state.player.location.landmarkId);
      if (!landmark) {
        state.player.location.landmarkId = null;
      } else {
        const connectedZones = (landmark.connectedZoneIds || []).filter((zoneId) => getZone(zoneId));
        if (!connectedZones.includes(state.player.location.zoneId) && connectedZones.length) {
          state.player.location.zoneId = connectedZones[0];
        }
      }
    }
    delete state.travel.destinationZoneId;
    const currentLocation = getCurrentLocation();
    const destination = getTravelDestination();
    if (!['zone', 'landmark'].includes(destination.type)) {
      state.travel.destination = { type: 'zone', id: destination.id || state.player.location.zoneId || null };
    }
    const resolvedDestination = getLocationByType(state.travel.destination.type, state.travel.destination.id);
    if (!resolvedDestination && currentLocation) {
      state.travel.destination = { type: currentLocation.type, id: currentLocation.id };
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
    if (state.travel.journey) {
      delete state.travel.journey.originId;
      delete state.travel.journey.destinationId;
      const originLocation = getLocationByType(state.travel.journey.origin?.type, state.travel.journey.origin?.id);
      const destinationLocation = getLocationByType(
        state.travel.journey.destination?.type,
        state.travel.journey.destination?.id
      );
      if (!originLocation || !destinationLocation) {
        state.travel.journey = null;
      } else {
        state.travel.journey.origin = { type: originLocation.type, id: originLocation.id };
        state.travel.journey.destination = { type: destinationLocation.type, id: destinationLocation.id };
      }
    }
    if (!screenRenderers[state.currentScreen]) {
      state.currentScreen = 'character';
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

  function createDefaultTravelState() {
    return {
      destination: { type: 'zone', id: null },
      focus: 'balanced',
      journey: null,
      events: [],
      landmarkFeedback: null
    };
  }

  function createDefaultFeedbackState() {
    return {
      travel: null,
      profession: null,
      trade: null,
      town: null,
      talent: null
    };
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
