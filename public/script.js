document.addEventListener('DOMContentLoaded', function () {
    fetchWords();

    const wordInput = document.getElementById('wordInput');
    const addButton = document.getElementById('addButton');
    const wordList = document.getElementById('wordList');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const saveButton = document.getElementById('saveButton');
    const meaningInput = document.getElementById('meaningInput');
    const linkInput = document.getElementById('linkInput');
    let currentWord = '';

    wordInput.addEventListener('input', () => {
        addButton.disabled = !wordInput.value.trim();
    });

    wordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !addButton.disabled) {
            event.preventDefault();
            addWord();
        }
    });

    addButton.addEventListener('click', addWord);

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        const meaning = meaningInput.value.trim();
        const link = linkInput.value.trim();
        if (meaning && link) {
            saveNewWord(currentWord, meaning, link);
            modal.style.display = 'none';
        }
    });

    function addWord() {
        currentWord = wordInput.value.trim().toLowerCase();
        if (currentWord) {
            fetch(`/words/check/${currentWord}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        showBanner();
                    } else {
                        meaningInput.value = '';
                        linkInput.value = '';
                        modal.style.display = 'flex';
                    }
                })
                .catch(error => {
                    console.error('Error checking word existence:', error);
                });
        }
        wordInput.value = '';
        addButton.disabled = true;
    }
    

    // Function to handle word deletion
    function deleteWord(infinitif) {
        fetch('/words', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ infinitif })
        })
            .then(response => {
                if (response.ok) {
                    fetchWords(); // Refresh the list after deletion
                }
            });
    }
    function cleanWord(word_infinitif){
        cleaned_infinitif = word_infinitif.replace("'",'');
        cleaned_infinitif = cleaned_infinitif.replace(" ",'-');
        //console.log(word_infinitif, '--->', cleaned_infinitif);
        return cleaned_infinitif;
    }

    function fetchWords() {
        fetch('/words')
            .then(response => response.json())
            .then(words => {
                wordList.innerHTML = '';
                words.sort((a, b) => a.infinitif.localeCompare(b.infinitif)).forEach(word => {
                    const wordElement = document.createElement('div');
                    wordElement.className = 'word-item';
                    wordElement.title = word.meaning;
                    wordElement.innerHTML = `
                        <input type="checkbox" ${word.is_conjugated ? 'checked' : ''} id="check-${cleanWord(word.infinitif)}">
                        <a href="${word.conjugation_link}" class="word-link">${word.infinitif}
                            <div class="tooltip">${word.meaning}</div>
                        </a>
                        <div class="delete-btn">&times;</div>
                    `;

                    // Event listener for the delete button
                    const deleteBtn = wordElement.querySelector('.delete-btn');
                    deleteBtn.onclick = () => deleteWord(word.infinitif);

                    // Event listener for checkbox to update conjugation status
                    const checkbox = wordElement.querySelector(`#check-${cleanWord(word.infinitif)}`);
                    checkbox.onchange = (e) => updateConjugated(word.infinitif, e.target.checked);

                    wordList.appendChild(wordElement);
                });
            });
    }



    function saveNewWord(infinitif, meaning, is_conjugated, conjugation_link) {
        fetch('/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([ infinitif, meaning, false, conjugation_link ])
        })
            .then(response => response.json())
            .then(data => {
                fetchWords();
            });
    }

    function updateConjugated(infinitif, is_conjugated) {
        fetch('/words', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ infinitif, is_conjugated })
        })
            .then(response => response.json())
            .then(data => {
                fetchWords();
            });
    }

    function showBanner() {
        const banner = document.getElementById('banner');
        banner.style.display = 'block';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 3000);
    }
});