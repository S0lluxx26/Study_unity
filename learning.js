const lessonModules = [
  {
    title: 'Editor & scene thinking', time: '45 min', outcome: 'Navigate Unity confidently and build a clean scene from GameObjects and components.',
    objectives: ['Name the five core Editor windows', 'Explain GameObject + Component', 'Save and organize a scene'],
    steps: [
      ['Orient the Editor', 'Locate Hierarchy, Scene, Game, Inspector, and Project. Select the Main Camera and watch the Inspector change.'],
      ['Build a tiny room', 'Create a Plane and three Cubes. Use Transform tools, meaningful names, and an Empty GameObject named Environment.'],
      ['Make a reusable Prefab', 'Drag one configured cube from Hierarchy into the Project window, then create three instances from that Prefab.']
    ],
    code: '// No C# yet — build the mental model first.\nGameObject = container\nComponent  = capability\nPrefab     = reusable configuration',
    checkpoint: 'You can create a new scene, add and transform objects, parent them under Environment, make a Prefab, and explain why every object has a Transform.',
    check: {q:'What gives a GameObject most of its behavior?',choices:['Its file name','Attached components','The Scene view camera','Its folder'],answer:1,explanations:['A name helps organization but does not create behavior.','Correct. Components such as Rigidbody, Camera, and scripts add data and behavior to a GameObject.','The Scene view camera is an Editor navigation tool.','Project folders organize assets; they do not control scene behavior.']},
    source: 'https://docs.unity3d.com/6000.0/Documentation/Manual/GameObjects.html'
  },
  {
    title: 'C# for gameplay', time: '75 min', outcome: 'Write a MonoBehaviour that exposes tuning values and changes a GameObject safely.',
    objectives: ['Read fields and methods', 'Use the lifecycle correctly', 'Cache component references'],
    steps: [
      ['Create the script', 'Create Rotator.cs in Assets/Scripts. Match the filename to the class name and attach it to a visible object.'],
      ['Expose one tuning value', 'Keep the field private and use SerializeField so speed is editable in the Inspector.'],
      ['Make motion frame-rate independent', 'Rotate in Update and multiply degrees per second by Time.deltaTime.']
    ],
    code: 'using UnityEngine;\n\npublic class Rotator : MonoBehaviour\n{\n    [SerializeField] private float degreesPerSecond = 60f;\n\n    private void Update()\n    {\n        transform.Rotate(0f, degreesPerSecond * Time.deltaTime, 0f);\n    }\n}',
    checkpoint: 'Changing Degrees Per Second in the Inspector changes rotation speed without editing code, and no red errors appear in Console.',
    check: {q:'Why multiply rotation by Time.deltaTime?',choices:['To enable the Inspector','To make change frame-rate independent','To add a Collider','To call Update twice'],answer:1,explanations:['Inspector visibility comes from serialization, not deltaTime.','Correct. deltaTime scales the change by elapsed frame time, so motion stays near the same speed across frame rates.','Colliders are added as components.','deltaTime does not change how often Update runs.']},
    source: 'https://docs.unity3d.com/6000.0/Documentation/ScriptReference/MonoBehaviour.html'
  },
  {
    title: 'Input & movement', time: '60 min', outcome: 'Move a Rigidbody player with device-independent Input Actions.',
    objectives: ['Create a Move action', 'Separate input from physics', 'Tune acceleration and drag'],
    steps: [
      ['Create the input contract', 'Install Input System, create an Input Actions asset, add a Player map and a Vector2 Move action.'],
      ['Configure the player', 'Add Rigidbody, Collider, and PlayerInput. Freeze unwanted rotation and reference the action asset.'],
      ['Apply movement', 'Read the action value through PlayerInput, map Vector2 onto X/Z, and apply force in FixedUpdate.']
    ],
    code: 'private Vector2 move;\n\npublic void OnMove(InputAction.CallbackContext ctx)\n    => move = ctx.ReadValue<Vector2>();\n\nprivate void FixedUpdate()\n{\n    Vector3 direction = new(move.x, 0f, move.y);\n    body.AddForce(direction * acceleration, ForceMode.Acceleration);\n}',
    checkpoint: 'Keyboard and gamepad can drive the same Move action, diagonal speed feels controlled, and physics remains stable at different frame rates.',
    check: {q:'Where should repeated Rigidbody forces normally be applied?',choices:['Awake','Update','FixedUpdate','OnGUI'],answer:2,explanations:['Awake runs once during initialization.','Update follows rendered frames, so repeated force application can vary with frame rate.','Correct. FixedUpdate follows the physics timestep and is the standard place for Rigidbody forces.','OnGUI is for immediate-mode interface events.']},
    source: 'https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/index.html'
  },
  {
    title: 'Physics & interactions', time: '70 min', outcome: 'Create collectibles, hazards, scoring, and a complete win condition.',
    objectives: ['Choose collision vs trigger', 'Use tags safely', 'Build one game loop'],
    steps: [
      ['Create a collectible Prefab', 'Give a bright object a trigger Collider, tag it Collectible, and turn it into a Prefab.'],
      ['Detect collection', 'Use OnTriggerEnter, CompareTag, and Destroy. Keep score in a dedicated GameManager.'],
      ['Close the loop', 'Place eight collectibles, update the UI after each pickup, and show a win panel when none remain.']
    ],
    code: 'private void OnTriggerEnter(Collider other)\n{\n    if (!other.CompareTag("Player")) return;\n\n    GameManager.Instance.AddScore(1);\n    Destroy(gameObject);\n}',
    checkpoint: 'Each collectible scores exactly once, hazards reset the player, and collecting all items produces an unmistakable win state.',
    check: {q:'Which callback is best for scoring once when a player enters a collectible trigger?',choices:['OnTriggerEnter','OnTriggerStay','Update','OnCollisionExit'],answer:0,explanations:['Correct. OnTriggerEnter runs when the overlap begins, making it suitable for one pickup event.','OnTriggerStay repeats while overlapping and can score many times.','Update runs every frame even when nothing is collected.','OnCollisionExit is for leaving a solid collision, not entering a trigger.']},
    source: 'https://docs.unity3d.com/6000.0/Documentation/Manual/CollidersOverview.html'
  },
  {
    title: 'UI, audio & polish', time: '60 min', outcome: 'Make game state readable and player actions satisfying.',
    objectives: ['Build responsive HUD', 'Add layered feedback', 'Control audio cleanly'],
    steps: [
      ['Create the HUD', 'Use a Canvas with score text, a short objective, and a hidden win panel. Check multiple Game view aspect ratios.'],
      ['Add feedback', 'Play a particle burst and sound at the collectible position before removing the collectible.'],
      ['Polish with restraint', 'Add camera damping, readable materials, one light pass, and a restart button. Keep the core action visually dominant.']
    ],
    code: 'public void AddScore(int amount)\n{\n    score += amount;\n    scoreLabel.text = $"CORES  {score:00} / {target:00}";\n\n    if (score >= target) winPanel.SetActive(true);\n}',
    checkpoint: 'A new player can identify the goal within five seconds, every pickup has visual and audio feedback, and the win screen can restart the game.',
    check: {q:'What is the clearest sign that pickup feedback is working?',choices:['The project has more files','The action produces immediate visual or audio response','The Inspector is open','The code uses a public field'],answer:1,explanations:['File count does not tell the player what happened.','Correct. Immediate, consistent feedback connects the player action to a visible or audible result.','The Inspector is not visible in the finished game.','Field visibility does not determine player-facing clarity.']},
    source: 'https://docs.unity3d.com/6000.0/Documentation/Manual/UIToolkits.html'
  },
  {
    title: 'Profile, build & ship', time: '50 min', outcome: 'Measure the game, create a Web build, and publish a tested release.',
    objectives: ['Profile before optimizing', 'Configure a Build Profile', 'Run a release checklist'],
    steps: [
      ['Measure the target experience', 'Open Window > Analysis > Profiler. Check CPU, rendering, and memory while playing a representative scene.'],
      ['Create a Web Build Profile', 'Add the correct scenes in order, switch to Web, use a release build, and run through a local server.'],
      ['Ship deliberately', 'Test keyboard focus, restart flow, loading, audio, browser console, and a clean incognito session before sharing.']
    ],
    code: 'RELEASE CHECK\n[ ] No red Console errors\n[ ] Correct first scene\n[ ] Input works after browser focus\n[ ] Win + restart flow works\n[ ] Profiled on target platform',
    checkpoint: 'A second person can open the URL, understand the goal, play to completion, restart, and report no broken controls or missing assets.',
    check: {q:'What should happen before you optimize a slow scene?',choices:['Delete random assets','Measure it with the Profiler','Lower every quality setting','Rewrite all scripts'],answer:1,explanations:['Random deletion can remove useful content without finding the bottleneck.','Correct. Profiling identifies where CPU, rendering, or memory time is actually spent.','Quality settings may not be the cause. Measure first.','A rewrite is expensive and unjustified without evidence.']},
    source: 'https://docs.unity3d.com/6000.0/Documentation/Manual/web-build-settings.html'
  }
];

