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

        var items = [];
        function createItems(itemsArray) {
            items = [];
            itemsArray.forEach((item, i) => {
                items.push(createItem(item.id, item.name, i, itemsArray.length));
            });
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

        var url = './?';
        function newPage(i) {
            return function (event) {
                if (urlParams.has('st')) {
                    if (urlParams.has('sst')) {
                        var st = urlParams.get('st');
                        var sst = urlParams.get('sst');
                        createGuidelinesPage(data.themes[st].subthemes[sst].subsubthemes[i].guidelines);
                        // console.log('guidelines');
                    } else {
                        var st = urlParams.get('st');
                        if (data.themes[st].subthemes[i].subsubthemes != null) {
                            location.href = url + 'st=' + st + '&sst=' + i;
                        }
                        else {
                            createGuidelinesPage(data.themes[st].subthemes[i].guidelines);
                            // console.log('guidelines');
                        }
                    }
                } else if (data.themes[i].subthemes != null) { 
                    location.href = url + 'st=' + i;
                }
                else {
                    createGuidelinesPage(data.themes[i].guidelines);
                    // console.log('guidelines');
                }
            }
        }

        function createGuidelinesPage(guidelines) {
            document.getElementById("home").removeChild(document.getElementById("diagram"));

            var guidDiv = document.createElement('div');
            guidDiv.id = "gl";

            var scrollableDiv = document.createElement('div');
            scrollableDiv.id = 'scroll';
            scrollableDiv.className = 'scroll';

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
