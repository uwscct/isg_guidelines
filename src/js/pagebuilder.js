fetch('./assets/data.json')
    .then((response) => response.json())
    .then((data) => {

        function adjustTextSize(circleDiv, textDiv) {
            // Get the available diameter of the circle
            let diameter = circleDiv.offsetWidth;
            // Retrieve the computed font size in pixels
            let style = window.getComputedStyle(textDiv, null);
            let fontSize = parseFloat(style.getPropertyValue('font-size'));
            
            // Decrease the font size until the text fits or reaches a minimum size (e.g., 5px)
            while (textDiv.scrollWidth > diameter && fontSize > 5) {
                fontSize--;
                textDiv.style.fontSize = fontSize + "px";
            }
        }

        function createItem(itemId, itemName, index, length) {
            var itemDiv = document.createElement('div');
            itemDiv.id = itemId;
            itemDiv.className = 'item';
            
            var circleDiv = document.createElement('div');
            circleDiv.id = 'circle';
            
            var textDiv = document.createElement('div');
            textDiv.id = 'text-wrapper';
            textDiv.innerHTML = itemName;
            
            circleDiv.appendChild(textDiv);
            itemDiv.appendChild(circleDiv);
            document.getElementById("diagram").appendChild(itemDiv);

            positionItem(index, length, itemDiv);
            
            // Adjust text size after the element is rendered
            adjustTextSize(circleDiv, textDiv);
            
            return itemDiv;
        }

        function computeCirlceRadius(itemDiv) {
            if (window.innerWidth >= window.innerHeight) {
                itemDiv.setAttribute("style", "width: 20%");
            }
            else {
                itemDiv.setAttribute("style", "width: 35%");
            }
        }

        function computePosRadius() {
            if (window.innerWidth < window.innerHeight)
                return 0.3 * window.innerWidth;
            else
                return 0.35 * window.innerHeight;
        }

        function positionItem(index, length, itemDiv) {
            var centreX = (itemDiv.parentElement.clientWidth - itemDiv.clientHeight) * 0.5;
            var centreY = (itemDiv.parentElement.clientHeight - itemDiv.clientWidth) * 0.5;

            var angle = (2 * index / length + 1.5) * Math.PI;
            var radius = computePosRadius();
            var X = Math.cos(angle) * radius + centreX;
            var Y = Math.sin(angle) * radius + centreY;

            itemDiv.style.left = X + "px";
            itemDiv.style.top = Y + "px";
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString); 
        
        // Always start with #citeas in its default position
        const cite = document.getElementById('citeas');
        cite.classList.remove('guidelines');

        // Declare the timeout handle *before* you use it
        let infoHideTimeout = null;

        // Inject the info‐box container
        const infoBox = document.createElement('div');
        infoBox.id = 'info-box';
        infoBox.innerHTML = '<div id="info-content"></div>';
        document.getElementById('home').appendChild(infoBox);
        
        // Cache the content area
        const infoContent = infoBox.querySelector('#info-content');

        if (!urlParams.has('st')) {
            // Only on the root (diagram) page:
            const welcome = document.createElement('div');
            welcome.id = 'welcome-box';
            welcome.innerHTML = '<h2>Welcome!</h2><p>This site presents a structured overview of key themes and associated design guidelines for Immersive Serious Games (ISGs). Each theme reflects insights from research and practice to inform thoughtful, purposeful ISG development.</p>';
            document.getElementById('home').appendChild(welcome);
        }

        if (urlParams.has('st')) {
            // Determine if you have a sub-theme selected
            const st = urlParams.get('st');
            let currentLabel = data.themes[st].name;
        
            if (urlParams.has('sst')) {
                // On a sub-theme overview
                const sst = urlParams.get('sst');
                currentLabel = data.themes[st].subthemes[sst].name;
            } 
            // else {
            //     // On a theme overview
            //     currentLabel = data.themes[st].name;
            // }
            
            // Render a two‐ or three‐level breadcrumb
            renderBreadcrumb(data, currentLabel);
            }
        
        function renderBreadcrumb(data, currentLabel) {
            // Remove any existing breadcrumb
            const existing = document.getElementById('breadcrumb');
            if (existing) existing.remove();
            
            const bc = document.createElement('div');
            bc.id = 'breadcrumb';

            // Gather each part of the trail
            const parts = [];
            const base = './?';

            // 0) Home always first
            parts.push({ name: 'Home', href: base });
            
            // 1) Theme level
            if (urlParams.has('st')) {
                const st = urlParams.get('st');
                parts.push({
                    name: data.themes[st].name,
                    href: `${base}st=${st}`
                });
        
                // 2) Sub-theme level
                if (urlParams.has('sst')) {
                    const sst = urlParams.get('sst');
                    parts.push({
                        name: data.themes[st].subthemes[sst].name,
                        href: `${base}st=${st}&sst=${sst}`
                    });      
                }
            }

            // 3) Sub-sub-theme link back to itself
            if (currentLabel && parts[parts.length - 1].name !== currentLabel) {
                parts.push({
                    name: currentLabel,
                    href: window.location.href
                });
            }
        
            // Build the inner HTML: each part is an <a>, separated by “>”
            bc.innerHTML = parts.map((p, i) => {
                const link = `<a href="${p.href}">${p.name}</a>`;
                const sep = (i < parts.length - 1) ? `<span class="sep">&gt;</span>` : '';
                return link + sep;
            }).join('');
        
            // Finally, append it into #home, before the rest of the content
            const home = document.getElementById('home');
            home.insertBefore(bc, home.firstChild);
        }
        
        var items = [];
        function createItems(itemsArray) {
            items = [];
            itemsArray.forEach((item, i) => {
                items.push(createItem(item.id, item.name, i, itemsArray.length));
            });
        }

        // Helper: look up info text by circle ID in your data.json
        function getInfoTextById(id) {
            for (const theme of data.themes) {
                if (theme.id === id) return theme.info;
                for (const sub of theme.subthemes || []) {
                    if (sub.id === id) return sub.info;
                    for (const subsub of sub.subsubthemes || []) {
                        if (subsub.id === id) return subsub.info;
                    }
                }
            }
            return ''; // fallback if missing
        }  

        
        if (urlParams.has('st') && urlParams.has('sst')) {
            var st = urlParams.get('st');
            var sst = urlParams.get('sst');
            document.getElementById("title").getElementsByTagName("p")[0].innerHTML = data.themes[st].subthemes[sst].name;
            createItems(data.themes[st].subthemes[sst].subsubthemes);
        } else if (urlParams.has('st')) {
            var st = urlParams.get('st');
            document.getElementById("title").getElementsByTagName("p")[0].innerHTML = data.themes[st].name;
            createItems(data.themes[st].subthemes);
        } else {
            createItems(data.themes);
        }

        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', newPage(i));
        }

        // Clear any hide‐timer when entering either the circle or the box
        function clearInfoBoxHide() {
            clearTimeout(infoHideTimeout);
        }

        // Start a 0.5s hide‐timer when leaving either the circle or the box
        function scheduleInfoBoxHide() {
            // Clear any existing hide timer...
            clearInfoBoxHide();
            // …then schedule it to hide after 0.5 seconds
            infoHideTimeout = setTimeout(() => {
                infoBox.classList.remove('visible');
            }, 500);
        }

        // Attach hover listeners to each circle item
        items.forEach(itemDiv => {
            itemDiv.addEventListener('mouseenter', () => {
                const text = getInfoTextById(itemDiv.id);
                if (text) {
                    infoContent.textContent = text;
                    infoBox.classList.add('visible');
                    clearInfoBoxHide();     // Keep info box visable while inside the circle               
                }
            });
            itemDiv.addEventListener('mouseleave', scheduleInfoBoxHide);  // start timer when leaving circle
        });   
        
        // Keep visible while the pointer is over the box itself
        infoBox.addEventListener('mouseover', () => {
            clearInfoBoxHide();
        });
          infoBox.addEventListener('mouseout', () => {
            scheduleInfoBoxHide();
        });

        var url = './?';
        function newPage(i) {
            return function (event) {
                if (urlParams.has('st')) {
                    if (urlParams.has('sst')) {
                        var st = urlParams.get('st');
                        var sst = urlParams.get('sst');
                        // Grab the clicked sub-sub object
                        const subsub = data.themes[st].subthemes[sst].subsubthemes[i];
                        // Pass its guidelines *and* its name
                        createGuidelinesPage(subsub.guidelines, subsub.name);
                    } else {
                        var st = urlParams.get('st');
                        const sub = data.themes[st].subthemes[i];
                        if (sub.subsubthemes != null) {
                            location.href = url + 'st=' + st + '&sst=' + i;
                        } else {
                            // pass the sub-theme’s name as currentLabel
                            createGuidelinesPage(sub.guidelines, sub.name)
                        }
                    }
                } else if (data.themes[i].subthemes != null) { 
                    location.href = url + 'st=' + i;
                }
                else {
                    // Theme has no sub‐themes → go straight to its guidelines, 
                    // and pass the theme's name so it shows in the breadcrumb:
                    createGuidelinesPage(data.themes[i].guidelines, data.themes[i].name);
                }
            }
        }

        function createGuidelinesPage(guidelines, currentLabel) {                       
            // Clear infobox timer and hide the info-box when we switch to guidelines
            clearTimeout(infoHideTimeout);
            document.getElementById('info-box').classList.remove('visible');
            
            // inject or update the breadcrumb trail using the passed-in label
            renderBreadcrumb(data, currentLabel);            
            document.getElementById("home").removeChild(document.getElementById("diagram"));

            var guidDiv = document.createElement('div');
            guidDiv.id = "gl";

            var scrollableDiv = document.createElement('div');
            scrollableDiv.id = 'scroll';
            scrollableDiv.className = 'scroll';            

            // Re‐position the citeas for guidelines mode
            const cite = document.getElementById('citeas');
            cite.classList.add('guidelines');  
            
            // Move cite into the left panel
            scrollableDiv.appendChild(cite);

            var guidelineShow = document.createElement('div');
            guidelineShow.id = 'show';
            guidelineShow.className = 'show';

            guidDiv.appendChild(scrollableDiv);
            guidDiv.appendChild(guidelineShow);
            document.getElementById("home").appendChild(guidDiv);

            var ul = document.createElement("ul");
            guidelines.forEach(function (el, i) {
                let gl = document.createElement('li');
                gl.className = 'gl-item';
                gl.textContent = el.name;
                gl.addEventListener('click', function () {
                    // Remove the active class from all guideline items
                    document.querySelectorAll('.gl-item.active').forEach(item => item.classList.remove('active'));
                    // Add the active class to the clicked item
                    gl.classList.add('active');
                    // Call your function to display the guideline details
                    showGuideline(el)();
                });
                ul.appendChild(gl);
            });
            scrollableDiv.append(ul);

            function showGuideline(guideline) {
                return function () {
                    // Clear previous guideline content
                    guidelineShow.innerHTML = "";

                    let gltitle = document.createElement('div');
                    gltitle.id = 'gl-title';
                    gltitle.innerHTML = guideline.name;

                    let gldesc = document.createElement('div');
                    gldesc.id = 'gl-desc';
                    gldesc.innerHTML = guideline.descriptor;

                    let glref = document.createElement('div');
                    glref.id = 'gl-ref';
                    guideline.references.forEach(ref => {
                        let refItem = document.createElement('p');
                        refItem.textContent = ref;
                        glref.appendChild(refItem);
                    });

                    let gln = document.createElement('div');
                    gln.id = 'gln';
                    gln.append(gltitle);
                    gln.append(gldesc);
                    gln.append(glref);

                    guidelineShow.append(gln);
                }
            }
        }

        let resizeTimeout;
        window.addEventListener('resize', function (event) {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function () {
                items.forEach(function (el, i) {
                    computeCirlceRadius(el);
                    positionItem(i, items.length, el);
                });
                resizeTimeout = null;
            }, 50);
        }, true);
    });