const glossaryTerms = [
  ['Asset','A file used by the project: scene, script, texture, model, audio clip, material, or Prefab.'],
  ['Component','A focused capability attached to a GameObject, such as Transform, Rigidbody, Camera, or your script.'],
  ['GameObject','The fundamental scene container. Components supply its data and behavior.'],
  ['Transform','The required component that stores position, rotation, scale, and parent-child relationships.'],
  ['Scene','A saved collection of GameObjects—often a level, menu, or reusable gameplay space.'],
  ['Prefab','A reusable GameObject configuration stored as an asset; instances stay connected to the source.'],
  ['MonoBehaviour','The usual base class for C# components that receive Unity lifecycle messages.'],
  ['Awake','Lifecycle message for early internal setup and caching references.'],
  ['Start','Lifecycle message called before the first Update when the component is enabled.'],
  ['Update','Runs once per rendered frame; use for frame-based logic and responsive input reading.'],
  ['FixedUpdate','Runs on the physics timestep; the normal place to apply Rigidbody forces.'],
  ['Time.deltaTime','Seconds since the previous rendered frame; use to scale frame-based change.'],
  ['Rigidbody','A component that lets a 3D object participate in force, mass, gravity, and velocity simulation.'],
  ['Collider','A shape used by physics to detect solid contact or trigger overlap.'],
  ['Trigger','A Collider mode that reports overlaps without physically blocking another Collider.'],
  ['Input Action','A device-independent gameplay intent such as Move, Jump, Pause, or Submit.'],
  ['Canvas','The root component used to render Unity UI elements.'],
  ['Coroutine','A method that can pause with yield and continue later across frames.'],
  ['Build Profile','Unity 6 configuration for a target platform, scenes, and build options.'],
  ['Profiler','Unity tooling that measures CPU, GPU, rendering, memory, audio, and other runtime costs.']
];

