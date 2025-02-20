var ID = "test";
var Name = "Test";

// data = {
//     "themes": [{
//         "id": "test",
//         "name": "Theme0",
//         "subthemes": [
//             {
//                 "id": "test", "name": "Subtheme00",
//                 "subsubthemes": [{
//                     "id": "test", "name": "sububtheme000",
//                     "guidelines": [{
//                         "id": 'guideline0001', "descriptor": 'Lorem ipsum dolor sin amet',
//                         "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                     }]
//                 }]
//             },
//             {
//                 "id": "test", "name": "Subtheme01",
//                 "subsubthemes": [{
//                     "id": "test", "name": "sububtheme010",
//                     "guidelines": [{
//                         "id": 'guideline0100', "descriptor": 'Lorem ipsum dolor sin amet',
//                         "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                     }]
//                 }, {
//                     "id": "test", "name": "sububtheme011",
//                     "guidelines": [{
//                         "id": 'guideline0110', "descriptor": 'Lorem ipsum dolor sin amet',
//                         "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                     }]
//                 }]
//             },
//             {
//                 "id": "test", "name": "Subtheme02",
//                 "guidelines": [{
//                     "id": 'guideline020', "descriptor": 'Lorem ipsum dolor sin amet',
//                     "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                 },
//                 {
//                     "id": "test", "name": "Subtheme03",
//                     "guidelines": [{
//                         "id": 'guideline030', "descriptor": 'Lorem ipsum dolor sin amet',
//                         "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                     }]
//                 }]
//             }]
//     },
//     {
//         "id": "test",
//         "name": "Theme1",
//         "guidelines": [{
//             "id": 'guideline11', "descriptor": 'Lorem ipsum dolor sin amet',
//             "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//         },
//         {
//             "id": "test", "name": "Subtheme03",
//             "guidelines": [{
//                 "id": 'guideline12', "descriptor": 'Lorem ipsum dolor sin amet',
//                 "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//             }]
//         }]
//     },
//     {
//         "id": "test",
//         "name": "Theme2",
//         "subthemes": [
//             {
//                 "id": "test", "name": "Subtheme20",
//                 "subsubthemes": [{
//                     "id": "test", "name": "sububtheme200",
//                     "guidelines": [{
//                         "id": 'guideline0001', "descriptor": 'Lorem ipsum dolor sin amet',
//                         "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                     }]
//                 }]
//             },
//             {
//                 "id": "test", "name": "Subtheme22",
//                 "guidelines": [{
//                     "id": 'guideline220', "descriptor": 'Lorem ipsum dolor sin amet',
//                     "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                 },
//                 {
//                     "id": "test", "name": "Subtheme23",
//                     "guidelines": [{
//                         "id": 'guideline230', "descriptor": 'Lorem ipsum dolor sin amet',
//                         "references": [{ "ref": 'reference 00' }, { "ref": 'reference 02' }, { "ref": 'reference 02' }]
//                     }]
//                 }]
//             }]
//     },
//     {
//         "id": "test",
//         "name": "Theme3"
//     },
//     {
//         "id": "test",
//         "name": "Theme4"
//     },
//     {
//         "id": "test",
//         "name": "Theme5"
//     },
//     {
//         "id": "test",
//         "name": "Theme6"
//     },
//     {
//         "id": "test",
//         "name": "Theme7"
//     },
//     {
//         "id": "test",
//         "name": "Theme8"
//     }]
// };

fetch('./assets/data.json')
    .then((response) => response.json())
    .then((data) => {
        function createItem(itemId, itemName, index, lenght) {
            var itemDiv = document.createElement('div');
            itemDiv.id = itemId;
            itemDiv.className = 'item';
            var circleDiv = document.createElement('div');
            circleDiv.id = 'circle';
            var textDiv = document.createElement('div');
            textDiv.id = 'text-wrapper';
            textDiv.innerHTML += itemName;

            circleDiv.appendChild(textDiv);
            itemDiv.appendChild(circleDiv);
            document.getElementById("diagram").appendChild(itemDiv);

            positionItem(index, lenght, itemDiv);

            return itemDiv;
        }

        function positionItem(index, lenght, itemDiv) {
            var centreX = (itemDiv.parentElement.clientWidth - itemDiv.clientHeight) * .5;
            var centreY = (itemDiv.parentElement.clientHeight - itemDiv.clientWidth) * .5;

            var angle = (2 * index / lenght + 1.5) * Math.PI;
            var radius = 0.75 * itemDiv.parentElement.clientWidth * .5;
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
            document.getElementById("title").getElementsByTagName("p")[0].innerHTML=data.themes[st].subthemes[sst].name;
            createItems(data.themes[st].subthemes[sst].subsubthemes);
        } else if (urlParams.has('st')) {
            var st = urlParams.get('st');
            document.getElementById("title").getElementsByTagName("p")[0].innerHTML=data.themes[st].name;
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
                        console.log('guidelines');
                    } else {
                        var st = urlParams.get('st');
                        if (data.themes[st].subthemes[i].subsubthemes != null) {
                            location.href = url + 'st=' + st + '&sst=' + i;
                        }
                        else {
                            console.log('guidelines');
                        }
                    }
                } else if (data.themes[i].subthemes != null) { //&& !urlParams.has('st')
                    location.href = url + 'st=' + i;
                }
                else {
                    console.log('guidelines');
                }
            }
        }

        window.addEventListener('resize', function (event) {
            this.location.reload();
        }, true);

    });