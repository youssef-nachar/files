<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Files</title>
    <link rel="stylesheet" href="./cruds.css">
    <link rel="stylesheet" href="./my-portfolio.css">
    <style>
        .plus-icon {
            cursor: pointer;
            font-size: 20px;
            margin-left: 10px;
        }

        .file-list {
            display: none;
            margin-left: 20px;
            margin-top: 5px;
        }

        .file-item {
            margin: 5px 0;
        }
    </style>
</head>

<body>
    <header>
        <div class="logo">
            <img class="the_logo"
                src="https://vistak.co/wp-content/uploads/elementor/thumbs/Mask-group-2023-01-05T190619.602-78prqkfjr2p9lghzmxnl3zlzvs04odujirol7dmcjvk.png">
        </div>
        <ul class="navlist"></ul>
        <div id="menu-icon" class="bx bx-menu"></div>
        <li><a href="logout.html" style="--i:6; color:#c0adc9">Log out</a></li>
    </header>

    <div class="crud">
        <div class="head">
            <h2>Your Files</h2>
        </div>
        <div class="inputs">
            <input type="text" id="folderTitle" placeholder="Folder Title">
            <button id="submit" onclick="createFolder()">Create Folder</button>
            <br><br>
            <select id="folderSelect">
                <option value="">Select Folder</option>
            </select>
            <input class="upload" type="file" id="fileInput" onchange="handleFileSelect(event)" multiple>
        </div>
        <div class="outputs">
            <div class="searchBlock">
                <input onkeyup="searchData(this.value)" type="text" placeholder="Search" id="search">
                <div class="btnSearch">
                    <button onclick="getSearchMood(this.id)" id="searchTitle">Search by Title</button>
                </div>
            </div>

            <table>
                <tr>
                    <th>Folder Name</th>
                    <th id="filss">Files</th>
                    <th>Delete</th>
                </tr>
                <tbody id="tbody"></tbody>
            </table>
        </div>
    </div>

    <script src="https://apis.google.com/js/api.js"></script>
    <script>
        let folders = JSON.parse(localStorage.getItem('folders')) || [];

        function createFolder() {
            const folderTitle = document.getElementById('folderTitle').value;
            if (folderTitle) {
                const existingFolder = folders.find(folder => folder.title === folderTitle);
                if (!existingFolder) {
                    const newFolder = {
                        title: folderTitle,
                        files: []
                    };
                    folders.push(newFolder);
                    localStorage.setItem('folders', JSON.stringify(folders));
                    showData();
                    updateFolderSelect();
                    document.getElementById('folderTitle').value = ''; // Clear input field
                } else {
                    alert('Folder already exists!');
                }
            } else {
                alert('Please enter a folder title.');
            }
        }

        function handleFileSelect(event) {
            const files = event.target.files;
            const folderSelect = document.getElementById('folderSelect');
            const folderTitle = folderSelect.value;

            if (files.length === 0 || !folderTitle) {
                alert("Please select a folder and file(s).");
                return;
            }

            const folderIndex = folders.findIndex(folder => folder.title === folderTitle);
            if (folderIndex !== -1) {
                Array.from(files).forEach(file => {
                    uploadFileToDrive(file, folderTitle);
                });
            } else {
                alert('Please select a folder first!');
            }
        }

        function uploadFileToDrive(file, folderTitle) {
            // Initialize the Google API client
            gapi.load('client:auth2', initClient);

            function initClient() {
                gapi.client.init({
                    apiKey: 'YOUR_API_KEY', // Add your API key here
                    clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Add your client ID here
                    scope: 'https://www.googleapis.com/auth/drive.file',
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
                }).then(function () {
                    gapi.auth2.getAuthInstance().signIn().then(function () {
                        const formData = new FormData();
                        formData.append('file', file);

                        const metadata = {
                            name: file.name,
                            mimeType: file.type
                        };

                        const request = gapi.client.drive.files.create({
                            resource: metadata,
                            media: {
                                mimeType: file.type,
                                body: formData
                            },
                            fields: 'id, webViewLink'
                        });

                        request.execute(function (file) {
                            if (file.id) {
                                const fileMetadata = {
                                    name: file.name,
                                    url: file.webViewLink // Use the Google Drive public URL
                                };

                                const folderIndex = folders.findIndex(folder => folder.title === folderTitle);
                                if (folderIndex !== -1) {
                                    folders[folderIndex].files.push(fileMetadata);
                                    localStorage.setItem('folders', JSON.stringify(folders));
                                    showData();
                                }
                            }
                        });
                    });
                });
            }
        }

        function showData() {
            let table = '';
            folders.forEach((folder, index) => {
                table += `<tr>
                    <td>${folder.title} <span class="plus-icon" onclick="toggleFiles(${index}, this)">+</span></td>
                    <td>
                        <div class="file-list" id="file-list-${index}">
                            ${folder.files.length > 0 ? folder.files.map(file => `
                                <div class="file-item">
                                    <a href="${file.url}" target="_blank">${file.name}</a>
                                </div>`).join('') : 'No files'}
                        </div>
                    </td>
                    <td><button onclick="deleteFolder(${index})">Delete Folder</button></td>
                </tr>`;
            });

            document.getElementById('tbody').innerHTML = table;
        }

        function toggleFiles(index, icon) {
            const fileList = document.getElementById(`file-list-${index}`);
            const isVisible = fileList.style.display === 'block';
            fileList.style.display = isVisible ? 'none' : 'block';
            icon.innerText = isVisible ? '+' : '-';
        }

        function deleteFolder(index) {
            const isConfirmed = confirm("Are you sure you want to delete this folder? This action cannot be undone.");
            if (isConfirmed) {
                folders.splice(index, 1);
                localStorage.setItem('folders', JSON.stringify(folders));
                showData();
                updateFolderSelect();
            }
        }

        function searchData(value) {
            const rows = document.getElementById('tbody').rows;
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                const titleCell = row.cells[0].innerText.toLowerCase();
                row.style.display = titleCell.includes(value.toLowerCase()) ? '' : 'none';
            }
        }

        function updateFolderSelect() {
            const folderSelect = document.getElementById('folderSelect');
            folderSelect.innerHTML = '<option value="">Select Folder</option>';
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.title;
                option.textContent = folder.title;
                folderSelect.appendChild(option);
            });
        }

        showData();
        updateFolderSelect();
    </script>

</body>

</html>