const lessonState = new Set(JSON.parse(localStorage.getItem('unityLessonProgress') || '[]'));
const lessonCheckState = new Set(JSON.parse(localStorage.getItem('unityLessonChecks') || '[]'));
let activeLesson = Math.min(lessonModules.length - 1, lessonModules.findIndex((_, i) => !lessonState.has(i)) === -1 ? lessonModules.length - 1 : lessonModules.findIndex((_, i) => !lessonState.has(i)));
const setupState = new Set(JSON.parse(localStorage.getItem('unitySetupProgress') || '[]'));

function saveLearningState() {
  localStorage.setItem('unityLessonProgress', JSON.stringify([...lessonState]));
  localStorage.setItem('unityLessonChecks', JSON.stringify([...lessonCheckState]));
  localStorage.setItem('unitySetupProgress', JSON.stringify([...setupState]));
}

function renderDashboard() {
  const completed = lessonState.size;
  const percent = Math.round(completed / lessonModules.length * 100);
  const ring = document.querySelector('#progressRing');
  ring.style.setProperty('--progress', `${percent * 3.6}deg`);
  document.querySelector('#progressPercent').textContent = `${percent}%`;
  document.querySelector('#progressMessage').textContent = completed === 6 ? 'Prototype path complete.' : completed ? `${completed} of 6 modules complete.` : 'Ready when you are.';
  document.querySelector('#progressDetail').textContent = completed === 6 ? 'Retake the quiz, refine your game, and ship a new build.' : `About ${lessonModules.slice(completed).reduce((sum,m)=>sum+parseInt(m.time),0)} minutes remain in the core path.`;
  const next = lessonModules.findIndex((_, i) => !lessonState.has(i));
  const nextIndex = next === -1 ? 5 : next;
  document.querySelector('#continueTitle').textContent = next === -1 ? 'Build your second prototype' : lessonModules[nextIndex].title;
  document.querySelector('#continueText').textContent = next === -1 ? 'Repeat the loop with one new mechanic and a smaller scope.' : lessonModules[nextIndex].outcome;
  document.querySelector('#continueButton').onclick = () => { activeLesson = nextIndex; renderCourse(); };
  document.querySelectorAll('.module-card').forEach((card, i) => card.classList.toggle('is-complete', lessonState.has(i)));
}

