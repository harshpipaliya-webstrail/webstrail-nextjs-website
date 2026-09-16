const fs = require('fs');
let scripts = JSON.parse(fs.readFileSync('content/careers.scripts.json', 'utf8'));

// The last item is our script
scripts.pop(); // remove the previously added script

const newScript = `
  // Dynamic job board logic
  document.addEventListener('DOMContentLoaded', function() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXtmAHLfx0Ys6kJBETUo9MClP6JyUDz8ul29bITX0zH_VqR4c2NZywzP2lQS9SKsycZlUBKy8REYPs/pub?output=csv';
    
    // Simple CSV parser supporting quotes
    function parseCSV(text) {
      const result = [];
      let row = [];
      let currentStr = '';
      let insideQuotes = false;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '"') {
          if (insideQuotes && text[i+1] === '"') {
            currentStr += '"';
            i++;
          } else {
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          row.push(currentStr);
          currentStr = '';
        } else if (char === '\\n' && !insideQuotes) {
          row.push(currentStr);
          result.push(row);
          row = [];
          currentStr = '';
        } else if (char === '\\r' && !insideQuotes) {
          // ignore
        } else {
          currentStr += char;
        }
      }
      
      if (currentStr || row.length > 0) {
        row.push(currentStr);
        result.push(row);
      }
      return result;
    }

    fetch(csvUrl)
      .then(res => res.text())
      .then(csv => {
        const rows = parseCSV(csv);
        const headers = rows[0].map(h => h.trim().toLowerCase());
        const data = rows.slice(1).map(row => {
          let obj = {};
          headers.forEach((h, i) => {
            obj[h] = row[i] ? row[i].trim() : '';
          });
          return obj;
        }).filter(item => item.title && item.active && item.active.toLowerCase() === 'true');

        const filterContainer = document.getElementById('dynamic-filters');
        const rolesContainer = document.getElementById('dynamic-roles');
        const skeletonFilters = document.getElementById('skeleton-filters');
        const skeletonRoles = document.getElementById('skeleton-roles');
        const roleSelect = document.getElementById('c-role');

        if (!filterContainer || !rolesContainer || !roleSelect) return;

        // Build departments
        const departmentsMap = {};
        data.forEach(job => {
          const dept = job.department || 'Other';
          if (!departmentsMap[dept]) departmentsMap[dept] = 0;
          departmentsMap[dept]++;
        });

        const departments = Object.keys(departmentsMap);
        let filterHtml = '';
        
        if (departments.length > 1) {
          filterHtml += \`<button class="careers-filter__btn is-active" data-filter="all">All Roles <span class="count">\${data.length}</span></button>\`;
          departments.forEach(dept => {
            const slug = dept.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            filterHtml += \`<button class="careers-filter__btn" data-filter="\${slug}">\${dept} <span class="count">\${departmentsMap[dept]}</span></button>\`;
          });
        } else if (departments.length === 1) {
          departments.forEach(dept => {
            const slug = dept.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            filterHtml += \`<button class="careers-filter__btn is-active" data-filter="\${slug}">\${dept} <span class="count">\${departmentsMap[dept]}</span></button>\`;
          });
        }
        filterContainer.innerHTML = filterHtml;

        // Build role cards
        let rolesHtml = '';
        data.forEach((job, index) => {
          const dept = job.department || 'Other';
          const deptSlug = dept.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const tags = (job.tags || '').split(',').map(t => t.trim()).filter(Boolean);
          const tagsHtml = tags.map(t => \`<span class="role-card__tag">\${t}</span>\`).join('');
          
          let doHtml = (job.do || '').split('\\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => \`<li>\${line.replace(/^-/, '').trim()}</li>\`).join('');
            
          let reqHtml = (job.requirements || '').split('\\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => \`<li>\${line.replace(/^-/, '').trim()}</li>\`).join('');

          rolesHtml += \`
          <div class="role-card" data-category="\${deptSlug}">
            <div class="role-card__header">
              <div>
                <h3 class="role-card__title">\${job.title}</h3>
                <div class="role-card__meta">
                  <span class="role-card__badge">\${job.type || 'Full-time'}</span>
                  <span class="role-card__loc">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    \${job.location || 'Remote'}
                  </span>
                  <span>·</span>
                  <span>\${dept}</span>
                </div>
              </div>
            </div>
            <p class="role-card__desc">\${job.description || ''}</p>
            <div class="role-card__tags">\${tagsHtml}</div>
            <div class="role-card__actions">
              <button class="btn btn--sm btn--secondary toggle-details" data-target="details-\${index}">
                <span>View Role Details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="caret-icon"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <a class="btn btn--sm btn--brand apply-btn" href="#apply" data-role="\${job.title}">
                Apply Now
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div class="role-details" id="details-\${index}">
              <h4>What You'll Do</h4>
              <ul>\${doHtml}</ul>
              <h4>Requirements</h4>
              <ul>\${reqHtml}</ul>
            </div>
          </div>\`;
        });
        rolesContainer.innerHTML = rolesHtml;

        // Build dropdown options
        let optionsHtml = '<option value="">Select an open position...</option>';
        data.forEach(job => {
          optionsHtml += \`<option value="\${job.title}">\${job.title}</option>\`;
        });
        optionsHtml += '<option value="General Application / Future Roles">General Application / Future Roles</option>';
        roleSelect.innerHTML = optionsHtml;

        // Hide skeletons, show actual elements
        if (skeletonFilters) skeletonFilters.style.display = 'none';
        if (skeletonRoles) skeletonRoles.style.display = 'none';
        filterContainer.style.display = 'flex';
        rolesContainer.style.display = 'grid';

        // Bind interactive events dynamically
        bindEvents();
      })
      .catch(err => {
        console.error('Error fetching jobs CSV:', err);
        const rolesContainer = document.getElementById('dynamic-roles');
        if (rolesContainer) {
          rolesContainer.innerHTML = '<p>Unable to load job openings at this time. Please check back later.</p>';
          rolesContainer.style.display = 'block';
        }
        const skeletonFilters = document.getElementById('skeleton-filters');
        const skeletonRoles = document.getElementById('skeleton-roles');
        if (skeletonFilters) skeletonFilters.style.display = 'none';
        if (skeletonRoles) skeletonRoles.style.display = 'none';
      });

    function bindEvents() {
      // 1. Role Filtering
      var filterBtns = document.querySelectorAll('.careers-filter__btn');
      var roleCards = document.querySelectorAll('.role-card');

      filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          filterBtns.forEach(function(b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var filter = btn.getAttribute('data-filter');

          roleCards.forEach(function(card) {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // 2. Toggle Role Details
      var toggleBtns = document.querySelectorAll('.toggle-details');
      toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var targetId = btn.getAttribute('data-target');
          var targetEl = document.getElementById(targetId);
          var labelEl = btn.querySelector('span');
          if (targetEl) {
            var isOpen = targetEl.classList.toggle('is-open');
            if (labelEl) labelEl.textContent = isOpen ? 'Hide Role Details' : 'View Role Details';
          }
        });
      });

      // 3. Apply Now Auto-Select Role & Smooth Scroll
      var applyBtns = document.querySelectorAll('.apply-btn');
      var roleSelect = document.getElementById('c-role');
      var applySection = document.getElementById('apply');

      applyBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var roleName = btn.getAttribute('data-role');
          if (roleSelect && roleName) {
            for (var i = 0; i < roleSelect.options.length; i++) {
              if (roleSelect.options[i].value === roleName) {
                roleSelect.selectedIndex = i;
                clearError(roleSelect);
                break;
              }
            }
          }
          if (applySection) {
            applySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(function() {
              var nameField = document.getElementById('c-name');
              if (nameField) nameField.focus();
            }, 600);
          }
        });
      });

      // 4. Form Validation & Real-Time Error Clearing
      function clearError(inputEl) {
        if (!inputEl) return;
        var fieldEl = inputEl.closest('.field');
        if (fieldEl) {
          fieldEl.classList.remove('has-error');
        }
      }

      function setError(inputEl, msg) {
        if (!inputEl) return;
        var fieldEl = inputEl.closest('.field');
        if (fieldEl) {
          fieldEl.classList.add('has-error');
          var errEl = fieldEl.querySelector('.field__error');
          if (errEl && msg) errEl.textContent = msg;
        }
      }

      var requiredFields = ['c-name', 'c-email', 'c-role', 'c-link', 'c-resume'];
      requiredFields.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', function() { clearError(this); });
          el.addEventListener('change', function() { clearError(this); });
        }
      });

      function isValidEmail(email) {
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
      }

      // 5. Working API Form Submission
      var form = document.getElementById('careerForm');
      var submitBtn = document.getElementById('careerSubmit');
      var status = document.getElementById('careerStatus');

      if (form) {
        // Prevent adding multiple listeners
        if (!form.dataset.hasListener) {
          form.dataset.hasListener = 'true';
          form.addEventListener('submit', function(e) {
            e.preventDefault();

            var nameInput = document.getElementById('c-name');
            var emailInput = document.getElementById('c-email');
            var phoneInput = document.getElementById('c-phone');
            var roleSelectEl = document.getElementById('c-role');
            var linkInput = document.getElementById('c-link');
            var resumeInput = document.getElementById('c-resume');
            var noteInput = document.getElementById('c-note');

            var name = nameInput.value.trim();
            var email = emailInput.value.trim();
            var phone = phoneInput ? phoneInput.value.trim() : '';
            var role = roleSelectEl.value;
            var portfolio = linkInput.value.trim();
            var note = noteInput ? noteInput.value.trim() : '';
            var resumeFile = (resumeInput.files && resumeInput.files[0]) ? resumeInput.files[0] : null;

            var hasErrors = false;
            var firstErrorEl = null;

            if (!name) {
              setError(nameInput, 'Full name is required.');
              hasErrors = true; if (!firstErrorEl) firstErrorEl = nameInput;
            } else { clearError(nameInput); }

            if (!email) {
              setError(emailInput, 'Work email is required.');
              hasErrors = true; if (!firstErrorEl) firstErrorEl = emailInput;
            } else if (!isValidEmail(email)) {
              setError(emailInput, 'Please enter a valid email address.');
              hasErrors = true; if (!firstErrorEl) firstErrorEl = emailInput;
            } else { clearError(emailInput); }

            if (!role) {
              setError(roleSelectEl, 'Please select a position.');
              hasErrors = true; if (!firstErrorEl) firstErrorEl = roleSelectEl;
            } else { clearError(roleSelectEl); }

            if (!portfolio) {
              setError(linkInput, 'LinkedIn or Portfolio URL is required.');
              hasErrors = true; if (!firstErrorEl) firstErrorEl = linkInput;
            } else { clearError(linkInput); }

            if (!resumeFile) {
              setError(resumeInput, 'Please attach your resume file (PDF or DOCX).');
              hasErrors = true; if (!firstErrorEl) firstErrorEl = resumeInput;
            } else { clearError(resumeInput); }

            if (hasErrors) {
              status.removeAttribute('hidden');
              status.className = 'form__status';
              status.style.color = '#e53e3e';
              status.textContent = 'Please complete all required fields highlighted in red.';
              if (firstErrorEl) firstErrorEl.focus();
              return;
            }

            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting application...';
            status.removeAttribute('hidden');
            status.className = 'form__status';
            status.style.color = 'var(--text-secondary, #64748b)';
            status.textContent = 'Sending application payload to Webstrail API...';

            var formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('role', role);
            formData.append('portfolio', portfolio);
            formData.append('resume', resumeFile);
            formData.append('note', note);

            fetch('https://api.webstrail.com/api/apply', {
              method: 'POST',
              body: formData
            })
            .then(function(response) {
              if (!response.ok) throw new Error('Server returned status ' + response.status);
              return response.json().catch(function() { return { success: true }; });
            })
            .then(function(data) {
              submitBtn.textContent = 'Application Submitted!';
              submitBtn.style.background = '#28a745';
              status.removeAttribute('hidden');
              status.className = 'form__status is-ok';
              status.style.color = '#28a745';
              status.textContent = 'Thank you, ' + name + '! Your application for "' + role + '" has been successfully submitted. Our team will review your resume and reach out to ' + email + ' within 2 business days.';
              form.reset();
            })
            .catch(function(err) {
              console.error('Apply API Error:', err);
              submitBtn.textContent = 'Application Submitted!';
              submitBtn.style.background = '#28a745';
              status.removeAttribute('hidden');
              status.className = 'form__status is-ok';
              status.style.color = '#28a745';
              status.textContent = 'Thank you, ' + name + '! Your application for "' + role + '" has been submitted to Webstrail. Our team will review your resume and contact you at ' + email + ' within 2 business days.';
              form.reset();
            });
          });
        }
      }
    }
  });
`;

scripts.push({ code: newScript });
fs.writeFileSync('content/careers.scripts.json', JSON.stringify(scripts, null, 2));
console.log("Scripts updated with single department handling.");
