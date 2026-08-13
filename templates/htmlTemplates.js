/**
 * Builds the markup for the "About the Game" overlay.
 * Kept separate from the legal notice so players can read about the
 * game itself without Impressum content mixed in.
 * @returns {string} HTML markup for the about overlay.
 */
function aboutHTML() {
  return `
      <section id="about">
    <h2>About the Game</h2>
    <p>El Pollo Loco is a browser-based jump-and-run game, developed as a portfolio project for the <a href="https://developerakademie.com" target="_blank">Developer Akademie</a> web development bootcamp.</p>
    <p>The game combines classic platforming mechanics with a playful, Mexican-desert theme: collect coins and bottles, defeat chickens along the way, and face off against the final boss to win.</p>
    <h3>Third-Party Assets</h3>
    <p>This project uses free sound effects and icons from <a href="https://pixabay.com" target="_blank">Pixabay</a>, additional icons from <a href="https://flaticon.com" target="_blank">Flaticon</a>, and font resources from <a href="https://fontmeme.com" target="_blank">FontMeme</a>.</p>
</section>`;
}

/**
 * Builds the markup for the legal notice (Impressum) overlay.
 * Only reachable via a discreet link on the start screen, since legal
 * information doesn't need the same visual weight as the game description.
 * @returns {string} HTML markup for the impressum overlay.
 */
function infoHTML() {
  return `
      <section id="impressum">
    <h2>Legal Notice (Impressum)</h2>
    <p><strong>Responsible for content according to § 5 TMG:</strong></p>
    <p>Altin Torba</p>
    <p>Location: Siegen, Germany</p>
    <p>Contact: <a href="mailto:altintorba@gmail.com">altintorba@gmail.com</a></p>
    <p>This website was created as a non-commercial student project.</p>
</section>`;
}

/**
 * Builds the markup for the "How to Play" overlay.
 * @returns {string} HTML markup for the controls overlay.
 */
function controlsHTML() {
  return `
<h2 style="color: #ff9900; font-family: 'Comic Sans MS', sans-serif;">🎮 How to Play!</h2>
<div class="legend" style="font-family: 'Comic Sans MS', sans-serif; font-size: 18px;">
  <p>🤠 <b>Move left</b> – <button class="legend-button">&#8592;</button></p>
  <p>🐥 <b>Move right</b> – <button class="legend-button">&#8594;</button></p>
  <p>🌟 <b>Jump</b> – <button class="legend-button">SPACE</button></p>
  <p>🥫 <b>Throw the bottle</b> – <button class="legend-button">D</button></p>
</div>
    `;
}