function renderCourse() {
  const index = document.querySelector('#lessonIndex');
  index.innerHTML = lessonModules.map((m, i) => `<button class="lesson-index-button ${i === activeLesson ? 'active' : ''}" data-lesson="${i}"><span class="index-number">${String(i + 1).padStart(2,'0')}</span><span><strong>${m.title}</strong><small>${m.time}</small></span><span class="complete-mark">${lessonState.has(i) ? '✓' : ''}</span></button>`).join('');
  index.querySelectorAll('button').forEach(button => button.onclick = () => { activeLesson = Number(button.dataset.lesson); renderCourse(); });
  const m = lessonModules[activeLesson];
  document.querySelector('#lessonView').innerHTML = `
    <div class="lesson-view-top"><div><span class="lesson-kicker">MODULE ${String(activeLesson + 1).padStart(2,'0')} · LEARNING OUTCOME</span><h3>${m.title}</h3><p class="lesson-outcome">${m.outcome}</p></div><span class="lesson-time">${m.time}</span></div>
    <div class="objective-strip">${m.objectives.map((o,i)=>`<div class="objective"><span>0${i+1}</span><p>${o}</p></div>`).join('')}</div>
    <div class="lesson-content-grid">
      <div class="lesson-study"><div class="compact-label">LEARN & BUILD</div><div class="lesson-steps">${m.steps.map(s=>`<div class="lesson-step"><div><h4>${s[0]}</h4><p>${s[1]}</p></div></div>`).join('')}</div></div>
      <div class="lesson-practice"><div class="compact-label">CODE & CHECK</div><pre class="mini-code"><code></code></pre><div class="checkpoint"><span>PROOF TARGET</span><p>${m.checkpoint}</p></div>
        <section class="inline-check"><span class="inline-check-kicker">QUICK CHECK</span><h4>${m.check.q}</h4><div class="inline-options">${m.check.choices.map((choice,i)=>`<button type="button" data-inline-choice="${i}" class="${lessonCheckState.has(activeLesson)&&i===m.check.answer?'correct':''}" ${lessonCheckState.has(activeLesson)?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${choice}</button>`).join('')}</div><div class="inline-feedback ${lessonCheckState.has(activeLesson)?'show good':''}" role="status">${lessonCheckState.has(activeLesson)?`<b>Correct.</b> ${m.check.explanations[m.check.answer].replace(/^Correct\.\s*/,'')}`:''}</div></section>
      </div>
    </div>
    <div class="lesson-footer"><a href="${m.source}" target="_blank" rel="noreferrer">Official Unity reference ↗</a><button class="complete-lesson ${lessonState.has(activeLesson)?'completed':''}" type="button" ${!lessonState.has(activeLesson)&&!lessonCheckState.has(activeLesson)?'disabled':''}>${lessonState.has(activeLesson)?'Completed ✓':lessonCheckState.has(activeLesson)?'Mark module complete':'Answer checkpoint to complete'}</button></div>`;
  document.querySelector('.mini-code code').textContent = m.code;
  document.querySelectorAll('.inline-options button').forEach(button => button.onclick = () => {
    const selected = Number(button.dataset.inlineChoice); const correct = selected === m.check.answer;
    document.querySelectorAll('.inline-options button').forEach((option,i) => { option.classList.toggle('wrong',i===selected&&!correct); option.classList.toggle('correct',i===m.check.answer&&correct); });
    const feedback = document.querySelector('.inline-feedback'); feedback.innerHTML = correct ? `<b>Correct.</b> ${m.check.explanations[selected].replace(/^Correct\.\s*/,'')}` : `<b>Not quite.</b> ${m.check.explanations[selected]}`; feedback.className = `inline-feedback show ${correct?'good':'bad'}`;
    if (correct) { lessonCheckState.add(activeLesson); document.querySelectorAll('.inline-options button').forEach(option=>option.disabled=true); const complete=document.querySelector('.complete-lesson'); complete.disabled=false; complete.textContent='Mark module complete'; saveLearningState(); }
  });
  document.querySelector('.complete-lesson').onclick = () => {
    if (lessonState.has(activeLesson)) lessonState.delete(activeLesson); else lessonState.add(activeLesson);
    saveLearningState(); renderCourse(); renderDashboard();
  };
}

function renderGlossary(query = '') {
  const normalized = query.trim().toLowerCase();
  const matches = glossaryTerms.filter(([term, definition]) => `${term} ${definition}`.toLowerCase().includes(normalized));
  document.querySelector('#glossaryGrid').innerHTML = matches.map(([term, definition]) => `<article class="term-card"><h4>${term}</h4><p>${definition}</p></article>`).join('') || '<p>No term found. Try a broader word.</p>';
  document.querySelector('#glossaryCount').textContent = `${matches.length} ${matches.length === 1 ? 'term' : 'terms'}`;
}

document.querySelectorAll('[data-setup]').forEach(input => {
  input.checked = setupState.has(input.dataset.setup);
  input.addEventListener('change', () => {
    if (input.checked) setupState.add(input.dataset.setup); else setupState.delete(input.dataset.setup);
    saveLearningState(); document.querySelector('#setupCount').textContent = `${setupState.size} / 4`;
  });
});
document.querySelector('#setupCount').textContent = `${setupState.size} / 4`;
document.querySelector('#glossarySearch').addEventListener('input', event => renderGlossary(event.target.value));
document.querySelectorAll('.module-card').forEach((card, i) => {
  card.tabIndex = 0; card.setAttribute('role','button'); card.setAttribute('aria-label',`Open module ${i+1}: ${lessonModules[i].title}`);
  const open = () => { activeLesson = i; renderCourse(); document.querySelector('#course').scrollIntoView({behavior:'smooth'}); };
  card.onclick = open; card.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } };
});
renderCourse(); renderDashboard(); renderGlossary();
