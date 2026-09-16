const fs = require('fs');

let html = fs.readFileSync('content/careers.html', 'utf8');

const filterRegex = /<div class="careers-filter reveal">[\s\S]*?<\/div>/;
html = html.replace(filterRegex, `<div class="careers-filter reveal" id="dynamic-filters" style="display:none;"></div>
<div class="careers-filter reveal" id="skeleton-filters" style="display:flex; gap: 8px;">
  <button class="careers-filter__btn is-active" style="width: 100px; height: 38px; background: #e2e8f0; border-color: #e2e8f0; pointer-events: none;"></button>
  <button class="careers-filter__btn" style="width: 120px; height: 38px; background: #e2e8f0; border-color: #e2e8f0; pointer-events: none;"></button>
  <button class="careers-filter__btn" style="width: 150px; height: 38px; background: #e2e8f0; border-color: #e2e8f0; pointer-events: none;"></button>
</div>`);

const gridRegex = /<div class="role-grid reveal">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const newGrid = `<div class="role-grid reveal" id="dynamic-roles" style="display:none;"></div>
<div class="role-grid reveal" id="skeleton-roles" style="display:grid;">
  <style>
    @keyframes skeleton-pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    .sk-box { background: #e2e8f0; border-radius: 4px; animation: skeleton-pulse 1.5s infinite; }
  </style>
  <div class="role-card">
    <div class="sk-box" style="height: 28px; width: 60%; margin-bottom: 12px;"></div>
    <div class="sk-box" style="height: 16px; width: 40%; margin-bottom: 24px;"></div>
    <div class="sk-box" style="height: 60px; width: 100%; margin-bottom: 24px;"></div>
    <div style="display: flex; gap: 8px;">
      <div class="sk-box" style="height: 28px; width: 80px;"></div>
      <div class="sk-box" style="height: 28px; width: 100px;"></div>
    </div>
  </div>
  <div class="role-card">
    <div class="sk-box" style="height: 28px; width: 60%; margin-bottom: 12px;"></div>
    <div class="sk-box" style="height: 16px; width: 40%; margin-bottom: 24px;"></div>
    <div class="sk-box" style="height: 60px; width: 100%; margin-bottom: 24px;"></div>
    <div style="display: flex; gap: 8px;">
      <div class="sk-box" style="height: 28px; width: 80px;"></div>
      <div class="sk-box" style="height: 28px; width: 100px;"></div>
    </div>
  </div>
</div>
      </div>
    </section>`;
html = html.replace(gridRegex, newGrid);

const selectRegex = /<select id="c-role" name="role" required>[\s\S]*?<\/select>/;
const newSelect = `<select id="c-role" name="role" required>
                  <option value="">Select an open position...</option>
                  <option value="General Application / Future Roles">General Application / Future Roles</option>
                </select>`;
html = html.replace(selectRegex, newSelect);

fs.writeFileSync('content/careers.html', html);
console.log("HTML updated");
